import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  serverExternalPackages: ['pg', '@prisma/adapter-pg'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
      },
    ],
  },

  async redirects() {
    
    return [
      {
        source: '/',                      
        destination: '/accueil',  
        permanent: true,                  
      },
    ];
  },
};

export default nextConfig;
