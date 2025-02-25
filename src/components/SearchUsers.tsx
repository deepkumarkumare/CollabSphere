'use client'

import { useState } from 'react';
import { User } from '@/types';

interface SearchUsersProps {
  onSelectUser: (user: User) => void;
}

export function SearchUsers({ onSelectUser }: SearchUsersProps) {
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/search-users?email=${email}`);
      const data = await response.json();
      console.log('Search results:', data); // Debug log
      if (response.ok) {
        setUsers(data);
      } else {
        console.error('Search error:', data.error);
      }
    } catch (error) {
      console.error('Error searching users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleSearch} className="flex gap-2 mb-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Search by email"
          className="flex-1 p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {users.length > 0 && (
        <div className="border rounded p-2">
          {users.map((user) => (
            <div
              key={user.id}
              onClick={() => onSelectUser(user)}
              className="p-2 hover:bg-gray-100 cursor-pointer"
            >
              {user.name} ({user.email})
            </div>
          ))}
        </div>
      )}
    </div>
  );
}