import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images:{
    remotePatterns:[
      {
        protocol: 'https',
        hostname:  'utfs.io',
        port: '',
      }
    ]//we add the url for any remote resources we are going to use images from, in our case we are going to use cloudinary for image hosting so we add their url here
  }
};

export default nextConfig;
