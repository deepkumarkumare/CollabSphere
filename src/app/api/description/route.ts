import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import dbConnect from '@/lib/mongodb';
import UserModel from '@/models/User';

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    await dbConnect();
    let user = await UserModel.findOne({ clerkId: userId });
    
    if (!user) {
      user = await UserModel.create({ clerkId: userId });
    }
    
    return NextResponse.json({ description: user.description });
  } catch (error) {
    console.error('Database error:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: `Database connection failed: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: 'Unknown error occurred' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  
  if (!userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { description } = await req.json();
  
  if (typeof description !== 'string') {
    return NextResponse.json(
      { message: 'Invalid description' },
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const user = await UserModel.findOneAndUpdate(
      { clerkId: userId },
      { description, updatedAt: new Date() },
      { new: true, upsert: true }
    );
    
    return NextResponse.json({ description: user.description });
  } catch (error) {
    console.error('Database error:', error);
    if (error instanceof Error) {
      return NextResponse.json(
        { message: `Database operation failed: ${error.message}` },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: 'Unknown error occurred' },
      { status: 500 }
    );
  }
}