'use client';
import { Icon } from '@iconify/react';
import { Button, SimpleGrid } from '@mantine/core';
import { getProviders, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getSession } from '~/server/functions/auth';
import { routes } from '~/utils/routes';

export default function Page() {
  const router = useRouter();
  const [providers, setProviders] =
    useState<Awaited<ReturnType<typeof getProviders>>>(null);
  useEffect(() => {
    const initAuth = async () => {
      const session = await getSession();
      if (session) {
        router.push(routes.ORGANIZATIONS);
      }
    };
    const initProviders = async () => {
      setProviders(await getProviders());
    };
    initAuth();
    initProviders();
  }, []);

  const appleProvider = providers?.apple;
  const githubProvider = providers?.github;
  const googleProvider = providers?.google;
  const discordProvider = providers?.discord;

  return (
    <div className='h-lvh w-lvw [background:linear-gradient(225deg,hsl(225_79.2%_81.2%),hsl(221_59.5%_71%),hsl(224_46.7%_61%),hsl(227_39.2%_51%),hsl(228_49.8%_40.6%))] flex justify-center items-center'>
      <div className='w-[600px] text-center'>
        <h1 className='text-5xl font-semibold bg-gradient-to-tr from-neutral-950 via-neutral-800 to-neutral-600 bg-clip-text text-transparent pb-6'>
          Some Sign In Text
        </h1>
        <div className='bg-white p-6 rounded-md'>
          {/* // a form */}

          <div className='flex justify-center'>
            <SimpleGrid cols={1} className='w-[300px]'>
              {googleProvider && (
                <Button
                  onClick={() => signIn(googleProvider.id, {})}
                  leftSection={
                    <Icon
                      icon='tabler:brand-google-filled'
                      className='text-lg'
                    />
                  }
                >
                  Sign in with {googleProvider.name}
                </Button>
              )}
              {appleProvider && (
                <Button
                  onClick={() => signIn(appleProvider.id)}
                  leftSection={<Icon icon='tabler:brand-apple-filled' />}
                >
                  Sign in with {appleProvider.name}
                </Button>
              )}
              {githubProvider && (
                <Button
                  onClick={() => signIn(githubProvider.id)}
                  leftSection={<Icon icon='tabler:brand-github-filled' />}
                >
                  Sign in with {githubProvider.name}
                </Button>
              )}
              {discordProvider && (
                <Button
                  onClick={() => signIn(discordProvider.id)}
                  leftSection={<Icon icon='tabler:brand-discord-filled' />}
                >
                  Sign in with {discordProvider.name}
                </Button>
              )}
            </SimpleGrid>
          </div>
        </div>
      </div>
    </div>
  );
}
