/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "firebasestorage.googleapis.com",
      "upload.wikimedia.org",

      "https://upload.wikimedia.org",
    ],
  },
};

module.exports = nextConfig;
