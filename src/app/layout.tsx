import '~/styles/globals.css';

import { ColorSchemeScript, MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { type Metadata } from 'next';
import { Rubik } from 'next/font/google';

import { TRPCReactProvider } from '~/trpc/react';
import { mantineTheme } from '~/utils/theme';

const rubik = Rubik({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Create T3 App',
  description: 'Generated by create-t3-app',
  icons: [{ rel: 'icon', url: '/favicon.ico' }],
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang='en'
      className={`font-sans ${rubik.variable}`}
      suppressHydrationWarning
    >
      <head>
        <ColorSchemeScript />
      </head>
      <body>
        <MantineProvider theme={mantineTheme} defaultColorScheme='light'>
          <TRPCReactProvider>
            <NuqsAdapter>
              <ModalsProvider modalProps={{ centered: true }}>
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
