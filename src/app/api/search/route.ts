// // app/api/search/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { getAuth } from '@clerk/nextjs/server';
// import UserProfile from '@/models/UserProfile';
// import dbConnect from '@/lib/mongodb';

// export async function GET(req: NextRequest) {
//   try {
//     const { userId } = getAuth(req);
//     if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//     const { searchParams } = new URL(req.url);
//     const query = searchParams.get('q')?.trim() || '';

//     await dbConnect();

//     // Search profiles excluding the current user's profile
//     const profiles = await UserProfile.find({
//       userId: { $ne: userId }, // Exclude current user
//       $or: [
//         { 'skills.name': { $regex: query, $options: 'i' } },
//         { 'interests.name': { $regex: query, $options: 'i' } },
//         { 'projects.title': { $regex: query, $options: 'i' } },
//         { 'socialLinks.github': { $regex: query, $options: 'i' } },
//         { 'socialLinks.email': { $regex: query, $options: 'i' } },
//         { 'socialLinks.linkedin': { $regex: query, $options: 'i' } },
//         { 'socialLinks.location': { $regex: query, $options: 'i' } },
//       ]
//     }).select('userId skills interests projects socialLinks'); // Only return public fields

//     return NextResponse.json(profiles);
//   } catch (error) {
//     console.error('Error searching profiles:', error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }



// app/api/search/route.ts
// import { NextRequest, NextResponse } from 'next/server';
// import { getAuth } from '@clerk/nextjs/server';
// import UserProfile from '@/models/UserProfile';
// import dbConnect from '@/lib/mongodb';

// export async function GET(req: NextRequest) {
//   try {
//     const { userId } = getAuth(req);
//     if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

//     const { searchParams } = new URL(req.url);
//     const query = searchParams.get('q')?.trim() || '';

//     await dbConnect();

//     const profiles = await UserProfile.find({
//       userId: { $ne: userId },
//       $or: [
//         { 'skills.name': { $regex: query, $options: 'i' } },
//         { 'interests.name': { $regex: query, $options: 'i' } },
//         { 'projects.title': { $regex: query, $options: 'i' } },
//         { 'socialLinks.github': { $regex: query, $options: 'i' } },
//         { 'socialLinks.email': { $regex: query, $options: 'i' } },
//         { 'socialLinks.linkedin': { $regex: query, $options: 'i' } },
//         { 'socialLinks.location': { $regex: query, $options: 'i' } },
//       ]
//     }).select('userId skills interests projects socialLinks.email'); // Updated to include email

//     return NextResponse.json(profiles);
//   } catch (error) {
//     console.error('Error searching profiles:', error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }



// app/api/search/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@clerk/nextjs/server';
import UserProfile from '@/models/UserProfile';
import dbConnect from '@/lib/mongodb';

export async function GET(req: NextRequest) {
  try {
    const { userId } = getAuth(req);
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim() || '';

    await dbConnect();

    const profiles = await UserProfile.find({
      userId: { $ne: userId }, // Exclude current user
      $or: [
        { 'skills.name': { $regex: query, $options: 'i' } },
        { 'interests.name': { $regex: query, $options: 'i' } },
        { 'projects.title': { $regex: query, $options: 'i' } },
        { 'socialLinks.github': { $regex: query, $options: 'i' } },
        { 'socialLinks.email': { $regex: query, $options: 'i' } }, // Already supports email search
        { 'socialLinks.linkedin': { $regex: query, $options: 'i' } },
        { 'socialLinks.location': { $regex: query, $options: 'i' } },
      ]
    }).select('userId skills interests projects socialLinks.email');

    return NextResponse.json(profiles);
  } catch (error) {
    console.error('Error searching profiles:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}