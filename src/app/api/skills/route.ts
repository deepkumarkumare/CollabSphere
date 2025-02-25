// app/api/skills/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import UserProfile from '@/models/UserProfile';
import dbConnect from '@/lib/mongodb';

// Helper function to ensure user exists or create a new one
async function ensureUserExists(userId: string) {
  await dbConnect();
  let profile = await UserProfile.findOne({ userId });

  if (!profile) {
    // Create a new user profile if it doesn't exist
    profile = new UserProfile({
      userId,
      image: '', // Default or fetch from Clerk if available
      skills: [],
      interests: [],
      posts: [],
      projects: [],
      socialLinks: {},
    });
    await profile.save();
  }
  return profile;
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { skill } = await req.json();
    if (!skill || typeof skill !== 'string') {
      return NextResponse.json({ error: 'Skill name is required and must be a string' }, { status: 400 });
    }

    await ensureUserExists(userId); // Ensure user exists before updating

    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $push: { skills: { name: skill } } },
      { new: true } // Return the updated document
    );

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/skills:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { skillId, name } = await req.json();
    if (!skillId || !name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Skill ID and name are required' }, { status: 400 });
    }

    await ensureUserExists(userId); // Ensure user exists

    const profile = await UserProfile.findOneAndUpdate(
      { userId, 'skills._id': skillId },
      { $set: { 'skills.$.name': name } },
      { new: true }
    );

    if (!profile) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/skills:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { skillId } = await req.json();
    if (!skillId) {
      return NextResponse.json({ error: 'Skill ID is required' }, { status: 400 });
    }

    await ensureUserExists(userId); // Ensure user exists

    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $pull: { skills: { _id: skillId } } },
      { new: true }
    );

    if (!profile) {
      return NextResponse.json({ error: 'Profile or skill not found' }, { status: 404 });
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/skills:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}