import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  transpilePackages: [
    '@kupuri/design-system',
    '@kupuri/localization',
    '@kupuri/shared-config',
  ],
  // Allow iframes from the preview host to be embedded in studio
  async headers() {
    return [
      {
        source: '/preview/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          {
            key: 'Content-Security-Policy',
            value: "frame-ancestors 'self' localhost:3001",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
