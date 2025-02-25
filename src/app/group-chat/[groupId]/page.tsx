'use client'

import { useEffect, useState } from 'react';
import { GroupChatWindow } from '@/components/GroupChatWindow';
import { Group } from '@/types';
import { supabase } from '@/lib/supabase';

export default function GroupChat({ params }: { params: { groupId: string } }) {
  const [group, setGroup] = useState<Group | null>(null);

  useEffect(() => {
    async function fetchGroup() {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('id', params.groupId)
        .single();

      if (!error && data) setGroup(data);
    }
    fetchGroup();
  }, [params.groupId]);

  if (!group) return <p>Loading group...</p>;

  return (
    <div className="flex h-screen">
      <div className="w-full">
        <GroupChatWindow group={group} />
      </div>
    </div>
  );
}