import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import  connectDB  from '@/lib/db';
import User from '@/lib/models/User';
import PasswordReset from '@/lib/models/PasswordReset';

export async function POST(request) {
  try {
    const { token, email, password } = await request.json();

    console.log('Reset password request:', { 
      email, 
      tokenLength: token?.length 
    });

    // Validation
    if (!token || !email || !password) {
      return NextResponse.json(
        { error: 'Token, email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    await connectDB();

    // Find valid reset token
    const resetRecord = await PasswordReset.findOne({
      token: token,
      email: email.toLowerCase(),
      expiresAt: { $gt: new Date() },
      used: false
    });

    if (!resetRecord) {
      console.log('Invalid or expired reset token for:', email);
      return NextResponse.json(
        { error: 'Invalid or expired reset token. Please request a new reset link.' },
        { status: 400 }
      );
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      console.log('User not found during reset:', email);
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    console.log('Valid reset token and user found for:', email);

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Update user's password
    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { 
        password: hashedPassword,
        lastPasswordReset: new Date()
      }
    );

    // Mark reset token as used
    await PasswordReset.findOneAndUpdate(
      { token: token },
      { used: true }
    );

    console.log('Password reset successful for:', email);

    return NextResponse.json({ 
      message: 'Password reset successfully. You can now login with your new password.',
      user: {
        id: user._id,
        email: user.email,
        name: user.name
      }
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
}