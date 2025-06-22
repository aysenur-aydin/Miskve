'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import {
  HomeIcon,
  UserIcon,
  Cog6ToothIcon,
  Bars3Icon,
  XMarkIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HomeIcon as HomeIconSolid,
  CalendarIcon as CalendarIconSolid,
  UserGroupIcon as UserGroupIconSolid,
  UserIcon as UserIconSolid,
  BellIcon as BellIconSolid,
  ChatBubbleLeftIcon as ChatBubbleLeftIconSolid,
  Cog6ToothIcon as Cog6ToothIconSolid,
  MapPinIcon as MapPinIconSolid,
} from '@heroicons/react/24/solid';
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/20/solid';
import { ScanQrCode, Coffee } from 'lucide-react';
import PassKey from './PassKey';

export default function NavigationHeader() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const navigation = [
    {
      name: 'Home',
      href: `/`,
      icon: HomeIcon,
      iconSolid: HomeIconSolid,
    },
    {
      name: 'Scanner',
      href: `/scanner`,
      icon: ScanQrCode,
      iconSolid: ScanQrCode,
    },
    {
      name: 'Coffee Beans',
      href: '/coffeeBeans',
      icon: Coffee,
      iconSolid: Coffee,
    },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 h-[72px] transition-all duration-300 ${
        scrolled
          ? 'bg-white dark:bg-black/80 backdrop-blur-sm shadow-sm'
          : 'bg-white/90'
      } border-b`}
    >
      <div className="max-w-[1440px] mx-auto px-4 md:px-16 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo and Desktop Navigation */}
          <div className="flex items-center">
            <Link href={`/`} className="flex item-center space-x-2">
              <Image
                src="/logo_transparent.svg"
                alt="logo"
                width={24}
                height={30}
                className="h-full object-contain"
                style={{ objectFit: 'contain' }}
              />
              <h1 className="font-['Poppins'] text-2xl font-bold mb-0 lh-base">
                Miskve
              </h1>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 ml-8">
              {navigation.map((item) => {
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive(item.href)
                        ? 'bg-primary-500 text-white'
                        : 'bg-transparent text-primary-900 dark:text-primary-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {isActive(item.href) ? (
                        <item.iconSolid className={`w-5 h-5 text-white`} />
                      ) : (
                        <item.icon className={`w-5 h-5 text-foreground/60`} />
                      )}
                      {item.name}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4">
            {/* <WalletConnection /> */}
            <PassKey />
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg text-foreground/80 hover:text-foreground hover:bg-accent/5"
            >
              {isOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden fixed inset-x-0 top-[72px] bg-background border-b"
          >
            <div className="max-w-[1440px] mx-auto px-4 md:px-16 py-2">
              <div className="grid grid-cols-2 gap-2 py-4">
                {navigation.map((item) => {
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`flex items-center space-x-2 p-3 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? 'bg-primary-500 text-white'
                          : 'bg-transparent text-primary-900 dark:text-primary-300'
                      }`}
                    >
                      {isActive(item.href) ? (
                        <item.iconSolid className={`w-5 h-5 text-accent`} />
                      ) : (
                        <item.icon className={`w-5 h-5 text-foreground/60`} />
                      )}
                      <span className="font-medium">{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
