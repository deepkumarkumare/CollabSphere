'use client'

import { useEffect, useState } from 'react';
import { GroupChatWindow } from '@/components/GroupChatWindow';
import { Group } from '@/types';
import { supabase } from '@/lib/supabase';
import { Users, ChevronLeft, MessageSquare } from 'lucide-react';

export default function GroupChat({ params }: { params: { groupId: string } }) {
  const [group, setGroup] = useState<Group | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchGroup() {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('groups')
          .select('*') // Removed members join
          .eq('id', params.groupId)
          .single();

        if (error) throw error;
        if (data) setGroup(data);
      } catch (error) {
        console.error('Error fetching group:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchGroup();
  }, [params.groupId]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
        <p>Group not found</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
          <div className="flex items-center gap-3">
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <Users className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-xl font-semibold">{group.name}</h1>
            </div>
          </div>
          {/* Removed Settings button */}
        </header>

        {/* Chat Window */}
        <div className="flex-1 overflow-hidden">
          <GroupChatWindow group={group} />
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`bg-gray-800 border-l border-gray-700 transition-all duration-300 ${
          isSidebarOpen ? 'w-80' : 'w-0'
        }`}
      >
        <div className={isSidebarOpen ? 'p-4' : 'hidden'}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold">Group Info</h2>
            <button
              onClick={toggleSidebar}
              className="p-2 hover:bg-gray-700 rounded-lg"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-sm uppercase text-gray-400 mb-2">Details</h3>
              <p className="text-sm">Created: {new Date(group.created_at).toLocaleDateString()}</p>
              {/* Removed members count */}
            </div>

            <div>
              <h3 className="text-sm uppercase text-gray-400 mb-2">Actions</h3>
              <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Invite Members
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}