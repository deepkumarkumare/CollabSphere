// app/api/user/sync/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import UserProfile from "@/models/UserProfile";
import dbConnect from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    // Check if user already exists
    let profile = await UserProfile.findOne({ userId });

    if (!profile) {
      // Create new user profile if it doesn't exist
      profile = new UserProfile({
        userId,
        image: "", // Optionally fetch from Clerk if available
        skills: [],
        interests: [],
        posts: [],
        projects: [],
        socialLinks: {},
      });
      await profile.save();
      return NextResponse.json(
        { message: "User profile created", profile },
        { status: 201 }
      );
    }

    // User already exists, no action needed
    return NextResponse.json(
      { message: "User profile already exists", profile },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error syncing user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}