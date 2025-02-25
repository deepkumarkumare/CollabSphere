'use client'

import { useState, useEffect } from 'react';
import { GroupChatWindow } from '@/components/GroupChatWindow';
import { UserList } from '@/components/UserList';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { Group, User } from '@/types';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function GroupChatPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch Clerk users
        const userResponse = await fetch('/api/search-users');
        const userData = await userResponse.json();
        if (userResponse.ok) {
          const allUsers = userData.filter((u: User) => u.id !== user?.id);
          setUsers(allUsers);
          setFilteredUsers(allUsers);
        }

        // Fetch user's groups
        if (user) {
          const { data: groupData, error } = await supabase
            .from('group_members')
            .select('group_id, groups(id, name, creator_id, created_at)')
            .eq('user_id', user.id);

          if (error) {
            console.error('Error fetching groups:', error);
            return;
          }

          if (groupData) {
            const fetchedGroups = groupData.map((gm: { group_id: string; groups: { id: string; name: string; creator_id: string; created_at: string }[] }) => {
              const group = gm.groups[0];
              return {
                id: group.id,
                name: group.name,
                creator_id: group.creator_id,
                created_at: group.created_at,
              } as Group;
            });
            setGroups(fetchedGroups);
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    if (user) fetchData();
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(
          (u) =>
            u.email.toLowerCase().includes(query) ||
            u.name.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, users]);

  const handleCreateGroup = async () => {
    if (!groupName.trim() || !user) return;

    const { data: group, error } = await supabase
      .from('groups')
      .insert({ name: groupName, creator_id: user.id })
      .select()
      .single();

    if (error) {
      console.error('Error creating group:', error);
      return;
    }

    const memberInserts = [
      { group_id: group.id, user_id: user.id },
      ...selectedMembers.map((member) => ({ group_id: group.id, user_id: member.id })),
    ];

    const { error: memberError } = await supabase
      .from('group_members')
      .insert(memberInserts);

    if (memberError) {
      console.error('Error adding members:', memberError);
    } else {
      setGroups((prev) => [...prev, group]);
      setGroupName('');
      setSelectedMembers([]);
    }
  };

  const toggleMember = (member: User) => {
    setSelectedMembers((prev) =>
      prev.some((m) => m.id === member.id)
        ? prev.filter((m) => m.id !== member.id)
        : [...prev, member]
    );
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar Container */}
      <div className="flex flex-shrink-0">
        {/* Group Creation Column - Reduced by 25% */}
        <div className="w-72 border-r flex flex-col overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">Create Group</h2>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Group name"
              className="w-full p-2 border rounded mb-2"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users to add..."
              className="w-full p-2 border rounded mb-2"
            />
            <UserList
              users={filteredUsers}
              onSelectUser={toggleMember}
            />
            <Card className="mt-2">
              <h2 className="p-4 text-lg font-semibold border-b">Selected Users</h2>
              {selectedMembers.length === 0 ? (
                <p className="p-4 ">None</p>
              ) : (
                <ul className="p-4 border-b">
                  {selectedMembers.map((m) => (
                    <li key={m.id} className="text-sm">{m.email}</li>
                  ))}
                </ul>
              )}
            </Card>
            <button
              onClick={handleCreateGroup}
              className="mt-2 w-full bg-blue-500 text-white p-2 rounded"
            >
              Create Group
            </button>
          </div>
        </div>

        {/* Groups List Column */}
        <div className="w-64 border-r flex flex-col overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold mb-2">Groups</h2>
            {loading ? (
              <p>Loading...</p>
            ) : groups.length === 0 ? (
              <p className="border-b p-2">No groups yet</p>
            ) : (
              <ul>
                {groups.map((group) => (
                  <li
                    key={group.id}
                    onClick={() => setSelectedGroup(group)}
                    className={`p-2 hover:bg-gray-700 cursor-pointer border-b ${
                      selectedGroup?.id === group.id ? 'bg-gray-800' : ''
                    }`}
                  >
                    {group.name}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Chat Window - 90% width, static */}
      <div className="w-[90%] h-full">
        {selectedGroup ? (
          <GroupChatWindow group={selectedGroup} />
        ) : (
          <div className="h-full flex items-center justify-center border rounded">
            <p className="text-gray-800">Select a group to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}