// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import UserProfile from '@/models/UserProfile';
import dbConnect from '@/lib/mongodb';


export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const projectData = await req.json();
  await dbConnect();
  
  const profile = await UserProfile.findOneAndUpdate(
    { userId },
    { $push: { projects: projectData } },
    { new: true, upsert: true }
  );
  return NextResponse.json(profile);
}

export async function DELETE(req: NextRequest) {
  const { userId } = getAuth(req);
  const { projectId } = await req.json();
  
  await dbConnect();
  const profile = await UserProfile.findOneAndUpdate(
    { userId },
    { $pull: { projects: { _id: projectId } } },
    { new: true }
  );
  return NextResponse.json(profile);
}