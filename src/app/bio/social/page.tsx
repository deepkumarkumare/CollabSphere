// app/profile/page.tsx
'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

export default function Profile() {
  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [image, setImage] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [newPost, setNewPost] = useState({ content: '', image: '' });
  const [newProject, setNewProject] = useState({ 
    title: '', 
    description: '', 
    image: '',
    projectLink: ''
  });
  const [socialLinks, setSocialLinks] = useState({
    github: '',
    email: '',
    linkedin: '',
    phone: '',
    location: ''
  });
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
        setSocialLinks(data.socialLinks || {
          github: '',
          email: '',
          linkedin: '',
          phone: '',
          location: ''
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, isLoaded]);

  // ... Previous handlers remain the same until new social links handler ...

  const updateSocialLinks = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/social-links', {
        method: 'PUT',
        body: JSON.stringify(socialLinks),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to update social links');
      }
      const updatedProfile = await res.json();
      setProfile(updatedProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error in updateSocialLinks:', err);
    } finally {
      setLoading(false);
    }
  };

  // ... Rest of the handlers remain the same ...

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;

  return (
    <div className="container mx-auto p-4">
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      {/* ... Previous sections remain the same ... */}

      {/* Social Links Section */}
      <section className="mb-6">
        <h2 className="text-xl mb-2">Social Links</h2>
        <div className="grid gap-4">
          <div>
            <label className="block mb-1">GitHub</label>
            <input
              value={socialLinks.github}
              onChange={(e) => setSocialLinks({ ...socialLinks, github: e.target.value })}
              placeholder="GitHub URL"
              className="border p-2 w-full"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block mb-1">Email</label>
            <input
              value={socialLinks.email}
              onChange={(e) => setSocialLinks({ ...socialLinks, email: e.target.value })}
              placeholder="Email address"
              className="border p-2 w-full"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block mb-1">LinkedIn</label>
            <input
              value={socialLinks.linkedin}
              onChange={(e) => setSocialLinks({ ...socialLinks, linkedin: e.target.value })}
              placeholder="LinkedIn URL"
              className="border p-2 w-full"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block mb-1">Phone</label>
            <input
              value={socialLinks.phone}
              onChange={(e) => setSocialLinks({ ...socialLinks, phone: e.target.value })}
              placeholder="Phone number"
              className="border p-2 w-full"
              disabled={loading}
            />
          </div>
          <div>
            <label className="block mb-1">Location</label>
            <input
              value={socialLinks.location}
              onChange={(e) => setSocialLinks({ ...socialLinks, location: e.target.value })}
              placeholder="City, Country"
              className="border p-2 w-full"
              disabled={loading}
            />
          </div>
          <button
            onClick={updateSocialLinks}
            className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
            disabled={loading}
          >
            Update Social Links
          </button>
        </div>
      </section>

      {/* ... Rest of the sections remain the same ... */}
    </div>
  );
}