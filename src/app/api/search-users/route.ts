import { NextResponse } from 'next/server';
import { ClerkClient, createClerkClient } from '@clerk/clerk-sdk-node';

const clerkClient: ClerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email'); 

  try {
    const clerkUsers = await clerkClient.users.getUserList({
      ...(email ? { emailAddress: [email] } : {}), // Optional email filter
      limit: 100, // Adjust as needed
    });

    const users = clerkUsers.data.map((user) => ({
      id: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unnamed User',
    }));

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching Clerk users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}