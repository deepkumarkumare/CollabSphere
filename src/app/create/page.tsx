// // app/page.tsx
// "use client";

// import { useState, useEffect } from 'react';
// import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';
// import { supabase } from '@/lib/supabase';

// type Message = {
//   id: number;
//   user_id: string;
//   username: string;
//   content: string;
//   created_at: string;
// };

// export default function Chat() {
//   const { isSignedIn, user } = useUser();
//   const [messages, setMessages] = useState<Message[]>([]);
//   const [newMessage, setNewMessage] = useState('');

//   // Fetch initial messages and set up real-time subscription
//   useEffect(() => {
//     if (!isSignedIn) return;

//     // Fetch existing messages
//     const fetchMessages = async () => {
//       const { data, error } = await supabase
//         .from('messages')
//         .select('*')
//         .order('created_at', { ascending: true })
//         .limit(50); // Fetch only the latest 50 messages
//       if (error) console.error('Error fetching messages:', error);
//       else setMessages(data || []);
//     };
//     fetchMessages();

//     // Subscribe to real-time updates
//     const channel = supabase
//   .channel('chat_realtime')
//   .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
//     setMessages((prev) => [...prev, payload.new as Message]);
//   })
//   .subscribe();

//     // Cleanup subscription on unmount
//     return () => {
//       supabase.removeChannel(channel);
//     };
//   }, [isSignedIn]);

//   // Send a new message
//   const sendMessage = async () => {
//     if (!newMessage.trim() || !user) return;

//     const { error } = await supabase.from('messages').insert({
//       user_id: user.id,
//       username: user.fullName || user.emailAddresses[0].emailAddress.split('@')[0],
//       content: newMessage,
//     });

//     if (error) console.error('Error sending message:', error);
//     else setNewMessage('');
//   };

//   if (!isSignedIn) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-screen">
//         <h1 className="text-2xl mb-4">Welcome to the Chat App</h1>
//         <SignInButton mode="modal">
//           <button className="px-4 py-2 bg-blue-500 text-white rounded">Sign In</button>
//         </SignInButton>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col min-h-screen p-4">
//       <div className="flex justify-between mb-4">
//         <h1 className="text-xl">Chat Room</h1>
//         <SignOutButton>
//           <button className="px-4 py-2 bg-red-500 text-white rounded">Sign Out</button>
//         </SignOutButton>
//       </div>
//       <div className="flex-1 overflow-y-auto border rounded p-4 mb-4">
//         {messages.map((msg) => (
//           <div key={msg.id} className="mb-2">
//             <span className="font-bold">{msg.username}: </span>
//             <span>{msg.content}</span>
//             <span className="text-gray-500 text-sm ml-2">
//               {new Date(msg.created_at).toLocaleTimeString()}
//             </span>
//           </div>
//         ))}
//       </div>
//       <div className="flex">
//         <input
//           type="text"
//           value={newMessage}
//           onChange={(e) => setNewMessage(e.target.value)}
//           onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
//           className="flex-1 p-2 border rounded-l"
//           placeholder="Type a message..."
//         />
//         <button
//           onClick={sendMessage}
//           className="p-2 bg-blue-500 text-white rounded-r"
//         >
//           Send
//         </button>
//       </div>
//     </div>
//   );
// }