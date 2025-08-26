/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    outputFileTracing: true,
  },
  outputFileTracingIncludes: {
    "**/*": [
      "src/data/videos.json",
    ],
  },
};

module.exports = nextConfig;