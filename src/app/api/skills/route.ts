// app/api/skills/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import UserProfile from '@/models/UserProfile';
import dbConnect from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { skill } = await req.json();
  await dbConnect();
  
  const profile = await UserProfile.findOneAndUpdate(
    { userId },
    { $push: { skills: { name: skill } } },
    { new: true, upsert: true }
  );
  return NextResponse.json(profile);
}

export async function PUT(req: NextRequest) {
  const { userId } = getAuth(req);
  const { skillId, name } = await req.json();
  
  await dbConnect();
  const profile = await UserProfile.findOneAndUpdate(
    { userId, 'skills._id': skillId },
    { $set: { 'skills.$.name': name } },
    { new: true }
  );
  return NextResponse.json(profile);
}

export async function DELETE(req: NextRequest) {
  const { userId } = getAuth(req);
  const { skillId } = await req.json();
  
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  await dbConnect();
  const profile = await UserProfile.findOneAndUpdate(
    { userId },
    { $pull: { skills: { _id: skillId } } },
    { new: true }
  );
  return NextResponse.json(profile);
}