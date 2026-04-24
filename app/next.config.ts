import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable gzip/brotli compression for all responses
  compress: true,

  // Optimize image delivery with modern formats
  images: {
    formats: ['image/avif', 'image/webp'],
  },

  experimental: {
    // Tree-shake icon libraries — only import icons actually used,
    // instead of bundling the full lucide-react / react-icons packages.
    optimizePackageImports: ['lucide-react', 'react-icons'],
  },
};

export default nextConfig;
