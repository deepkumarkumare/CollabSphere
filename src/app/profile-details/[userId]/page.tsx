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
        // Type guard to narrow 'err' from 'unknown' to 'Error'
        if (err instanceof Error) {
          if (err.name !== 'AbortError') {
            setError(err.message);
          }
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();

    return () => controller.abort();
  }, [userId, authLoaded]);

  if (!authLoaded) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-gray-600 dark:text-gray-300 text-lg">Loading...</div>
    </div>
  );
  if (!isSignedIn) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-gray-600 dark:text-gray-300 text-lg">Please sign in to view profiles</div>
    </div>
  );
  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-gray-600 dark:text-gray-300 text-lg">Loading profile details...</div>
    </div>
  );
  if (error) return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="text-red-500 dark:text-red-400 text-lg">{error}</div>
    </div>
  );

  const displayName = profile?.socialLinks?.email || profile?.userId;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12">
      <div className="container mx-auto max-w-4xl px-6">
        <div className="mb-8">
          {profile?.image && (
            <div className="w-full h-64 relative overflow-hidden rounded-2xl shadow-lg">
              <img
                src={profile.image}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-6 text-center">
            {displayName}
          </h1>
        </div>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">Skills</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            {profile?.skills?.length > 0 ? (
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {profile.skills.map((skill: any) => (
                  <li
                    key={skill._id}
                    className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors duration-200"
                  >
                    {skill.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No skills listed</p>
            )}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">Interests</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            {profile?.interests?.length > 0 ? (
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {profile.interests.map((interest: any) => (
                  <li
                    key={interest._id}
                    className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 rounded-lg p-3 hover:bg-indigo-50 dark:hover:bg-indigo-900 transition-colors duration-200"
                  >
                    {interest.name}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No interests listed</p>
            )}
          </div>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">Posts</h2>
          {profile?.posts?.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {profile.posts.map((post: any) => (
                <div key={post._id} className="space-y-3">
                  {post.image && (
                    <img
                      src={post.image}
                      alt="Post"
                      className="w-full h-48 rounded-lg object-cover shadow-md"
                    />
                  )}
                  <p className="text-gray-700 dark:text-gray-300">{post.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No posts listed</p>
          )}
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">Projects</h2>
          {profile?.projects?.length > 0 ? (
            <div className="space-y-6">
              {profile.projects.map((project: any) => (
                <div
                  key={project._id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-3"
                >
                  <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100">
                    {project.title}
                  </h3>
                  {project.image && (
                    <div className="w-full h-48 relative overflow-hidden rounded-lg">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <p className="text-gray-700 dark:text-gray-300">{project.description}</p>
                  {project.projectLink && (
                    <a
                      href={project.projectLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-500 dark:text-indigo-400 hover:underline font-medium"
                    >
                      View Project
                    </a>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No projects listed</p>
          )}
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-indigo-600 dark:text-indigo-400 mb-4">Social Links</h2>
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            {profile?.socialLinks ? (
              <div className="space-y-3">
                {profile.socialLinks.github && (
                  <p className="text-gray-700 dark:text-gray-300">
                    GitHub:{' '}
                    <a
                      href={profile.socialLinks.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-500 dark:text-indigo-400 hover:underline"
                    >
                      {profile.socialLinks.github}
                    </a>
                  </p>
                )}
                {profile.socialLinks.email && (
                  <p className="text-gray-700 dark:text-gray-300">
                    Email:{' '}
                    <a
                      href={`mailto:${profile.socialLinks.email}`}
                      className="text-indigo-500 dark:text-indigo-400 hover:underline"
                    >
                      {profile.socialLinks.email}
                    </a>
                  </p>
                )}
                {profile.socialLinks.linkedin && (
                  <p className="text-gray-700 dark:text-gray-300">
                    LinkedIn:{' '}
                    <a
                      href={profile.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-500 dark:text-indigo-400 hover:underline"
                    >
                      {profile.socialLinks.linkedin}
                    </a>
                  </p>
                )}
                {profile.socialLinks.phone && (
                  <p className="text-gray-700 dark:text-gray-300">Phone: {profile.socialLinks.phone}</p>
                )}
                {profile.socialLinks.location && (
                  <p className="text-gray-700 dark:text-gray-300">Location: {profile.socialLinks.location}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-500 dark:text-gray-400">No social links provided</p>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}