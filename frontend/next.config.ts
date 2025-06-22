import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: [
    'passkey-kit',
    'passkey-factory-sdk',
    'passkey-kit-sdk',
    'sac-sdk',
  ],
  output: 'standalone',
};

export default nextConfig;
