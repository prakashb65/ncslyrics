import { useState } from 'react';
import { useRouter } from 'next/router';
import { FaFolder } from 'react-icons/fa';

// Example category/song data structure (replace with your actual data)
interface Category {
  id: string;
  name: string;
  songs: Song[];
}

interface Song {
  id: string;
  title: string;
  author: string;
}

export default function PlaylistsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);

  // Example categories (replace with your actual data)
  const categories: Category[] = [
    {
      id: '1',
      name: 'Christmas Songs',
      songs: [
        { id: '1', title: 'Silent Night', author: 'Franz Xaver Gruber' },
        { id: '2', title: 'Joy to the World', author: 'Isaac Watts' },
      ]
    },
    {
      id: '2',
      name: 'Gospel Songs',
      songs: [
        { id: '3', title: 'Amazing Grace', author: 'John Newton' },
        { id: '4', title: 'How Great Thou Art', author: 'Carl Boberg' },
      ]
    },
    {
      id: '3',
      name: 'Praise & Worship',
      songs: [
        { id: '5', title: 'How Great Is Our God', author: 'Chris Tomlin' },
        { id: '6', title: 'Blessed Be Your Name', author: 'Matt Redman' },
      ]
    },
  ];

  const handleCategorySelect = (categoryId: string) => {
    if (isNavigating) return;
    setIsNavigating(true);
    setSelectedCategory(categoryId);
    setTimeout(() => setIsNavigating(false), 500);
  };

  const handleSongSelect = (songId: string) => {
    if (isNavigating) return;
    setIsNavigating(true);
    router.push(`/lyrics/${songId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {!selectedCategory ? (
        // Category Folders View
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Playlists</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className="group"
                disabled={isNavigating}
              >
                <div className="aspect-square bg-blue-100 rounded-2xl p-6 flex flex-col items-center justify-center transition-transform transform group-hover:scale-105 group-hover:shadow-lg">
                  <FaFolder className="text-blue-500 text-6xl mb-4" />
                  <span className="text-gray-700 font-medium text-center">
                    {category.name}
                  </span>
                  <span className="text-gray-500 text-sm mt-2">
                    {category.songs.length} songs
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        // Songs List View
        <div>
          <div className="flex items-center mb-8">
            <button
              onClick={() => setSelectedCategory(null)}
              className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
              disabled={isNavigating}
            >
              ← Back to Categories
            </button>
            <h2 className="text-2xl font-bold text-gray-900 ml-8">
              {categories.find(c => c.id === selectedCategory)?.name}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories
              .find(c => c.id === selectedCategory)
              ?.songs.map((song) => (
                <div
                  key={song.id}
                  onClick={() => handleSongSelect(song.id)}
                  className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-6 ${
                    isNavigating ? 'pointer-events-none' : ''
                  }`}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {song.title}
                  </h3>
                  <p className="text-gray-500">
                    {song.author}
                  </p>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
} 