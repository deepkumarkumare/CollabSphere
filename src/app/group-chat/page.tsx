// 'use client'

// import { useState, useEffect } from 'react';
// import { GroupChatWindow } from '@/components/GroupChatWindow';
// import { UserList } from '@/components/UserList';
// import { useUser } from '@clerk/nextjs';
// import { supabase } from '@/lib/supabase';
// import { Group, User } from '@/types';
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';

// export default function GroupChatPage() {
//   const [users, setUsers] = useState<User[]>([]);
//   const [groups, setGroups] = useState<Group[]>([]);
//   const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
//   const { user } = useUser();
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
//   const [groupName, setGroupName] = useState('');
//   const [selectedMembers, setSelectedMembers] = useState<User[]>([]);

//   useEffect(() => {
//     async function fetchData() {
//       try {
//         // Fetch Clerk users
//         const userResponse = await fetch('/api/search-users');
//         const userData = await userResponse.json();
//         if (userResponse.ok) {
//           const allUsers = userData.filter((u: User) => u.id !== user?.id);
//           setUsers(allUsers);
//           setFilteredUsers(allUsers);
//         } else {
//           throw new Error(userData.error || 'Failed to fetch users');
//         }

//         // Fetch user's groups
//         if (user) {
//           const { data: groupData, error } = await supabase
//             .from('group_members')
//             .select(`
//               group_id,
//               groups (
//                 id,
//                 name,
//                 creator_id,
//                 created_at
//               )
//             `)
//             .eq('user_id', user.id);

//           if (error) throw error;

//           const fetchedGroups = groupData?.map((gm: any) => ({
//             id: gm.groups.id,
//             name: gm.groups.name,
//             creator_id: gm.groups.creator_id,
//             created_at: gm.groups.created_at,
//           })) || [];
//           setGroups(fetchedGroups);
//           if (fetchedGroups.length > 0 && !selectedGroup) {
//             setSelectedGroup(fetchedGroups[0]); // Auto-select first group
//           }
//         }
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       } finally {
//         setLoading(false);
//       }
//     }

//     if (user) fetchData();
//   }, [user]);

//   useEffect(() => {
//     if (searchQuery.trim() === '') {
//       setFilteredUsers(users);
//     } else {
//       const query = searchQuery.toLowerCase();
//       setFilteredUsers(
//         users.filter(
//           (u) =>
//             u.email.toLowerCase().includes(query) ||
//             u.name.toLowerCase().includes(query)
//         )
//       );
//     }
//   }, [searchQuery, users]);

//   const handleCreateGroup = async () => {
//     if (!groupName.trim() || !user) return;

//     try {
//       const { data: group, error } = await supabase
//         .from('groups')
//         .insert({ name: groupName, creator_id: user.id })
//         .select()
//         .single();

//       if (error) throw error;

//       const memberInserts = [
//         { group_id: group.id, user_id: user.id },
//         ...selectedMembers.map((member) => ({ group_id: group.id, user_id: member.id })),
//       ];

//       const { error: memberError } = await supabase
//         .from('group_members')
//         .insert(memberInserts);

//       if (memberError) throw memberError;

//       setGroups((prev) => [...prev, group]);
//       setGroupName('');
//       setSelectedMembers([]);
//     } catch (error) {
//       console.error('Error creating group:', error);
//     }
//   };

//   const toggleMember = (member: User) => {
//     setSelectedMembers((prev) =>
//       prev.some((m) => m.id === member.id)
//         ? prev.filter((m) => m.id !== member.id)
//         : [...prev, member]
//     );
//   };

//   return (
//     <div className="flex h-screen">
//       <div className="flex flex-shrink-0">
//         <div className="w-72 border-r flex flex-col overflow-y-auto">
//           <div className="p-4">
//             <h2 className="text-lg font-semibold mb-2">Create Group</h2>
//             <input
//               type="text"
//               value={groupName}
//               onChange={(e) => setGroupName(e.target.value)}
//               placeholder="Group name"
//               className="w-full p-2 border rounded mb-2"
//             />
//             <input
//               type="text"
//               value={searchQuery}
//               onChange={(e) => setSearchQuery(e.target.value)}
//               placeholder="Search users to add..."
//               className="w-full p-2 border rounded mb-2"
//             />
//             <UserList users={filteredUsers} onSelectUser={toggleMember} />
//             <Card className="mt-2">
//               <h2 className="p-4 text-lg font-semibold border-b">Selected Users</h2>
//               {selectedMembers.length === 0 ? (
//                 <p className="p-4">None</p>
//               ) : (
//                 <ul className="p-4 border-b">
//                   {selectedMembers.map((m) => (
//                     <li key={m.id} className="text-sm">{m.email}</li>
//                   ))}
//                 </ul>
//               )}
//             </Card>
//             <Button
//               onClick={handleCreateGroup}
//               className="mt-2 w-full"
//             >
//               Create Group
//             </Button>
//           </div>
//         </div>
//         <div className="w-64 border-r flex flex-col overflow-y-auto">
//           <div className="p-4">
//             <h2 className="text-lg font-semibold mb-2">Groups</h2>
//             {loading ? (
//               <p>Loading...</p>
//             ) : groups.length === 0 ? (
//               <p className="border-b p-2">No groups yet</p>
//             ) : (
//               <ul>
//                 {groups.map((group) => (
//                   <li
//                     key={group.id}
//                     onClick={() => setSelectedGroup(group)}
//                     className={`p-2 hover:bg-gray-700 cursor-pointer border-b ${
//                       selectedGroup?.id === group.id ? 'bg-gray-800' : ''
//                     }`}
//                   >
//                     {group.name}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>
//         </div>
//       </div>
//       <div className="w-[90%] h-full">
//         {selectedGroup ? (
//           <GroupChatWindow key={selectedGroup.id} group={selectedGroup} />
//         ) : (
//           <div className="h-full flex items-center justify-center border rounded">
//             <p className="text-gray-800">Select a group to start chatting</p>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


'use client'

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { User, Group } from '@/types';
import { UserList } from '@/components/UserList';
import { GroupList } from '@/components/components/GroupList';
import { Plus, X, Users } from 'lucide-react';

export default function GroupChatPage() {
  const { user } = useUser();
  const [users, setUsers] = useState<User[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [groupName, setGroupName] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingGroup, setIsCreatingGroup] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      setLoading(true);
      try {
        const [usersRes, groupsRes] = await Promise.all([
          fetch('/api/users'),
          fetch('/api/groups'),
        ]);

        const usersData = await usersRes.json();
        const groupsData = await groupsRes.json();

        if (usersRes.ok) setUsers(usersData.filter((u: User) => u.id !== user.id));
        if (groupsRes.ok) setGroups(groupsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const toggleMember = (member: User) => {
    setSelectedMembers((prev) =>
      prev.some((m) => m.id === member.id)
        ? prev.filter((m) => m.id !== member.id)
        : [...prev, member]
    );
  };

  const removeMember = (memberId: string) => {
    setSelectedMembers((prev) => prev.filter((m) => m.id !== memberId));
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || !user) return;

    setIsCreatingGroup(true);
    try {
      const res = await fetch('/api/groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: groupName, memberIds: selectedMembers.map((m) => m.id) }),
      });

      if (res.ok) {
        const newGroup = await res.json();
        setGroups((prev) => [...prev, newGroup]);
        setGroupName('');
        setSelectedMembers([]);
      }
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setIsCreatingGroup(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Sidebar */}
      <div className="w-80 bg-gray-800 border-r border-gray-700 p-4 flex flex-col">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Users className="w-6 h-6" /> Groups
        </h2>
        <GroupList groups={groups} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Group Chat Hub
        </h1>

        {/* Create Group Section */}
        <div className="bg-gray-800 rounded-xl p-6 shadow-lg mb-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" /> Create New Group
          </h2>

          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="Enter group name"
            className="w-full p-3 bg-gray-700 border border-gray-600 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />

          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2">Select Members</h3>
            <div className="max-h-80 overflow-y-auto bg-gray-700 rounded-lg p-2">
              <UserList
                users={users}
                onSelectUser={toggleMember}
                selectedUsers={selectedMembers}
              />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Selected Members:</h3>
            {selectedMembers.length === 0 ? (
              <p className="text-gray-400">No members selected</p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {selectedMembers.map((m) => (
                  <div
                    key={m.id}
                    className="bg-blue-600 px-3 py-1 rounded-full flex items-center gap-2 text-sm"
                  >
                    {m.email}
                    <button
                      onClick={() => removeMember(m.id)}
                      className="hover:text-red-400"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleCreateGroup}
            disabled={isCreatingGroup}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingGroup ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-white"></div>
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-5 h-5" /> Create Group
              </>
            )}
          </button>
        </div>

        <p className="text-gray-400 text-center">
          Select a group from the sidebar to start chatting
        </p>
      </div>
    </div>
  );
}