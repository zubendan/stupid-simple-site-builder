import { Button } from '@mantine/core';
import { redirect } from 'next/navigation';

import { auth, signOut } from '~/server/auth';
import { routes } from '~/utils/routes';

export default async function SignOutPage() {
  const session = await auth();

  if (!session?.user) {
    redirect(routes.HOME);
  }

  return (
    <div className='h-screen w-full place-content-center'>
      <div className='grid justify-center gap-4 text-center'>
        <h1 className='text-xl font-extrabold tracking-tight sm:text-2xl'>
          Are you sure you want to sign out?
        </h1>
        <form
          action={async () => {
            'use server';
            await signOut({ redirect: false });
          }}
        >
          <Button type='submit'>Sign Out</Button>
        </form>
      </div>
    </div>
  );
}
