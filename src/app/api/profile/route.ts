// app/api/profile/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
// import UserProfile from '@/models/UserProfile';
import UserProfile from '@/models/UserProfile';
import dbConnect from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const profile = await UserProfile.findOne({ userId });
  return NextResponse.json(profile || {});
}

export async function PUT(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { image } = await req.json();
  await dbConnect();
  
  const profile = await UserProfile.findOneAndUpdate(
    { userId },
    { image },
    { new: true, upsert: true }
  );
  return NextResponse.json(profile);
}