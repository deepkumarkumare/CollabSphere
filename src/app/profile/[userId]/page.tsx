// app/profile/[userId]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function PublicProfile() {
  const { isLoaded: authLoaded, isSignedIn, user } = useUser();
  const currentUserId = user?.id;
  const { userId } = useParams();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!userId || !authLoaded) return;

      try {
        setLoading(true);
        const res = await fetch('/api/profile/public', {
          method: 'POST',
          body: JSON.stringify({ userId }),
          headers: { 'Content-Type': 'application/json' }
        });
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || 'Failed to fetch profile');
        }
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [userId, authLoaded]);

  if (!authLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Please sign in to view profiles</div>;
  if (loading) return <div>Loading profile...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Use email if available, otherwise fall back to userId
  const displayName = profile?.socialLinks?.email || userId;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Profile: {displayName}</h1>

      {/* Skills */}
      <section className="mb-6">
        <h2 className="text-xl mb-2">Skills</h2>
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
        <h2 className="text-xl mb-2">Interests</h2>
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

      {/* Projects */}
      <section className="mb-6">
        <h2 className="text-xl mb-2">Projects</h2>
        {profile?.projects?.length > 0 ? (
          <div className="grid gap-4">
            {profile.projects.map((project: any) => (
              <div key={project._id} className="border p-4 rounded">
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
        <h2 className="text-xl mb-2">Social Links</h2>
        {profile?.socialLinks ? (
          <div className="grid gap-2">
            {profile.socialLinks.github && (
              <p>
                GitHub:{' '}
                <a href={profile.socialLinks.github} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {profile.socialLinks.github}
                </a>
              </p>
            )}
            {profile.socialLinks.email && (
              <p>
                Email:{' '}
                <a href={`mailto:${profile.socialLinks.email}`} className="text-blue-500 hover:underline">
                  {profile.socialLinks.email}
                </a>
              </p>
            )}
            {profile.socialLinks.linkedin && (
              <p>
                LinkedIn:{' '}
                <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
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