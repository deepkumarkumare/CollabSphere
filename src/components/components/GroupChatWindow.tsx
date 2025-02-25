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

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('group_messages')
        .select('*')
        .eq('group_id', group.id)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Error fetching messages:', error);
        setError(error.message);
      } else {
        console.log('Fetched messages:', data);
        setMessages(data || []);
      }
    };
    fetchMessages();

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
          console.log('New message received via subscription:', payload.new);
          setMessages((prev) => [...prev, payload.new as GroupMessage]);
        }
      )
      .subscribe((status) => {
        console.log(`Subscription status for group:${group.id}:`, status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [group.id, user]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    const { data, error } = await supabase
      .from('group_messages')
      .insert({
        group_id: group.id,
        sender_id: user.id,
        content: newMessage,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error sending message:', error);
      setError(error.message);
    } else {
      console.log('Message sent and returned:', data);
      setNewMessage('');
      // Optionally update messages locally if real-time fails
      // setMessages((prev) => [...prev, data]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 bg-gray-800 text-white">
        <h2>{group.name}</h2>
      </div>
      {error && <p className="p-2 text-red-500">{error}</p>}
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
                  msg.sender_id === user?.id ? 'bg-blue-500 text-white' : 'bg-gray-200'
                }`}
              >
                {msg.content}
              </span>
              <p className="text-xs text-gray-500">
                {new Date(msg.created_at).toLocaleTimeString()}
              </p>
            </div>
          ))
        )}
      </div>
      <form onSubmit={handleSendMessage} className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Send
          </button>
        </div>
      </form>
    </div>
  );
}