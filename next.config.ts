import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  serverExternalPackages: ['pg', '@prisma/adapter-pg'],

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
