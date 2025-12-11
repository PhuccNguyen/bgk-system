/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'i.imgur.com',
      'imgur.com',
      'drive.google.com',
      'lh3.googleusercontent.com',
      'res.cloudinary.com',
      'storage.googleapis.com',
    ],
    formats: ['image/avif', 'image/webp'],
  },
  reactStrictMode: true,
  swcMinify: true,
}

module.exports = nextConfig
