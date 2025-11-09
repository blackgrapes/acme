import { NextResponse } from 'next/server';
import connectDB  from '@/lib/db';
import FallbackRequest from '@/lib/models/FallbackRequest';
import User from '@/lib/models/User';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

// Get all fallback requests
export async function GET() {
  try {
    await connectDB();

    const requests = await FallbackRequest.find()
      .sort({ createdAt: -1 })
      .limit(100)
      .populate('completedBy', 'name email');

    return NextResponse.json({ requests });
  } catch (error) {
    console.error('Error fetching fallback requests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Update fallback request status
export async function PUT(request) {
  try {
    const { requestId, status, adminNotes, newPassword, completedBy } = await request.json();

    if (!requestId || !status) {
      return NextResponse.json(
        { error: 'Request ID and status are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const fallbackRequest = await FallbackRequest.findById(requestId);
    if (!fallbackRequest) {
      return NextResponse.json(
        { error: 'Fallback request not found' },
        { status: 404 }
      );
    }

    // ✅ FIXED: Validate and convert completedBy to ObjectId if provided
    let completedByObjectId = null;
    if (completedBy && mongoose.Types.ObjectId.isValid(completedBy)) {
      completedByObjectId = new mongoose.Types.ObjectId(completedBy);
    } else if (completedBy) {
      console.log('⚠️ Invalid completedBy ID, setting to null:', completedBy);
    }

    // If completing the request and user exists, update password
    if (status === 'completed' && fallbackRequest.userExists && newPassword) {
      const user = await User.findOne({ email: fallbackRequest.email });
      if (user) {
        const hashedPassword = await bcrypt.hash(newPassword, 12);
        await User.findOneAndUpdate(
          { email: fallbackRequest.email },
          { 
            password: hashedPassword,
            lastPasswordReset: new Date()
          }
        );
        console.log('✅ Password updated for:', fallbackRequest.email);
      } else {
        console.log('⚠️ User not found for password update:', fallbackRequest.email);
      }
    }

    // ✅ FIXED: Update fallback request with proper ObjectId
    const updateData = {
      status,
      adminNotes: adminNotes || '',
      completedAt: status === 'completed' ? new Date() : null,
      completedBy: status === 'completed' ? completedByObjectId : null
    };

    // Remove completedBy from updateData if it's null to avoid validation issues
    if (updateData.completedBy === null) {
      delete updateData.completedBy;
    }

    const updatedRequest = await FallbackRequest.findByIdAndUpdate(
      requestId, 
      updateData,
      { new: true }
    ).populate('completedBy', 'name email');

    return NextResponse.json({ 
      message: 'Fallback request updated successfully',
      request: updatedRequest
    });

  } catch (error) {
    console.error('Error updating fallback request:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// Create new fallback request (if needed)
export async function POST(request) {
  try {
    const { email, reason, userExists } = await request.json();

    if (!email || !reason) {
      return NextResponse.json(
        { error: 'Email and reason are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const fallbackRequest = new FallbackRequest({
      email: email.toLowerCase(),
      reason: reason,
      userExists: userExists !== undefined ? userExists : true
    });

    await fallbackRequest.save();

    return NextResponse.json({ 
      message: 'Fallback request created successfully',
      request: fallbackRequest
    });

  } catch (error) {
    console.error('Error creating fallback request:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}