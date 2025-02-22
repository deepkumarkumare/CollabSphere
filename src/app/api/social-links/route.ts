// app/api/social-links/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import UserProfile from '@/models/UserProfile';
import dbConnect from '@/lib/mongodb';

export async function PUT(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const socialLinks = await req.json();
    await dbConnect();
    console.log('Updating social links:', socialLinks, 'for user:', userId);

    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $set: { socialLinks } },
      { new: true, upsert: true }
    );

    if (!profile) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    console.log('Updated profile with social links:', profile);
    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating social links:', error);
    // return NextResponse.json({ error: error.message }, { status: 500 });
  }
}