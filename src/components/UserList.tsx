'use client'

import { User } from '@/types';
import { Card } from './ui/card';

interface UserListProps {
  users: User[];
  onSelectUser: (user: User) => void;
}

export function UserList({ users, onSelectUser }: UserListProps) {
  return (
    <Card  className="h-full overflow-y-auto">
      <h2 className="p-4 text-lg font-semibold border-b">Available Users</h2>
      {users.length === 0 ? (
        <p className="p-4 text-gray-500">No other users found</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => onSelectUser(user)}
              className="p-4 hover:bg-gray-700 cursor-pointer border-b"
            >
              {/* <div className="font-medium">{user.name}</div> */}
              <div className="text-sm">{user.email}</div>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}