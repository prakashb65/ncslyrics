import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { 
  HomeIcon, 
  MusicalNoteIcon, 
  QueueListIcon, 
  Cog6ToothIcon, 
  InboxIcon, 
  ChatBubbleLeftIcon, 
  GiftIcon 
} from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Home', icon: HomeIcon, path: '/' },
  { name: 'Lyrics', icon: MusicalNoteIcon, path: '/lyrics' },
  { name: 'Playlists', icon: QueueListIcon, path: '/playlists' },
  { name: 'Settings', icon: Cog6ToothIcon, path: '/settings' },
  { name: 'Request', icon: InboxIcon, path: '/request' },
  { name: 'Donate', icon: GiftIcon, path: '/donate' },
  { name: 'Feedback', icon: ChatBubbleLeftIcon, path: '/feedback' },
];

const Sidebar = () => {
  const router = useRouter();

  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6">
        <Link href="/" className="block">
          <div className="flex flex-col items-center">
            <div className="w-32 h-32 bg-red-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
              NCS LYRICS
            </div>
            <div className="mt-2">
              <span className="bg-red-100 px-2 py-0.5 rounded-full text-xs text-red-500 font-medium">
                BETA
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.name}
            href={item.path}
            className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
              router.pathname === item.path
                ? 'bg-gray-100 text-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <item.icon className="h-5 w-5 mr-3" />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t">
        <Link href="/profile" className="flex items-center px-4 py-2 text-gray-600">
          <span>User Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;