import Header from '@/components/Header';
import InfoCards from '@/components/InfoCards';
import NearbyCafes from '@/components/NearbyCafes';
import { use, useEffect } from 'react';

export default function Home() {
  return (
    <div className="grid grid-rows-[0px_1fr_20px] items-center justify-items-center min-h-screen p-6 pb-20 gap-16 sm:p-4 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div className="text-center mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Collect Coffee Stickers, Earn NFT Rewards
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Visit cafes, scan receipts, complete sticker puzzles, and unlock
            exclusive NFT rewards
          </p>
        </div>
        <InfoCards />
        <NearbyCafes />
      </main>
    </div>
  );
}
