import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  transpilePackages: [
    '@kupuri/design-system',
    '@kupuri/content-model',
    '@kupuri/graph-engine',
    '@kupuri/community-engine',
    '@kupuri/localization',
    '@kupuri/shared-config',
    '@kupuri/synthia-core',
  ],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.kupuri.mx' },
      { protocol: 'https', hostname: 'avatars.githubusercontent.com' },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client'],
  },
}

export default withNextIntl(nextConfig)
