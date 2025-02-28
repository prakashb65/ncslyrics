import Link from 'next/link'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-3">नेपाली भजन संग्रह</h1>
        <p className="text-gray-600 mb-8">Your Complete Collection of Nepali Christian Songs</p>
        
        <div className="flex gap-4 justify-center">
          <Link 
            href="/lyrics" 
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            Browse Lyrics
          </Link>
          <Link 
            href="/request" 
            className="px-6 py-2 bg-white text-gray-800 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors"
          >
            Request Song
          </Link>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="grid grid-cols-3 gap-6 mb-16">
        <div className="bg-white rounded-lg p-6 text-center shadow-sm">
          <div className="text-4xl font-bold text-blue-500 mb-2">8+</div>
          <div className="text-gray-600">Songs Available</div>
        </div>
        <div className="bg-white rounded-lg p-6 text-center shadow-sm">
          <div className="text-4xl font-bold text-blue-500 mb-2">0</div>
          <div className="text-gray-600">Weekly Users</div>
        </div>
        <div className="bg-white rounded-lg p-6 text-center shadow-sm">
          <div className="text-4xl font-bold text-blue-500 mb-2">5+</div>
          <div className="text-gray-600">New Songs Monthly</div>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white rounded-lg p-6 text-center shadow-sm">
          <div className="flex justify-center mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <rect width="20" height="16" x="2" y="4" rx="2"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Projector Mode</h3>
          <p className="text-gray-600 text-sm">Present lyrics in full-screen mode, perfect for church projections</p>
        </div>

        <div className="bg-white rounded-lg p-6 text-center shadow-sm">
          <div className="flex justify-center mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Customizable Display</h3>
          <p className="text-gray-600 text-sm">Adjust colors and font sizes to match your presentation needs</p>
        </div>

        <div className="bg-white rounded-lg p-6 text-center shadow-sm">
          <div className="flex justify-center mb-4">
            <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Quick Search</h3>
          <p className="text-gray-600 text-sm">Find songs instantly with our powerful search feature</p>
        </div>
      </div>
    </div>
  )
}