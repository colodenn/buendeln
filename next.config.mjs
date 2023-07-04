/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    esmExternals: "loose",
  },
  transpilePackages: ["@deck.gl/layers", "@mapbox/tiny-sdf"],
}

export default nextConfig
