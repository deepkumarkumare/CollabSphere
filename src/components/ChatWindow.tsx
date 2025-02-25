'use client'

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { Message, User as UserType } from '@/types';
import { ArchiveX, Command, File, Inbox, Send, Trash2 } from "lucide-react"

interface ChatWindowProps {
  selectedUser: UserType;
}

export function ChatWindow({ selectedUser }: ChatWindowProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !selectedUser) {
      console.log('Missing user or selectedUser:', { user, selectedUser });
      return;
    }

    // Sync both users to Supabase
    const syncUsers = async () => {
      await Promise.all([
        supabase.from('users').upsert({
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress || 'unknown',
          name: user.fullName || 'Unnamed User',
        }, { onConflict: 'id' }),
        supabase.from('users').upsert({
          id: selectedUser.id,
          email: selectedUser.email,
          name: selectedUser.name,
        }, { onConflict: 'id' }),
      ]);
    };
    syncUsers();

    // Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${user.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${user.id})`)
        .order('created_at', { ascending: true });
      
      console.log('Fetched messages:', data, 'Error:', error);
      if (error) setError(error.message);
      if (data) setMessages(data);
    };
    fetchMessages();

    // Real-time subscription
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'messages',
          filter: `sender_id=in.(${user.id},${selectedUser.id}),receiver_id=in.(${user.id},${selectedUser.id})`
        }, 
        (payload) => {
          console.log('New message received:', payload.new);
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe((status) => console.log('Subscription status:', status));

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, selectedUser]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const { data, error } = await supabase
      .from('messages')
      .insert({
        sender_id: user.id,
        receiver_id: selectedUser.id,
        content: newMessage,
      })
      .select()
      .single();

    console.log('Send message response:', data, 'Error:', error);
    if (error) {
      setError(error.message);
    } else if (data) {
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full border rounded">
      <div className="p-2 bg-gray-900 border-b">
        {selectedUser.email}
      </div>
      {error && <div className="p-2 text-red-500">{error}</div>}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`mb-2 ${msg.sender_id === user?.id ? 'text-right' : 'text-left'}`}
          >
            <span
              className={`inline-block p-2 rounded ${
                msg.sender_id === user?.id ? 'bg-blue-900 text-white' : 'bg-gray-700'
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="p-2 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 p-2 border rounded"
            placeholder="Type a message..."
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-5 py-2 rounded"
          >
            <Send className='w-5' ></Send>
          </button>
        </div>
      </form>
    </div>
  );
}