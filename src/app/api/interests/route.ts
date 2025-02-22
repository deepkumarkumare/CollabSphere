// app/api/interests/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import UserProfile from '@/models/UserProfile';
import dbConnect from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { interest } = await req.json();
  await dbConnect();
  
  const profile = await UserProfile.findOneAndUpdate(
    { userId },
    { $push: { interests: { name: interest } } },
    { new: true, upsert: true }
  );
  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest) {
  const { userId } = getAuth(req);
  const { interestId, name } = await req.json();
  
  await dbConnect();
  const profile = await UserProfile.findOneAndUpdate(
    { userId, 'interests._id': interestId },
    { $set: { 'interests.$.name': name } },
    { new: true }
  );
  return NextResponse.json(profile);
}

export async function DELETE(req: NextRequest) {
  const { userId } = getAuth(req);
  const { interestId } = await req.json();
  
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const profile = await UserProfile.findOneAndUpdate(
    { userId },
    { $pull: { interests: { _id: interestId } } },
    { new: true }
  );
  return NextResponse.json(profile);
}