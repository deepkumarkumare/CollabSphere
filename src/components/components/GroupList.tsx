'use client'

import { Group } from '@/types';
import Link from 'next/link';

interface GroupListProps {
  groups: Group[];
  selectedGroupId?: string;
}

export function GroupList({ groups, selectedGroupId }: GroupListProps) {
  return (
    <div className="border-r p-4">
      <h2 className="text-lg font-semibold mb-2">Your Groups</h2>
      {groups.length === 0 ? (
        <p className="text-gray-500">No groups yet</p>
      ) : (
        <ul>
          {groups.map((group) => (
            <li
              key={group.id}
              className={`p-2 mb-1 rounded ${
                group.id === selectedGroupId ? 'bg-gray-800 text-white' : 'hover:bg-gray-100'
              }`}
            >
              <Link href={`/group-chat/${group.id}`}>{group.name}</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}