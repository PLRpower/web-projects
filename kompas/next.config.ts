import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  serverExternalPackages: ['unpdf', '@napi-rs/canvas'],
  async rewrites() {
    return [
      { source: '/logo.svg', destination: '/img/logo.svg' },
      { source: '/logo-dark.svg', destination: '/img/logo.svg' },
      { source: '/logo-light.svg', destination: '/img/logo-black.svg' },
      { source: '/logo-dark.png', destination: '/img/logo-dark.png' },
      { source: '/logo-light.png', destination: '/img/logo-light.png' },
    ];
  },
};

export default nextConfig;

