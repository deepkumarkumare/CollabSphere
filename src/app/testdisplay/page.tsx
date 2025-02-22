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

  // Image Handler
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

  // Skills Handlers
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

  // Interests Handlers
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

  // Posts Handlers
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

  // Projects Handlers
  const createProject = async () => {
    if (!newProject.title.trim()) return;
    try {
      setLoading(true);
      const res = await fetch('/api/projects', {
        method: 'POST',
        body: JSON.stringify(newProject),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('Failed to create project');
      const updatedProfile = await res.json();
      setProfile(updatedProfile);
      setNewProject({ title: '', description: '', image: '', projectLink: '' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const deleteProject = async (projectId: string) => {
    try {
      setLoading(true);
      const res = await fetch('/api/projects', {
        method: 'DELETE',
        body: JSON.stringify({ projectId }),
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error('Failed to delete project');
      const updatedProfile = await res.json();
      setProfile(updatedProfile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // social medial link handeler

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

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;

  return (
    <div className="container mx-auto p-4">
      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <h1 className="text-2xl font-bold mb-4">Profile</h1>

      {/* Image Section */}
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

      {/* Skills Section */}
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

      {/* Interests Section */}
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

      {/* Posts Section */}
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

      {/* Projects Section */}
      <section>
        <h2 className="text-xl mb-2">Projects</h2>
        <div className="mb-2">
          <input
            value={newProject.title}
            onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
            placeholder="Project title"
            className="border p-2 w-full mb-2"
            disabled={loading}
          />
          <textarea
            value={newProject.description}
            onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
            placeholder="Description"
            className="border p-2 w-full mb-2"
            disabled={loading}
          />
          <input
            value={newProject.image}
            onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
            placeholder="Image URL"
            className="border p-2 w-full mb-2"
            disabled={loading}
          />
          <input
            value={newProject.projectLink}
            onChange={(e) => setNewProject({ ...newProject, projectLink: e.target.value })}
            placeholder="Project Link (e.g., GitHub URL)"
            className="border p-2 w-full mb-2"
            disabled={loading}
          />
          <button 
            onClick={createProject} 
            className="bg-green-500 text-white p-2 rounded disabled:bg-gray-400"
            disabled={loading}
          >
            Create Project
          </button>
        </div>
        {profile?.projects?.map((project: any) => (
          <div key={project._id} className="border p-2 mb-2 flex justify-between items-center">
            <div>
              <h3 className="font-bold">{project.title}</h3>
              <p>{project.description}</p>
              {project.projectLink && (
                <a 
                  href={project.projectLink}  
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Project Link
                </a>
              )}
              {project.image && <img src={project.image} alt="Project" className="w-24 h-24 mt-2" />}
            </div>
            <button
              onClick={() => deleteProject(project._id)}
              className="bg-red-500 text-white p-1 rounded disabled:bg-gray-400"
              disabled={loading}
            >
              Delete
            </button>
          </div>
        ))}
      </section>


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

    </div>
  );
}