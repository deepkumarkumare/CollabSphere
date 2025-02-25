'use client'

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { supabase } from '@/lib/supabase';
import { Message, User as UserType } from '@/types';
import { Send, MoreVertical } from 'lucide-react';

interface ChatWindowProps {
  selectedUser: UserType;
}

export function ChatWindow({ selectedUser }: ChatWindowProps) {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !selectedUser) {
      console.log('Missing user or selectedUser:', { user, selectedUser });
      return;
    }

    const syncUsers = async () => {
      await Promise.all([
        supabase.from('users').upsert(
          {
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress || 'unknown',
            name: user.fullName || 'Unnamed User',
          },
          { onConflict: 'id' }
        ),
        supabase.from('users').upsert(
          {
            id: selectedUser.id,
            email: selectedUser.email,
            name: selectedUser.name,
          },
          { onConflict: 'id' }
        ),
      ]);
    };
    syncUsers();

    const fetchMessages = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${selectedUser.id}),and(sender_id.eq.${selectedUser.id},receiver_id.eq.${user.id})`
        )
        .order('created_at', { ascending: true });

      if (error) setError(error.message);
      if (data) setMessages(data);
      setIsLoading(false);
    };
    fetchMessages();

    const channel = supabase
      .channel('messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `sender_id=in.(${user.id},${selectedUser.id}),receiver_id=in.(${user.id},${selectedUser.id})`,
        },
        (payload) => {
          setMessages((current) => [...current, payload.new as Message]);
        }
      )
      .subscribe();

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

    if (error) setError(error.message);
    else if (data) setNewMessage('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-950 text-gray-800 dark:text-gray-100">
      {/* Header */}
      <div className="sticky top-0 z-10 p-4 bg-gray-50 dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-indigo-500 dark:bg-indigo-600 flex items-center justify-center text-white font-semibold">
            {selectedUser.email.charAt(0)}
          </div>
          <div>
            <h3 className="text-lg font-semibold">{selectedUser.email}</h3>
          </div>
        </div>
        <button className="p-2 hover:bg-gray-200 dark:hover:bg-gray-800 rounded-full transition-colors">
          <MoreVertical className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Messages Area with Custom Scrollbar */}
      <div
        className="flex-1 p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-500 dark:scrollbar-thumb-indigo-400 scrollbar-track-gray-200 dark:scrollbar-track-gray-800"
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500 dark:border-indigo-400"></div>
          </div>
        ) : messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
            <p>No messages yet—say hello!</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`mb-4 flex ${
                msg.sender_id === user?.id ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] p-3 rounded-xl shadow-sm transition-all duration-200 ${
                  msg.sender_id === user?.id
                    ? 'bg-indigo-500 text-white dark:bg-indigo-600'
                    : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100'
                } hover:shadow-md`}
              >
                <p>{msg.content}</p>
                <span className="text-xs mt-1 block opacity-70">
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleSendMessage}
        className="p-4 bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 flex items-center gap-3"
      >
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="flex-1 p-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 transition-all duration-200 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500"
          placeholder="Type a message..."
        />
        <button
          type="submit"
          disabled={!newMessage.trim()}
          className="p-2.5 bg-indigo-500 dark:bg-indigo-600 text-white rounded-md hover:bg-indigo-600 dark:hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
}