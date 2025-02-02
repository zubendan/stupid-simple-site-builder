import '~/styles/globals.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { type Metadata } from 'next';
import { Lexend } from 'next/font/google';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { TRPCReactProvider } from '~/trpc/react';
import { mantineTheme } from '~/utils/theme';

const font = Lexend({
  // weight: ['300', '400', '500', '600', '700', '800', '900'],
  // weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'VERSA',
  description: 'A stupid simple site builder',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`font-sans ${font.variable}`}>
        <MantineProvider theme={mantineTheme} defaultColorScheme='light'>
          <TRPCReactProvider>
            <NuqsAdapter>
              <ModalsProvider
                modalProps={{
                  centered: true,
                }}
              >
                {children}
                <Notifications />
              </ModalsProvider>
            </NuqsAdapter>
          </TRPCReactProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
