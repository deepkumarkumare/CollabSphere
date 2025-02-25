'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import React from 'react'

const page = () => {

    const { user, isLoaded } = useUser();
    const [profile, setProfile] = useState<any>(null);
  const [newPost, setNewPost] = useState({ content: '', image: '' });
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user || !isLoaded) return; 
      try {
        setLoading(true);
        const res = await fetch('/api/profile');
        if (!res.ok) throw new Error('Failed to fetch profile');
        const data = await res.json();
        setProfile(data);
        setImage(data.image || '');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, isLoaded]);

  const createPost = async () => {
    if (!newPost.content.trim()) return;
    try {
      setLoading(true);
      const res = await fetch('/api/posts', {
        method: 'POST',
        body: JSON.stringify(newPost),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('Failed to create post');
      const updatedProfile = await res.json();
      setProfile(updatedProfile);
      setNewPost({ content: '', image: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (postId: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/posts', {
        method: 'DELETE',
        body: JSON.stringify({ postId }),
        headers: { 'Content-Type': 'application/json' } 
      });
      if (!res.ok) throw new Error('Failed to delete post');
      const updatedProfile = await res.json();
      setProfile(updatedProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
            <section className="mb-6">
        <h2 className="text-xl mb-2">Posts</h2>
        <div className="mb-2">
          <input
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
            placeholder="Post content"
            className="border p-2 w-full mb-2"
            disabled={loading}
          />
          <input
            value={newPost.image}
            onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
            placeholder="Image URL"
            className="border p-2 w-full mb-2"
            disabled={loading}
          />
          <button 
            onClick={createPost} 
            className="bg-green-500 text-white p-2 rounded disabled:bg-gray-400"
            disabled={loading}
          >
            Create Post
          </button>
        </div>
        {profile?.posts?.map((post: any) => (
          <div key={post._id} className="border p-2 mb-2 flex justify-between items-center">
            <div>
              <p>{post.content}</p>
              {post.image && <img src={post.image} alt="Post" className="w-24 h-24" />}
            </div>
            <button
              onClick={() => deletePost(post._id)}
              className="bg-red-500 text-white p-1 rounded disabled:bg-gray-400"
              disabled={loading}
            >
              Delete
            </button>



          </div>

          
        ))}
      </section>
    </div>
  )
}

export default page
