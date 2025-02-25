// app/api/search-profiles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import UserProfile from '@/models/UserProfile';
import dbConnect from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim();

    if (!query) return NextResponse.json({ error: 'Search query is required' }, { status: 400 });

    await dbConnect();

    const profiles = await UserProfile.find({
      userId: { $ne: userId }, // Exclude current user
      $or: [
        { 'skills.name': { $regex: query, $options: 'i' } },
        { 'interests.name': { $regex: query, $options: 'i' } },
        { 'socialLinks.email': { $regex: query, $options: 'i' } },
      ],
    }).select('userId socialLinks.email skills interests'); // Minimal fields for search results

    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Error in search-profiles:', error);
    return NextResponse.json({ error: 'Failed to search profiles' }, { status: 500 });
  }
}