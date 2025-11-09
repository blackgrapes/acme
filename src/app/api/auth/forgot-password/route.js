import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import connectDB  from '@/lib/db';
import User from '@/lib/models/User';
import PasswordReset from '@/lib/models/PasswordReset';
import EmailLimit from '@/lib/models/EmailLimit';
import FallbackRequest from '@/lib/models/FallbackRequest';

// Configuration
const DAILY_EMAIL_LIMIT = 295;
const PER_USER_DAILY_LIMIT = 2;


export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    console.log('📧 Forgot password request for:', email);

    // Connect to database
    await connectDB();

    // Check if user exists
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // For security, don't reveal if email exists
      console.log('❌ User not found (but not revealing):', email);
      return NextResponse.json({ 
        message: 'If this email exists in our system, you will receive a password reset link.' 
      });
    }

    console.log('✅ User found:', user.email);

    // Check email limits
    const limitCheck = await checkEmailLimits(email);
    if (!limitCheck.allowed) {
      console.log('📝 Creating fallback request due to limits');
      await createFallbackRequest(email, limitCheck.reason, true);
      
      return NextResponse.json({ 
        message: 'Your password reset request has been recorded. An admin will contact you shortly.',
        method: 'fallback'
      });
    }

    // Check if email service is enabled
    const emailServiceEnabled = process.env.EMAIL_SERVICE_ENABLED === 'true';
    const hasBrevoCredentials = process.env.BREVO_SMTP_USER && process.env.BREVO_SMTP_PASSWORD;

    if (emailServiceEnabled && hasBrevoCredentials) {
      // Try to send email via Brevo
      try {
        await sendBrevoEmail(email);
        
        // Update email counts after successful send
        await updateEmailCounts(email);
        
        return NextResponse.json({ 
          message: 'Password reset link has been sent to your email.',
          method: 'email'
        });
      } catch (emailError) {
        console.error('❌ Email sending failed:', emailError.message);
        
        // If Brevo fails, create fallback request
        await createFallbackRequest(email, 'EMAIL_SERVICE_FAILED', true);

        return NextResponse.json({ 
          message: 'Your password reset request has been recorded. An admin will contact you shortly.',
          method: 'fallback'
        });
      }
    } else {
      // Email service disabled, create fallback request
      console.log('📝 Creating fallback request - email service disabled');
      await createFallbackRequest(email, 'EMAIL_SERVICE_DISABLED', true);

      return NextResponse.json({ 
        message: 'Your password reset request has been recorded. An admin will contact you shortly.',
        method: 'fallback'
      });
    }
  } catch (error) {
    console.error('💥 Forgot password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ✅ FIXED: Improved checkEmailLimits function
async function checkEmailLimits(email) {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Find or create today's limit record
    let limitRecord = await EmailLimit.findOne({ date: today });
    if (!limitRecord) {
      limitRecord = new EmailLimit({ 
        date: today,
        userCounts: []
      });
      await limitRecord.save();
    }

    // Check daily overall limit
    if (limitRecord.dailyCount >= DAILY_EMAIL_LIMIT) {
      return {
        allowed: false,
        reason: 'DAILY_LIMIT_EXCEEDED'
      };
    }

    // Check per user limit
    const userCountEntry = limitRecord.userCounts.find(entry => 
      entry.email === email
    );
    const userEmailCount = userCountEntry ? userCountEntry.count : 0;

    if (userEmailCount >= PER_USER_DAILY_LIMIT) {
      return {
        allowed: false,
        reason: 'USER_LIMIT_EXCEEDED'
      };
    }

    return { allowed: true };
  } catch (error) {
    console.error('Error checking email limits:', error);
    // If there's an error checking limits, allow the request (fail open)
    return { allowed: true };
  }
}

// ✅ FIXED: Improved updateEmailCounts function
async function updateEmailCounts(email) {
  try {
    const today = new Date().toISOString().split('T')[0];

    let limitRecord = await EmailLimit.findOne({ date: today });
    if (!limitRecord) {
      limitRecord = new EmailLimit({ 
        date: today,
        userCounts: []
      });
    }

    // Update daily count
    limitRecord.dailyCount += 1;
    
    // Update user count
    const userCountIndex = limitRecord.userCounts.findIndex(entry => 
      entry.email === email
    );
    
    if (userCountIndex >= 0) {
      // Existing user - increment count
      limitRecord.userCounts[userCountIndex].count += 1;
    } else {
      // New user - add entry
      limitRecord.userCounts.push({ 
        email: email, // ✅ Ensure email is properly set
        count: 1 
      });
    }

    await limitRecord.save();

    console.log('📊 Email counts updated successfully for:', email);
    console.log('📈 Daily count:', limitRecord.dailyCount);
    console.log('👤 User count:', limitRecord.userCounts.find(entry => entry.email === email)?.count || 0);

  } catch (error) {
    console.error('❌ Error updating email counts:', error);
    // Don't throw error - we don't want to block the email because of counting issues
  }
}

// ✅ FIXED: Improved sendBrevoEmail function with better error handling
async function sendBrevoEmail(email) {
  console.log('🔐 Attempting to send email via Brevo...');

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp-relay.brevo.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_SMTP_USER,
        pass: process.env.BREVO_SMTP_PASSWORD
      }
    });

    // Verify connection configuration
    await transporter.verify();
    console.log('✅ SMTP connection verified');

    // Generate secure reset token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

    // Save reset token to database
    const passwordReset = new PasswordReset({
      email: email.toLowerCase(),
      token: resetToken,
      expiresAt: expiresAt
    });
    await passwordReset.save();
    console.log('💾 Reset token saved to database');

    const resetUrl = `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;

    const mailOptions = {
      from: `"${process.env.BREVO_SMTP_NAME || 'ACME Security'}" <${process.env.BREVO_SMTP_SENDER}>`,
      to: email,
      subject: 'Reset Your Password - ACME Security',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
          <div style="text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; border-radius: 10px 10px 0 0; color: white;">
            <h1 style="margin: 0;">ACME Security</h1>
          </div>
          <div style="padding: 20px;">
            <h2 style="color: #333;">Password Reset Request</h2>
            <p>Hello,</p>
            <p>You requested to reset your password for your ACME Security account.</p>
            <p>Click the button below to create a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" 
                 style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 30px; 
                        text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
                Reset Password
              </a>
            </div>
            <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
            <p style="color: #666; font-size: 14px;">If you didn't request this, please ignore this email.</p>
          </div>
          <div style="background: #f5f5f5; padding: 15px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #666;">
            <p>ACME Security Services</p>
            <p>Professional security service provider</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Brevo email sent successfully to:', email);
    console.log('📨 Message ID:', info.messageId);
    console.log('🔗 Reset URL:', resetUrl);
    
  } catch (error) {
    console.error('❌ Brevo email failed:', error.message);
    throw error; // Re-throw to be caught by the main try-catch
  }
}

async function createFallbackRequest(email, reason, userExists) {
  try {
    const fallbackRequest = new FallbackRequest({
      email: email.toLowerCase(),
      reason: reason,
      userExists: userExists
    });

    await fallbackRequest.save();
    console.log('📝 Fallback request created in database for:', email);
  } catch (error) {
    console.error('❌ Error creating fallback request:', error);
  }
}

// Add other HTTP methods
export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}