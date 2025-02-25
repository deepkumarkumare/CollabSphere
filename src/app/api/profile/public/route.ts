// app/api/profile/public/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import UserProfile from '@/models/UserProfile';
import dbConnect from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  try {
    const { userId: currentUserId } = getAuth(req);
    if (!currentUserId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { userId } = await req.json();
    if (!userId) return NextResponse.json({ error: 'User ID is required' }, { status: 400 });

    await dbConnect();
    
    const profile = await UserProfile.findOne({ 
      userId: userId // Removed duplicate userId property
    }).select('skills interests projects socialLinks')
      .where('userId').ne(currentUserId); // Moved $ne condition to where clause

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching public profile:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}