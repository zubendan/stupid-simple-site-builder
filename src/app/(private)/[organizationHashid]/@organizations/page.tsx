'use client';

import { Icon } from '@iconify/react/dist/iconify.js';
import { LoadingOverlay, UnstyledButton, Image } from '@mantine/core';
import { useShallow } from 'zustand/react/shallow';
import { useDashboardStore } from '~/components/private/store/provider';
import { api } from '~/trpc/react';

export default function Page() {
  const { user } = useDashboardStore(
    useShallow((s) => ({
      user: s.user,
    })),
  );
  const { data, isLoading } = api.organization.list.useQuery({
    page: 1,
    perPage: 50,
    search: '',
    userId: user?.id ? Number(user.id) : undefined,
  });

  const organizations = data?.organizations;

  return (
    <div className='relative'>
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
      />
      <UnstyledButton className='grid grid-cols-[auto_1fr] gap-3 px-5 py-3 rounded-md'>
        <Icon icon='tabler:plus' className='size-5 text-xl' />
        <span>Add an Organization</span>
      </UnstyledButton>
      {organizations?.map((org) => {
        return (
          <UnstyledButton className='grid grid-cols-[auto_1fr] gap-3 px-5 py-3 rounded-md'>
            <Image
              className='rounded-full size-9 text-xs bg-neutral-500 text-transparent'
              src={user?.image}
              alt='Profile Pic'
              width={36}
              height={36}
            />
            <span>Add an Organization</span>
          </UnstyledButton>
        );
      })}
    </div>
  );
}
