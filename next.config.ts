import type { NextConfig } from 'next';

// Allow loading external images (Supabase storage, CDN, etc.).
// We dynamically add the host from NEXT_PUBLIC_SUPABASE_URL if present,
// and include some common providers — add more hosts as needed.
const supabaseHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? process.env.NEXT_PUBLIC_SUPABASE_URL.replace(/^https?:\/\//, '').replace(/\/$/, '')
  : undefined;

const allowedImageDomains = [
  // common external image hosts
  'storage.googleapis.com',
  'images.unsplash.com',
  'avatars.githubusercontent.com',
  'lh3.googleusercontent.com',
];

if (supabaseHost) allowedImageDomains.push(supabaseHost);

const nextConfig: NextConfig = {
  images: {
    domains: allowedImageDomains,
    // If you need more flexible matching (subdomains / paths),
    // you can add remotePatterns here. Example:
    // remotePatterns: [
    //   { protocol: 'https', hostname: '**.supabase.co', pathname: '/**' },
    // ],
  },
};

export default nextConfig;
