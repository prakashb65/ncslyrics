import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { Box } from '@chakra-ui/react';
import AdminSidebar from './AdminSidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');

  if (isAdminRoute) {
    return (
      <Box minH="100vh" bg="gray.900">
        <AdminSidebar />
        <Box ml={{ base: 0, md: 60 }}>
          {children}
        </Box>
      </Box>
    );
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg fixed h-full">
        <div className="p-4 flex flex-col items-center">
          <Link href="/" className="block text-center">
            <div className="flex flex-col items-center">
              <Image 
                src="/ncs-logo.png" 
                alt="NCS LYRICS" 
                width={110} 
                height={110} 
                className="mb-1"
                priority
              />
              <div className="mt-1">
                <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                  BETA
                </span>
              </div>
            </div>
          </Link>
        </div>

        <nav className="mt-6">
          <Link href="/"
            className={`flex items-center px-6 py-3 ${
              router.pathname === '/' ? 'bg-gray-100' : ''
            }`}>
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Home
          </Link>

          <Link href="/lyrics"
            className={`flex items-center px-6 py-3 ${
              router.pathname.startsWith('/lyrics') ? 'bg-gray-100' : ''
            }`}>
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
            </svg>
            Lyrics
          </Link>

          <Link href="/playlists"
            className={`flex items-center px-6 py-3 ${
              router.pathname.startsWith('/playlists') ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}>
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
            Playlists
          </Link>

          <Link href="/settings"
            className={`flex items-center px-6 py-3 ${
              router.pathname === '/settings' ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}>
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
            </svg>
            Settings
          </Link>

          <Link href="/request"
            className={`flex items-center px-6 py-3 ${
              router.pathname === '/request' ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}>
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Request
          </Link>

          <Link href="/donate"
            className={`flex items-center px-6 py-3 ${
              router.pathname === '/donate' ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}>
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
            Donate
          </Link>

          <Link href="/feedback"
            className={`flex items-center px-6 py-3 ${
              router.pathname === '/feedback' ? 'bg-gray-100' : 'hover:bg-gray-50'
            }`}>
            <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
            </svg>
            Feedback
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        {children}
      </div>
    </div>
  );
} 