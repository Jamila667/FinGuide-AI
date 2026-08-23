/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Vercel build qilayotganda ESLint xatolarini e'tiborsiz qoldiradi
    ignoreDuringBuilds: true,
  },
  typescript: {
    // TypeScript xatolarini ham e'tiborsiz qoldiradi
    ignoreBuildErrors: true,
  },
  experimental: {
    serverComponentsExternalPackages: ['pg', 'bcryptjs', '@prisma/adapter-pg'],
  },
};

export default nextConfig;
