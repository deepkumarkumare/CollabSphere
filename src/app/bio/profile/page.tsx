'use client';
import React from 'react'
import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

const page = () => {

  const { user, isLoaded } = useUser();
  const [profile, setProfile] = useState<any>(null);
  const [image, setImage] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
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

  const updateImage = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/profile', {
        method: 'PUT',
        body: JSON.stringify({ image }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('Failed to update image');
      const updatedProfile = await res.json();
      setProfile(updatedProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };


  const addSkill = async () => {
    if (!newSkill.trim()) return;
    try {
      setLoading(true);
      const res = await fetch('/api/skills', {
        method: 'POST',
        body: JSON.stringify({ skill: newSkill }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('Failed to add skill');
      const updatedProfile = await res.json();
      setProfile(updatedProfile);
      setNewSkill('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateSkill = async (skillId: string, name: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/skills', {
        method: 'PUT',
        body: JSON.stringify({ skillId, name }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('Failed to update skill');
      const updatedProfile = await res.json();
      setProfile(updatedProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteSkill = async (skillId: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/skills', {
        method: 'DELETE',
        body: JSON.stringify({ skillId }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('Failed to delete skill');
      const updatedProfile = await res.json();
      setProfile(updatedProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };


  const addInterest = async () => {
    if (!newInterest.trim()) return;
    try {
      setLoading(true);
      const res = await fetch('/api/interests', {
        method: 'POST',
        body: JSON.stringify({ interest: newInterest }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('Failed to add interest');
      const updatedProfile = await res.json();
      setProfile(updatedProfile);
      setNewInterest('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const updateInterest = async (interestId: string, name: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/interests', {
        method: 'PUT',
        body: JSON.stringify({ interestId, name }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('Failed to update interest');
      const updatedProfile = await res.json();
      setProfile(updatedProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteInterest = async (interestId: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/interests', {
        method: 'DELETE',
        body: JSON.stringify({ interestId }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('Failed to delete interest');
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
        <h2 className="text-xl mb-2">Profile Image</h2>
        {profile?.image && <img src={profile.image} alt="Profile" className="w-32 h-32 mb-2" />}
        <input
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Image URL"
          className="border p-2 mr-2"
          disabled={loading}
        />
        <button 
          onClick={updateImage} 
          className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-400"
          disabled={loading}
        >
          Update Image
        </button>
      </section>


      <section className="mb-6">
        <h2 className="text-xl mb-2">Skills</h2>
        <div className="flex gap-2 mb-2">
          <input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="New skill"
            className="border p-2 flex-1"
            disabled={loading}
          />
          <button 
            onClick={addSkill} 
            className="bg-green-500 text-white p-2 rounded disabled:bg-gray-400"
            disabled={loading}
          >
            Add Skill
          </button>
        </div>
        {profile?.skills?.map((skill: any) => (
          <div key={skill._id} className="flex items-center gap-2 mb-2">
            <input
              defaultValue={skill.name}
              onBlur={(e) => updateSkill(skill._id, e.target.value)}
              className="border p-1 flex-1"
              disabled={loading}
            />
            <button
              onClick={() => deleteSkill(skill._id)}
              className="bg-red-500 text-white p-1 rounded disabled:bg-gray-400"
              disabled={loading}
            >
              Delete
            </button>
          </div>
        ))}
      </section>


      <section className="mb-6">
        <h2 className="text-xl mb-2">Interests</h2>
        <div className="flex gap-2 mb-2">
          <input
            value={newInterest}
            onChange={(e) => setNewInterest(e.target.value)}
            placeholder="New interest"
            className="border p-2 flex-1"
            disabled={loading}
          />
          <button 
            onClick={addInterest} 
            className="bg-green-500 text-white p-2 rounded disabled:bg-gray-400"
            disabled={loading}
          >
            Add Interest
          </button>
        </div>
        {profile?.interests?.map((interest: any) => (
          <div key={interest._id} className="flex items-center gap-2 mb-2">
            <input
              defaultValue={interest.name}
              onBlur={(e) => updateInterest(interest._id, e.target.value)}
              className="border p-1 flex-1"
              disabled={loading}
            />
            <button
              onClick={() => deleteInterest(interest._id)}
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
