'use client';

import { useState, useEffect } from 'react';
import { UserButton, useUser } from '@clerk/nextjs';
import dbConnect from '@/lib/mongodb';
import UserModel, { IUser } from '@/models/User';

export default function Dashboard() {
  const { user } = useUser();
  const [description, setDescription] = useState('');
  const [savedDescription, setSavedDescription] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user) {
      fetchDescription();
    }
  }, [user]);

  const fetchDescription = async () => {
    try {
      const response = await fetch('/api/description');
      const data = await response.json();
      setDescription(data.description || '');
      setSavedDescription(data.description || '');
    } catch (error) {
      console.error('Error fetching description:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/description', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description }),
      });
      
      const data = await response.json();
      if (response.ok) {
        setSavedDescription(description);
        setMessage('Description updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'Error updating description');
      }
    } catch (error) {
      setMessage('Error updating description');
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="min-h-screen p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Your Dashboard</h1>
        <UserButton afterSignOutUrl="/" />
      </header>
      
      <main className="max-w-2xl mx-auto">
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Current Description</h2>
          {isLoading ? (
            <p>Loading description...</p>
          ) : savedDescription ? (
            <div className="p-4 bg-gray-100 rounded-lg">
              <p className="whitespace-pre-wrap">{savedDescription}</p>
            </div>
          ) : (
            <p className="text-gray-500 italic">No description set yet</p>
          )}
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">Update Description</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="description" className="block mb-2">
                Edit your description
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded"
                rows={5}
                disabled={isLoading}
                placeholder="Enter your personal description here..."
              />
            </div>
            
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : 'Save Description'}
            </button>
            
            {message && (
              <p className={`mt-4 text-sm ${message.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
                {message}
              </p>
            )}
          </form>
        </section>
      </main>
    </div>
  );
}