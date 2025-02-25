'use client'

import { User } from '@/types';

interface UserListProps {
  users: User[];
  onSelectUser: (user: User) => void;
  selectedUsers: User[];
}

export function UserList({ users, onSelectUser, selectedUsers }: UserListProps) {
  return (
    <div className="max-h-40 overflow-y-auto border rounded">
      {users.length === 0 ? (
        <p className="p-2 text-gray-500">No users found</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => onSelectUser(user)}
              className={`p-2 cursor-pointer hover:bg-gray-100 ${
                selectedUsers.some((u) => u.id === user.id) ? 'bg-gray-200' : ''
              }`}
            >
              {user.email} ({user.name})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}