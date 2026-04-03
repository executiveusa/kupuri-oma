import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  transpilePackages: [
    '@kupuri/design-system',
    '@kupuri/localization',
    '@kupuri/content-model',
    '@kupuri/shared-config',
  ],
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '**.kupuri.com' },
      { protocol: 'https', hostname: 'cdn.kupuri.com' },
    ],
  },

}

export default withNextIntl(nextConfig)
