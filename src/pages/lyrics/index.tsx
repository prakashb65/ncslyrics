import { useState } from 'react';
import { useRouter } from 'next/router';
import { FaSearch, FaPrint, FaShare, FaHeart } from 'react-icons/fa';

// Example song data structure
interface Song {
  id: number;
  title: string;
  firstLetter: string;
}

export default function LyricsPage() {
  const router = useRouter();
  const [selectedLetter, setSelectedLetter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Example songs list (you'll replace this with your actual data)
  const songs: Song[] = [
    { id: 1, title: 'Amazing Grace', firstLetter: 'A' },
    { id: 2, title: 'Be Thou My Vision', firstLetter: 'B' },
    { id: 3, title: 'How Great Is Our God', firstLetter: 'H' },
    // Add more songs as needed
  ];

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  const filteredSongs = songs.filter(song => {
    const matchesLetter = selectedLetter === 'all' || song.firstLetter === selectedLetter;
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase());
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

      {/* Songs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSongs.map((song) => (
          <div
            key={song.id}
            onClick={() => router.push(`/lyrics/${song.id}`)}
            className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md cursor-pointer"
          >
            <h2 className="text-xl font-semibold">{song.title}</h2>
          </div>
        ))}
      </div>
    </div>
  );
} 