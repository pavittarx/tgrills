import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [{
      protocol: 'https',
      hostname: 'stcyfdgqzywrxgjzmary.supabase.co',
      // port: '',
      // pathname: '',
      // search: ''
    }]
  }
};

export default nextConfig;
