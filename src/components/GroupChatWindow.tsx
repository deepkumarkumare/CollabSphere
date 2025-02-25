'use client'

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { Group, GroupMessage } from '@/types';

interface GroupChatWindowProps {
  group: Group;
}

export function GroupChatWindow({ group }: GroupChatWindowProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<GroupMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user || !group) return;

    // Fetch initial messages
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('group_messages')
        .select('*')
        .eq('group_id', group.id)
        .order('created_at', { ascending: true });
      
      if (error) setError(error.message);
      if (data) setMessages(data);
    };
    fetchMessages();

    // Real-time subscription
    const channel = supabase
      .channel(`group:${group.id}`)
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'group_messages',
          filter: `group_id=eq.${group.id}`
        }, 
        (payload) => {
          setMessages((current) => [...current, payload.new as GroupMessage]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, group]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const { data, error } = await supabase
      .from('group_messages')
      .insert({
        group_id: group.id,
        sender_id: user.id,
        content: newMessage,
      })
      .select()
      .single();

    if (error) {
      setError(error.message);
    } else if (data) {
      setNewMessage('');
    }
  };

  return (
    <div className="flex flex-col h-full  rounded">
      <div className="p-2 bg-gray-800  ">
        Group: {group.name}
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
                msg.sender_id === user?.id ? 'bg-blue-500 text-white' : 'bg-gray-800'
              }`}
            >
              {msg.content}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSendMessage} className="p-2 ">
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
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}