import type { Metadata } from 'next';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import '../../../packages/design-system/src/styles/globals.css';

export const metadata: Metadata = {
  title: 'Kupuri — Preview Host',
  description: 'MCP inline preview surface',
  robots: { index: false },
};

export function generateStaticParams() {
  return [{ locale: 'es-MX' }, { locale: 'en' }];
}

export default async function MCPHostLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!['es-MX', 'en'].includes(locale)) notFound();

  const messages = await getMessages();
  return (
    <html lang={locale}>
      <body className="bg-neutral-950 text-neutral-50 antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
