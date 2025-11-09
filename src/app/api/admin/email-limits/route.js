import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import EmailLimit from '@/lib/models/EmailLimit';

const DAILY_EMAIL_LIMIT = 295;
const PER_USER_DAILY_LIMIT = 2;



export async function GET() {
  try {
    await connectDB();

    const today = new Date().toISOString().split('T')[0];
    
    let limitRecord = await EmailLimit.findOne({ date: today });
    if (!limitRecord) {
      limitRecord = new EmailLimit({ 
        date: today,
        userCounts: []
      });
      await limitRecord.save();
    }

    // ✅ FIXED: Use array mapping instead of Map entries
    const userCountsArray = limitRecord.userCounts.map(userCount => ({
      email: userCount.email,
      count: userCount.count,
      limit: PER_USER_DAILY_LIMIT,
      status: userCount.count >= PER_USER_DAILY_LIMIT ? 'Limit Reached' : 'Active'
    }));

    const response = {
      dailyCount: limitRecord.dailyCount,
      dailyLimit: DAILY_EMAIL_LIMIT,
      remainingDaily: Math.max(0, DAILY_EMAIL_LIMIT - limitRecord.dailyCount),
      perUserLimit: PER_USER_DAILY_LIMIT,
      userCounts: userCountsArray,
      lastReset: limitRecord.date,
      createdAt: limitRecord.createdAt
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching email limits:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { action } = await request.json();

    if (action === 'reset') {
      await connectDB();

      const today = new Date().toISOString().split('T')[0];
      
      await EmailLimit.findOneAndUpdate(
        { date: today },
        { 
          dailyCount: 0,
          userCounts: [] // ✅ FIXED: Reset to empty array
        },
        { upsert: true, new: true }
      );

      return NextResponse.json({ 
        message: 'Email limits reset successfully for today',
        date: today
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error resetting email limits:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
