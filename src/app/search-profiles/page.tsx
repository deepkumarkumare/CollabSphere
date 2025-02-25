// app/search-profiles/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

export default function SearchProfiles() {
  const { isSignedIn, isLoaded } = useUser();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/search-profiles?q=${encodeURIComponent(query)}`, {
        cache: 'no-store',
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to search profiles');
      }
      const data = await res.json();
      setResults(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (!isLoaded) return <div>Loading...</div>;
  if (!isSignedIn) return <div>Please sign in to search profiles</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Search Profiles (New)</h1>

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by skills, interests, or email..."
            className="border p-2 flex-1"
            disabled={loading}
          />
          <button
            type="submit"
            className="bg-green-500 text-white p-2 rounded disabled:bg-gray-400"
            disabled={loading}
          >
            Search
          </button>
        </div>
      </form>

      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {results.length > 0 ? (
        <div className="grid gap-4">
          {results.map((profile) => (
            <div
              key={profile.userId}
              className="border p-4 rounded cursor-pointer hover:bg-gray-100"
              onClick={() => router.push(`/profile-details/${profile.userId}`)}
            >
              <h2 className="font-bold">
                {profile.socialLinks?.email || profile.userId}
              </h2>
              <p>Skills: {profile.skills?.length || 0}</p>
              <p>Interests: {profile.interests?.length || 0}</p>
            </div>
          ))}
        </div>
      ) : (
        !loading && <p>No profiles found</p>
      )}
    </div>
  );
}