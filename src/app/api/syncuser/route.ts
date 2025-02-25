import type { NextApiRequest, NextApiResponse } from 'next';
import mongoose from 'mongoose';
import UserProfile from '@/models/UserProfile';
import { getAuth } from '@clerk/nextjs/server';

// Connect to MongoDB
const connectDB = async () => {
  if (mongoose.connection.readyState === 1) return;
  await mongoose.connect(process.env.MONGODB_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as mongoose.ConnectOptions);
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  await connectDB();

  // Get Clerk user details
  const { userId } = getAuth(req); // Use getAuth(req) instead of auth()
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });

  try {
    // Check if user already exists
    let existingUser = await UserProfile.findOne({ userId });

    if (!existingUser) {
      // Create a new user profile in MongoDB
      existingUser = new UserProfile({
        userId,
        image: '', // You can fetch this from Clerk API
        socialLinks: {
          email: '', // You can fetch this from Clerk API
          github: '',
          linkedin: '',
          phone: '',
          location: ''
        },
        skills: [],
        interests: [],
        posts: [],
        projects: []
      });

      await existingUser.save();
    }

    res.status(200).json({ message: 'User synced successfully', user: existingUser });
  } catch (error) {
    console.error('Error syncing user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
