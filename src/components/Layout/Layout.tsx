import { ReactNode } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import Image from 'next/image';
import {
  HomeIcon,
  MusicalNoteIcon,
  QueueListIcon,
  Cog6ToothIcon,
  InboxIcon,
  HeartIcon,
  ChatBubbleLeftIcon
} from '@heroicons/react/24/outline';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();
  
  const navigation = [
    { name: 'Home', href: '/', icon: HomeIcon },
    { name: 'Lyrics', href: '/lyrics', icon: MusicalNoteIcon },
    { name: 'Playlists', href: '/playlists', icon: QueueListIcon },
    { name: 'Settings', href: '/settings', icon: Cog6ToothIcon },
    { name: 'Request', href: '/request', icon: InboxIcon },
    { name: 'Donate', href: '/donate', icon: HeartIcon },
    { name: 'Feedback', href: '/feedback', icon: ChatBubbleLeftIcon }
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed w-64 h-full bg-white shadow-sm">
        {/* Logo */}
        <div className="p-6">
          <Link href="/" className="block">
            <div className="flex flex-col items-center">
              <Image
                src="/ncs-logo.png"
                alt="NCS Lyrics"
                width={110}
                height={110}
                priority
                className="mb-2"
              />
              <span className="mt-2 inline-block bg-red-100 px-2 py-0.5 text-xs text-red-600 font-medium rounded-full">
                BETA
              </span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="mt-6">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-6 py-3 text-gray-700 hover:bg-gray-50 ${
                  router.pathname === item.href ? 'bg-gray-50' : ''
                }`}
              >
                <Icon className="w-5 h-5 mr-3" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
