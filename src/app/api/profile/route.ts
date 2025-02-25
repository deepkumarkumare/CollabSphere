// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import UserProfile from '@/models/UserProfile';
import dbConnect from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    console.error('No userId from auth');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await dbConnect();
  console.log('Fetching profile for userId:', userId);
  const profile = await UserProfile.findOne({ userId });
  console.log('Found profile:', profile);
  return NextResponse.json(profile || {});
}

export async function PUT(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) {
    console.error('No userId from auth');
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { image, email } = await req.json();
  await dbConnect();
  
  console.log('Updating/Creating profile for userId:', userId, 'email:', email);
  const updateData: any = {};
  if (image !== undefined) updateData.image = image;
  if (email !== undefined) updateData.email = email;

  const profile = await UserProfile.findOneAndUpdate(
    { userId },
    { $set: updateData },
    { new: true, upsert: true }
  );
  console.log('Updated profile:', profile);
  return NextResponse.json(profile);
}