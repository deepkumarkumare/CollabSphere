// app/api/interests/route.ts
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
      image: '',
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

    const { interest } = await req.json();
    if (!interest || typeof interest !== 'string') {
      return NextResponse.json({ error: 'Interest name is required and must be a string' }, { status: 400 });
    }

    await ensureUserExists(userId); // Ensure user exists before updating

    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $push: { interests: { name: interest } } },
      { new: true }
    );

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error('Error in POST /api/interests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { interestId, name } = await req.json();
    if (!interestId || !name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Interest ID and name are required' }, { status: 400 });
    }

    await ensureUserExists(userId); // Ensure user exists

    const profile = await UserProfile.findOneAndUpdate(
      { userId, 'interests._id': interestId },
      { $set: { 'interests.$.name': name } },
      { new: true }
    );

    if (!profile) {
      return NextResponse.json({ error: 'Interest not found' }, { status: 404 });
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error('Error in PUT /api/interests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { interestId } = await req.json();
    if (!interestId) {
      return NextResponse.json({ error: 'Interest ID is required' }, { status: 400 });
    }

    await ensureUserExists(userId); // Ensure user exists

    const profile = await UserProfile.findOneAndUpdate(
      { userId },
      { $pull: { interests: { _id: interestId } } },
      { new: true }
    );

    if (!profile) {
      return NextResponse.json({ error: 'Profile or interest not found' }, { status: 404 });
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/interests:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}