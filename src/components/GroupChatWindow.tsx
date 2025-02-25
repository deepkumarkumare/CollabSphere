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
      try {
        const { data, error } = await supabase
          .from('group_messages')
          .select('id, group_id, sender_id, content, created_at')
          .eq('group_id', group.id)
          .order('created_at', { ascending: true });

        if (error) throw error;
        setMessages(data || []);
      } catch (err) {
        setError((err as Error).message);
      }
    };
    fetchMessages();

    // Real-time subscription
    const channel = supabase
      .channel(`group:${group.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'group_messages',
          filter: `group_id=eq.${group.id}`,
        },
        (payload) => {
          const newMessage = payload.new as GroupMessage;
          setMessages((current) => [...current, newMessage]);
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log(`Subscribed to group:${group.id}`);
        } else if (status === 'CHANNEL_ERROR') {
          setError('Real-time updates failed');
        }
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, group.id]); // Depend on group.id to re-run when group changes

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    try {
      const { data, error } = await supabase
        .from('group_messages')
        .insert({
          group_id: group.id,
          sender_id: user.id,
          content: newMessage,
          created_at: new Date().toISOString(), // Ensure created_at is set
        })
        .select()
        .single();

      if (error) throw error;
      setNewMessage('');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="flex flex-col h-full rounded">
      <div className="p-2 bg-gray-800">
        Group: {group.name}
      </div>
      {error && <div className="p-2 text-red-500">{error}</div>}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-gray-500">No messages yet</p>
        ) : (
          messages.map((msg) => (
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
              <div className="text-xs text-gray-500">
                {new Date(msg.created_at).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSendMessage} className="p-2">
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