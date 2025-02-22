/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "linked-posts.routemisr.com",
        pathname: "/uploads/*",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/", // Change this to the route you want to redirect FROM
        destination: "/thread", // Change this to the target route
        permanent: true, // Set to false if you want a temporary redirect (307)
      },
    ];
  },
};

export default nextConfig;
