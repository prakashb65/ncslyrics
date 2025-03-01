import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaSearch } from 'react-icons/fa';

interface Lyric {
  id: string;
  title: string;
  category?: string;
}

export default function LyricsPage() {
  const router = useRouter();
  const [selectedLetter, setSelectedLetter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [lyrics, setLyrics] = useState<Lyric[]>([]);

  useEffect(() => {
    fetchLyrics();
  }, []);

  const fetchLyrics = async () => {
    try {
      const response = await fetch('/api/lyrics');
      if (!response.ok) throw new Error('Failed to fetch lyrics');
      const data = await response.json();
      setLyrics(data.items || []);
    } catch (error) {
      console.error('Error fetching lyrics:', error);
    }
  };

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const filteredLyrics = lyrics
    .sort((a, b) => a.title.localeCompare(b.title))
    .filter(lyric => {
      const firstLetter = lyric.title.charAt(0).toUpperCase();
      const matchesLetter = selectedLetter === 'all' || firstLetter === selectedLetter;
      const matchesSearch = lyric.title.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesLetter && matchesSearch;
    });

  return (
    <div className="p-8">
      {/* Search and Filter Section */}
      <div className="mb-8 flex items-center gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search songs..."
            className="w-full p-3 pr-12 rounded-lg border"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-2xl text-gray-400" />
        </div>
      </div>

      {/* Alphabetical Filter */}
      <div className="mb-8 flex flex-wrap gap-2 justify-center">
        <button
          onClick={() => setSelectedLetter('all')}
          className={`px-3 py-1 rounded ${
            selectedLetter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'
          }`}
        >
          All
        </button>
        {alphabet.map((letter) => (
          <button
            key={letter}
            onClick={() => setSelectedLetter(letter)}
            className={`px-3 py-1 rounded ${
              selectedLetter === letter ? 'bg-blue-500 text-white' : 'bg-gray-200'
            }`}
          >
            {letter}
          </button>
        ))}
      </div>

      {/* Songs List */}
      <div className="grid grid-flow-row-dense auto-rows-auto grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredLyrics.map((lyric, index) => (
          <div
            key={lyric.id}
            onClick={() => router.push(`/lyrics/${lyric.id}`)}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-shadow"
            style={{ order: index }}
          >
            <h2 className="text-xl font-semibold text-left pl-2">{lyric.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
} 