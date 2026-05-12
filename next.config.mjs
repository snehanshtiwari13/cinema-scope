/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_TMDB_API_KEY: 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5NDU2MmZlOTllZDIxNjAyYjE4ODQ2MmM0ZjQ4NTE0ZCIsIm5iZiI6MTc3ODU4MTcxNy4xMzUsInN1YiI6IjZhMDMwMGQ1ZGY3ZTJhZDVmM2NmZDkyOSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.VCNYjCBkO3z6ENuYz6Pn1h1V6C0ZzsLsYUqfS-dg3Y8',
    NEXT_PUBLIC_TMDB_PROXY_URL: 'https://tmdb-proxy.vercel.app/3',
  },
  async rewrites() {
    return [
      {
        source: "/api/images/:path*",
        destination: "https://image.tmdb.org/t/p/:path*",
      },
    ];
  },
};

export default nextConfig;