// Importing env files here to validate on build
import './src/env.mjs'
import '@evy/auth/env.mjs'

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    swcPlugins: [['next-superjson-plugin', {}]],
  },
  /** enable standalone deployment for docker */
  output: 'standalone',
  reactStrictMode: true,
  transpilePackages: [
    /** Enables hot reloading for local packages without a build step */
    '@evy/api',
    '@evy/db',
    '@evy/auth',
    '@evy/images',
    '@evy/styles',
    /** Required as per mdxeditor docs  */
    '@mdxeditor/editor',
    'react-diff-view',
  ],
  /** We already do linting and typechecking as separate tasks in CI */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'imagedelivery.net',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
      },
    ],
    // only necessary to resize local images
    //   loader: 'custom',
    //   loaderFile: './images/loader.js',
  },
  // https://github.com/vercel/next.js/discussions/39549
  webpack(config, { nextRuntime }) {
    config.experiments = { ...config.experiments, topLevelAwait: true }

    if (nextRuntime !== 'nodejs') return config
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    }
    return config
  },
}

export default config
