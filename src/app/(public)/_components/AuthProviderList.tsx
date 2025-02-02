'use client';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Button, SimpleGrid } from '@mantine/core';
import { getProviders, signIn } from 'next-auth/react';

const providers = await getProviders();
export const AuthProviderList = ({
  callbackUrl,
}: { callbackUrl: string | undefined }) => {
  const appleProvider = providers?.apple;
  const githubProvider = providers?.github;
  const googleProvider = providers?.google;
  const discordProvider = providers?.discord;

  return (
    <SimpleGrid cols={1} className='w-[300px]'>
      {googleProvider && (
        <Button
          onClick={() => signIn(googleProvider.id, { callbackUrl })}
          leftSection={
            <Icon icon='tabler:brand-google-filled' className='text-lg' />
          }
        >
          Sign in with {googleProvider.name}
        </Button>
      )}
      {appleProvider && (
        <Button
          onClick={() => signIn(appleProvider.id, { callbackUrl })}
          leftSection={<Icon icon='tabler:brand-apple-filled' />}
        >
          Sign in with {appleProvider.name}
        </Button>
      )}
      {githubProvider && (
        <Button
          onClick={() => signIn(githubProvider.id, { callbackUrl })}
          leftSection={<Icon icon='tabler:brand-github-filled' />}
        >
          Sign in with {githubProvider.name}
        </Button>
      )}
      {discordProvider && (
        <Button
          onClick={() => signIn(discordProvider.id, { callbackUrl })}
          leftSection={<Icon icon='tabler:brand-discord-filled' />}
        >
          Sign in with {discordProvider.name}
        </Button>
      )}
    </SimpleGrid>
  );
};
