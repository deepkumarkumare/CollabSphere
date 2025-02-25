'use client'

import { Group } from '@/types';
import Link from 'next/link';
import { MessageSquare, ChevronRight } from 'lucide-react';
import { useState } from 'react';

interface GroupListProps {
  groups: Group[];
  selectedGroupId?: string;
}

export function GroupList({ groups, selectedGroupId }: GroupListProps) {
  const [hoveredGroup, setHoveredGroup] = useState<string | null>(null);

  return (
    <div className="p-4 bg-gray-800 border-r border-gray-700 h-full flex flex-col">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
        <MessageSquare className="w-6 h-6 text-blue-400" />
        Your Groups
      </h2>

      {groups.length === 0 ? (
        <p className="text-gray-400 italic text-center py-4">
          No groups yet—create one to get started!
        </p>
      ) : (
        <ul className="space-y-2 flex-1 overflow-y-auto">
          {groups.map((group) => {
            const isSelected = group.id === selectedGroupId;
            const isHovered = group.id === hoveredGroup;

            return (
              <li
                key={group.id}
                onMouseEnter={() => setHoveredGroup(group.id)}
                onMouseLeave={() => setHoveredGroup(null)}
                className={`relative p-3 rounded-lg transition-all duration-200 ${
                  isSelected
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
                }`}
              >
                <Link
                  href={`/group-chat/${group.id}`}
                  className="flex items-center justify-between w-full"
                >
                  <span className="font-medium truncate">{group.name}</span>
                  <ChevronRight
                    className={`w-5 h-5 transition-transform duration-200 ${
                      isHovered || isSelected ? 'translate-x-1' : ''
                    }`}
                  />
                </Link>
                {/* Subtle glow effect on hover/selected */}
                {(isHovered || isSelected) && (
                  <div className="absolute inset-0 rounded-lg bg-blue-500/20 pointer-events-none" />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}