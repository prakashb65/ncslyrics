import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { FaFolder } from 'react-icons/fa';

interface Song {
  id: string;
  title: string;
  artist: string;
  category?: string;
  lyrics: string;
}

interface Category {
  id: string;
  name: string;
}

export default function PlaylistsPage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);

  useEffect(() => {
    fetchCategories();
    fetchSongs();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchSongs = async () => {
    try {
      const response = await fetch('/api/lyrics');
      if (!response.ok) throw new Error('Failed to fetch lyrics');
      const data = await response.json();
      setSongs(data.items || []);
    } catch (error) {
      console.error('Error fetching lyrics:', error);
    }
  };

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

  // Get songs for a specific category
  const getSongsForCategory = (categoryName: string) => {
    return songs.filter(song => song.category === categoryName);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {!selectedCategory ? (
        // Category Folders View
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Playlists</h1>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.map((category) => {
              const categorySongs = getSongsForCategory(category.name);
              return (
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
                      {categorySongs.length} songs
                    </span>
                  </div>
                </button>
              );
            })}
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
            {(() => {
              const category = categories.find(c => c.id === selectedCategory);
              if (!category) return null;
              
              const categorySongs = getSongsForCategory(category.name);
              return categorySongs.map((song) => (
                <div
                  key={song.id}
                  onClick={() => handleSongSelect(song.id)}
                  className={`bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-6 ${
                    isNavigating ? 'pointer-events-none' : ''
                  }`}
                >
                  <h3 className="text-lg font-semibold text-gray-800 text-center">
                    {song.title}
                  </h3>
                </div>
              ));
            })()}
          </div>
        </div>
      )}
    </div>
  );
} 