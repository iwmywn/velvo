import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
  reactCompiler: true,
  experimental: {
    turbopackRustReactCompiler: true,
    scrollRestoration: true,
    cpus: 1,
    inlineCss: true,
  },
}

export default nextConfig
