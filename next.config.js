/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  reactStrictMode: true,
  // Reduce chunk loading timeouts in dev
  experimental: {
    optimizePackageImports: ['@privy-io/react-auth', '@solana/kit', 'framer-motion'],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      'pino-pretty': false,
    };
    // Inject React so dependencies (Privy, framer-motion) that expect React in scope work during prerender
    config.plugins.push(
      new webpack.ProvidePlugin({
        React: 'react',
      })
    );
    return config;
  },
}

module.exports = nextConfig
