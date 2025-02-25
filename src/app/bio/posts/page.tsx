'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { Badge } from "@/components/ui/badge";

const Page = () => {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [newPost, setNewPost] = useState({ content: '', image: '' });
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
    <div className="w-[100%] my-20">
      <div className="container mx-auto">
        <div className="flex flex-col gap-10">
          {/* Header Section */}
          <div className="flex gap-4 flex-col items-start">
            <div>
              <Badge>Share Your Moment</Badge>
            </div>
            <div className="flex gap-2 flex-col">
              <h2 className="text-3xl md:text-5xl tracking-tighter max-w-xl font-regular text-left">
                📸 Create a New Post
              </h2>
              <p className="text-lg max-w-xl lg:max-w-lg leading-relaxed tracking-tight text-muted-foreground text-left">
                Share your thoughts and images with the community! ✨
              </p>
            </div>
          </div>

          {/* Post Creation Form */}
          <div className="grid grid-cols-1 gap-8">
            <div className="flex flex-col gap-4">
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="What's on your mind?"
                className="border rounded-md p-4 w-full h-32 text-lg tracking-tight"
                disabled={loading}
              />
              <input
                value={newPost.image}
                onChange={(e) => setNewPost({ ...newPost, image: e.target.value })}
                placeholder="Image URL (optional)"
                className="border rounded-md p-4 w-full text-lg tracking-tight"
                disabled={loading}
              />
              <button
                onClick={createPost}
                className="bg-green-500 text-white p-4 rounded-md text-lg tracking-tight hover:bg-green-600 disabled:bg-gray-400"
                disabled={loading}
              >
                {loading ? 'Posting...' : 'Share Post'}
              </button>
            </div>
          </div>

          {/* Existing Posts */}
          {profile?.posts?.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {profile.posts.map((post: any) => (
                <div key={post._id} className="flex flex-col gap-2">
                  {post.image && (
                    <div
                      className="bg-muted rounded-md aspect-video mb-2"
                      style={{
                        backgroundImage: `url(${post.image})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        backgroundRepeat: "no-repeat",
                      }}
                    ></div>
                  )}
                  <p className="text-lg tracking-tight">{post.content}</p>
                  <button
                    onClick={() => deletePost(post._id)}
                    className="bg-red-500 text-white p-2 rounded-md text-sm tracking-tight hover:bg-red-600 disabled:bg-gray-400"
                    disabled={loading}
                  >
                    {loading ? 'Deleting...' : 'Delete Post'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Page;