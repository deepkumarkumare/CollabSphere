// app/api/users/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import { createClerkClient } from '@clerk/clerk-sdk-node';
import dbConnect from '@/lib/mongodb';
import UserProfile from '@/models/UserProfile';

const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    console.log('User ID from auth:', userId); // Debug log

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('query') || '';
    console.log('Search query:', query); // Debug log

    const { data: clerkUsers } = await clerkClient.users.getUserList({
      query,
      limit: 10,
    });
    console.log('Clerk users found:', clerkUsers.length); // Debug log

    await dbConnect();
    const profiles = await UserProfile.find({
      userId: { $in: clerkUsers.map(user => user.id) }
    });
    console.log('MongoDB profiles found:', profiles.length); // Debug log

    const users = clerkUsers.map(clerkUser => {
      const profile = profiles.find(p => p.userId === clerkUser.id);
      return {
        id: clerkUser.id,
        firstName: clerkUser.firstName,
        lastName: clerkUser.lastName,
        email: clerkUser.emailAddresses.find(email => email.id === clerkUser.primaryEmailAddressId)?.emailAddress,
        // image: profile?.image || clerkUser.profileImageUrl,
        skills: profile?.skills || [],
        interests: profile?.interests || [],
        socialLinks: profile?.socialLinks || {},
      };
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error in search route:', error);
    return NextResponse.json({ error: error }, { status: 500 });    
  }
}