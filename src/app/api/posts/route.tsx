// import { NextResponse } from "next/server";
// import { connectDB } from "@/lib/mongodb";
// import Post from "@/models/Post"; // Ensure the model exists

// export async function GET() {
//   try {
//     await connectDB();
//     const posts = await Post.find({});

//     return NextResponse.json(posts, { status: 200 });
//   } catch (error) {
//     console.error("Error fetching posts:", error);
//     return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 });
//   }
// }


// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import UserProfile from '@/models/UserProfile';
import dbConnect from '@/lib/mongodb';

export async function POST(req: NextRequest) {
  const { userId } = getAuth(req);
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const postData = await req.json();
  await dbConnect();
  
  const profile = await UserProfile.findOneAndUpdate(
    { userId },
    { $push: { posts: postData } },
    { new: true, upsert: true }
  );
  return NextResponse.json(profile);
}

export async function DELETE(req: NextRequest) {
  const { userId } = getAuth(req);
  const { postId } = await req.json();
  
  await dbConnect();
  const profile = await UserProfile.findOneAndUpdate(
    { userId },
    { $pull: { posts: { _id: postId } } },
    { new: true }
  );
  return NextResponse.json(profile);
}

