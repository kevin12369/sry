/** @type {import('next').NextConfig} */
const path = require('path');

const nextConfig = {
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
  webpack(config) {
    // Map @/* to src/* (matches tsconfig paths) so imports like
    // `@/components/Foo.js` resolve to `src/components/Foo.tsx`.
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      '@': path.resolve(__dirname, 'src'),
    };
    // Also allow extensionless / .js -> .ts/.tsx resolution everywhere.
    config.resolve.extensionAlias = {
      ...(config.resolve.extensionAlias || {}),
      '.js': ['.ts', '.tsx', '.js'],
      '.mjs': ['.mts', '.mjs'],
    };
    return config;
  },
};
module.exports = nextConfig;
