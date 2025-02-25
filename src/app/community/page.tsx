'use client'

import { useState, useEffect } from 'react';
import { ChatWindow } from '@/components/ChatWindow';
import { UserList } from '@/components/UserList';
import { User } from '@/types';
import { useUser } from '@clerk/nextjs';

export default function ChatPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch('/api/search-users');
        const data = await response.json();
        if (response.ok) {
          // Filter out the current user
          const allUsers = data.filter((u: User) => u.id !== user?.id);
          setUsers(allUsers);
          setFilteredUsers(allUsers); // Initially show all users
        } else {
          console.error('Error fetching users:', data.error);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    }

    if (user) fetchUsers();
  }, [user]);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = users.filter(
        (u) =>
          u.email.toLowerCase().includes(query) ||
          u.name.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    }
  }, [searchQuery, users]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[calc(100vh-80px)]">
      <div className="col-span-1 flex flex-col">
        <div className="p-4">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users by name or email..."
            className="w-full p-2 border rounded"
          />
        </div>
        {loading ? (
          <p className="p-4">Loading users...</p>
        ) : (
          <UserList users={filteredUsers} onSelectUser={setSelectedUser} />
        )}
      </div>
      <div className="col-span-3">
        {selectedUser ? (
          <ChatWindow selectedUser={selectedUser} />
        ) : (
          <div className="h-full flex items-center justify-center border rounded">
            <p className="text-gray-500">Select a user to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
}