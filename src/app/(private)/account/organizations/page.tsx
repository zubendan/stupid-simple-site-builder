'use client';
import { Image, Stack } from '@mantine/core';
import NextImage from 'next/image';
import Link from 'next/link';
import { useShallow } from 'zustand/react/shallow';
import { CreateOrganizationButton } from '~/app/(private)/_components/organizations/CreateButton';
import { useDashboardStore } from '~/components/private/store/provider';
import { api } from '~/trpc/react';
import { routes } from '~/utils/routes';

export default function Page() {
  const { user } = useDashboardStore(
    useShallow((s) => ({
      user: s.user,
    })),
  );
  const { data, isLoading } = api.organization.list.useQuery({
    page: 1,
    perPage: 10,
    search: '',
    userId: user?.id ? Number(user.id) : undefined,
  });

  const organizations = data?.organizations;

  if (!isLoading) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log({ user, organizations }, 'log');
  }

  return (
    <main className='min-h-lvh'>
      {isLoading ? (
        <div>Loading...</div>
      ) : organizations && organizations?.length > 0 ? (
        <>
          <CreateOrganizationButton />
          <Stack>
            {organizations?.map((organization) => (
              <div
                className='bg-neutral-200 flex justify-around items-center px-8 py-4 rounded-xl text-lg font-bold'
                key={organization.hashid}
              >
                <Link
                  className='flex max-w-[400px] w-full items-center justify-start gap-x-3'
                  href={routes.TEMPLATES(organization.hashid)}
                >
                  <Image
                    className='flex justify-center items-center bg-neutral-300 size-14'
                    component={NextImage}
                    src={organization.image || null}
                    alt='Placeholder'
                    height={150}
                    width={150}
                    fallbackSrc='https://placehold.co/150x150/png?text=Placeholder'
                  />
                  {organization.name}
                </Link>
              </div>
            ))}
          </Stack>
        </>
      ) : (
        <div>
          <CreateOrganizationButton />
          Looks like you don't have any organizations yet
        </div>
      )}
    </main>
  );
}
