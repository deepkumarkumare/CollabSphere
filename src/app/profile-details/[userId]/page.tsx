
// app/profile-details/[userId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function ProfileDetails() {
  const { isLoaded: authLoaded, isSignedIn } = useUser();
  const { userId } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const fetchProfile = async () => {
      if (!userId || !authLoaded) return;

      try {
        setLoading(true);
        setError(null);
        setProfile(null);
        const res = await fetch('/api/profile-details', {
          method: 'POST',
          body: JSON.stringify({ userId }),
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          cache: 'no-store',
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch profile details');
        }
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err instanceof Error ? err.message : 'An error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();

    return () => controller.abort();
  }, [userId, authLoaded]);

  if (!authLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Please sign in to view profiles</div>;
  if (loading) return <div>Loading profile details...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  const displayName = profile?.socialLinks?.email || profile?.userId;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile Details: {displayName}</h1>

      {/* Profile Image */}
      {profile?.image && (
        <img src={profile.image} alt="Profile" className="w-32 h-32 rounded-full mb-4" />
      )}

      {/* Skills */}
      <section className="mb-6">
        <h2 className="text-xl mb-2 text-green-600">Skills</h2>
        {profile?.skills?.length > 0 ? (
          <ul className="list-disc pl-5">
            {profile.skills.map((skill: any) => (
              <li key={skill._id}>{skill.name}</li>
            ))}
          </ul>
        ) : (
          <p>No skills listed</p>
        )}
      </section>

      {/* Interests */}
      <section className="mb-6">
        <h2 className="text-xl mb-2 text-green-600">Interests</h2>
        {profile?.interests?.length > 0 ? (
          <ul className="list-disc pl-5">
            {profile.interests.map((interest: any) => (
              <li key={interest._id}>{interest.name}</li>
            ))}
          </ul>
        ) : (
          <p>No interests listed</p>
        )}
      </section>

      {/* Posts */}
      <section className="mb-6">
        <h2 className="text-xl mb-2 text-green-600">Posts</h2>
        {profile?.posts?.length > 0 ? (
          <div className="grid gap-4">
            {profile.posts.map((post: any) => (
              <div key={post._id} className="border p-4 rounded bg-gray-50">
                <p>{post.content}</p>
                {post.image && <img src={post.image} alt="Post" className="w-24 h-24 mt-2" />}
                <p className="text-sm text-gray-500">
                  Posted on: {new Date(post.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No posts listed</p>
        )}
      </section>

      {/* Projects */}
      <section className="mb-6">
        <h2 className="text-xl mb-2 text-green-600">Projects</h2>
        {profile?.projects?.length > 0 ? (
          <div className="grid gap-4">
            {profile.projects.map((project: any) => (
              <div key={project._id} className="border p-4 rounded bg-gray-50">
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
                {project.image && (
                  <img src={project.image} alt={project.title} className="w-24 h-24 mt-2" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <p>No projects listed</p>
        )}
      </section>

      {/* Social Links */}
      <section className="mb-6">
        <h2 className="text-xl mb-2 text-green-600">Social Links</h2>
        {profile?.socialLinks ? (
          <div className="grid gap-2">
            {profile.socialLinks.github && (
              <p>
                GitHub:{' '}
                <a
                  href={profile.socialLinks.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {profile.socialLinks.github}
                </a>
              </p>
            )}
            {profile.socialLinks.email && (
              <p>
                Email:{' '}
                <a
                  href={`mailto:${profile.socialLinks.email}`}
                  className="text-blue-500 hover:underline"
                >
                  {profile.socialLinks.email}
                </a>
              </p>
            )}
            {profile.socialLinks.linkedin && (
              <p>
                LinkedIn:{' '}
                <a
                  href={profile.socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {profile.socialLinks.linkedin}
                </a>
              </p>
            )}
            {profile.socialLinks.phone && <p>Phone: {profile.socialLinks.phone}</p>}
            {profile.socialLinks.location && <p>Location: {profile.socialLinks.location}</p>}
          </div>
        ) : (
          <p>No social links provided</p>
        )}
      </section>
    </div>
  );
}