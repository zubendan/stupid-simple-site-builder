'use client';

import { Icon } from '@iconify/react/dist/iconify.js';
import { Image, LoadingOverlay, MenuItem } from '@mantine/core';
import { modals } from '@mantine/modals';
import { type User } from 'next-auth';
import Link from 'next/link';
import { api } from '~/trpc/react';
import { routes } from '~/utils/routes';
import { OrganizationUpdateCreateForm } from './CreateForm';

export function OrganizationNavList({ user }: { user: User }) {
  const { data, isLoading } = api.organization.list.useQuery({
    page: 1,
    perPage: 50,
    search: '',
    userId: user.id ? Number(user.id) : undefined,
  });

  const organizations = data?.organizations;

  const openModal = () =>
    modals.open({
      title: 'Create Organization',
      size: 'lg',
      children: <OrganizationUpdateCreateForm />,
    });

  return (
    <div className='relative'>
      <LoadingOverlay
        visible={isLoading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ type: 'dots' }}
      />

      <MenuItem
        className='gap-3 px-5 py-3 rounded-md font-semibold items-center hover:bg-neutral-200 transition-colors text-md'
        leftSection={
          <div className='p-[0.375rem]'>
            <Icon icon='tabler:plus' className='size-6 text-2xl' />
          </div>
        }
        onClick={openModal}
      >
        <span>Add an Organization</span>
      </MenuItem>
      {organizations?.map((org) => {
        return (
          <MenuItem
            key={org.hashid}
            className='gap-3 px-5 py-3 rounded-md font-semibold items-center hover:bg-neutral-200 transition-colors text-md'
            href={`${routes.TEMPLATES(org.hashid)}`}
            leftSection={
              <Image
                className='rounded-md size-9 text-xs bg-neutral-500 text-transparent'
                src={org.image}
                alt='Profile Pic'
                width={36}
                height={36}
              />
            }
            component={Link}
          >
            <span>{org.name}</span>
          </MenuItem>
        );
      })}
    </div>
  );
}
