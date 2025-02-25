import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { auth } from '@clerk/nextjs/server';

// Define the expected resolved type
interface AuthResult {
  userId: string | null;
  [key: string]: any;
}

export async function GET() {
  const authResult = await auth(); // Treat auth() as a promise
  const { userId } = authResult as AuthResult;

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await supabase
    .from('group_members')
    .select('groups (id, name, creator_id, created_at)')
    .eq('user_id', userId);

  if (error) {
    console.error('GET /api/groups - Supabase error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const groups = data.map((gm: any) => gm.groups);
  return NextResponse.json(groups);
}

export async function POST(request: Request) {
  try {
    const authResult = await auth(); // Treat auth() as a promise
    const { userId } = authResult as AuthResult;

    console.log('POST /api/groups - User ID:', userId);

    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, memberIds } = body;
    console.log('POST /api/groups - Request body:', { name, memberIds });

    if (!name || !Array.isArray(memberIds)) {
      return NextResponse.json({ error: 'Invalid input: "name" must be a string and "memberIds" must be an array' }, { status: 400 });
    }

    const { data: group, error: groupError } = await supabase
      .from('groups')
      .insert({ name, creator_id: userId })
      .select()
      .single();

    if (groupError) {
      console.error('POST /api/groups - Group insert error:', groupError);
      return NextResponse.json({ error: groupError.message }, { status: 500 });
    }

    console.log('POST /api/groups - Created group:', group);

    const memberInserts = [
      { group_id: group.id, user_id: userId },
      ...memberIds.map((id: string) => ({ group_id: group.id, user_id: id })),
    ];
    console.log('POST /api/groups - Member inserts:', memberInserts);

    const { error: memberError } = await supabase
      .from('group_members')
      .insert(memberInserts);

    if (memberError) {
      console.error('POST /api/groups - Member insert error:', memberError);
      return NextResponse.json({ error: memberError.message }, { status: 500 });
    }

    return NextResponse.json(group, { status: 201 });
  } catch (error) {
    console.error('POST /api/groups - Unexpected error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}