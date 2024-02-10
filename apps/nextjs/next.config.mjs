// Importing env files here to validate on build
import './src/env.mjs'
import '@evy/auth/env.mjs'
import withMdx from '@next/mdx'
import withBundleAnalyzer from '@next/bundle-analyzer'

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    swcPlugins: [['next-superjson-plugin', {}]],
    appDir: false,
    // this also controls running workers https://github.com/vercel/next.js/issues/45508#issuecomment-1597087133, which is causing
    // memory issues in 13.4.4 so until that's fixed, we don't want this.
    // supposedly fixed in 13.4.10 ~ 14.0.0, so until then - keep disabled
  },
  /** enable MDX pages (statically generated pages) */
  pageExtensions: ['mdx', 'ts', 'tsx'],
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
        hostname: 'evy.app',
        port: '',
      },
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
    // loader: 'custom',
    // loaderFile: './images/loader.js',
  },
  // https://github.com/vercel/next.js/discussions/39549
  webpack(config, { nextRuntime }) {
    config.experiments = { ...config.experiments, topLevelAwait: true }

    if (nextRuntime !== 'nodejs') return config ?? null
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    }
    return config ?? null
  },
}

const combinePlugins = (/** @type {import('next').NextConfig} */ config) => {
  const plugins = [
    withMdx(),
    withBundleAnalyzer({ enabled: process.env.ANALYZE === 'true' }),
  ]
  return plugins.reduce((acc, cur) => cur(acc), config)
}

export default combinePlugins(config)
