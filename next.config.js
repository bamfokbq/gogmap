/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    GOOGLE_MAPS_API_KEY: 'AIzaSyADzPhWB9KHQax9sZLmjIyn590YG3OT4ic',
    LIBRARY_OPTIONS: ['places'],
  },
};

module.exports = nextConfig
