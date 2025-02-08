import { Anchor, Button } from '@mantine/core';
import Link from 'next/link';

import { auth } from '~/server/auth';
import { HydrateClient } from '~/trpc/server';
import { routes } from '~/utils/routes';

export default async function Home() {
  const session = await auth();

  return (
    <HydrateClient>
      <header className='grid grid-cols-[auto_1fr] grid-rows-1 px-2 sm:px-4 py-2 gap-4'>
        <Link
          href={routes.HOME}
          className='font-bold text-2xl bg-clip-text [-webkit-text-fill-color:transparent] bg-gradient-to-tr from-skyfall-300 to-skyfall-900'
        >
          VERSA
        </Link>
        <div className='flex items-center gap-4 w-full justify-end'>
          <Anchor
            component={Link}
            href={routes.ABOUT}
            className='font-medium text-black hover:text-skyfall-500 !no-underline'
          >
            About
          </Anchor>
          <Anchor
            component={Link}
            href={routes.PRICING}
            className='font-medium text-black hover:text-skyfall-500 !no-underline'
          >
            Pricing
          </Anchor>
          {session ? (
            <Button component={Link} size='sm' href={routes.ORGANIZATIONS}>
              Build
            </Button>
          ) : (
            <Button component={Link} size='sm' href={routes.SIGN_IN}>
              Sign in
            </Button>
          )}
        </div>
      </header>
      <main className='relative min-h-screen'>
        <div className='bg-skyfall-500 px-10 text-center py-16 text-neutral-50'>
          <h1 className='text-4xl font-bold pb-6'>
            Build your website with <strong>VERSA</strong>
          </h1>
          <p className='pb-6 text-lg'>
            Experience <strong>Versaility</strong>, <strong>Efficiency</strong>,
            and <strong>Reliability</strong>
            <br /> all in one <strong>Sitebuilder</strong> with the best{' '}
            <strong>Accessibility</strong>
          </p>
          <Button
            component={Link}
            href={routes.SIGN_IN}
            variant='white'
            className='hover:-translate-y-1 transition-transform'
          >
            Get Started
          </Button>
        </div>
      </main>
    </HydrateClient>
  );
}
