'use client';
import { Group, TextInput } from '@mantine/core';
import { use } from 'react';
import { CreateDomainButton } from '~/app/(private)/_components/organizations/domains/CreateButton';
import { DomainInfiniteList } from '~/app/(private)/_components/organizations/domains/DomainInfiniteList';

export default function Page({
  params,
}: { params: Promise<{ organizationHashid: string }> }) {
  const { organizationHashid } = use(params);

  return (
    <div className='flex justify-center items-start'>
      <div className='grid grid-rows-[auto_auto_1fr] grid-cols-1 gap-4 h-[calc(100vh-16px)] max-w-5xl w-full 2xl:max-w-7xl'>
        <Group className='justify-between'>
          <h4 className='text-2xl font-bold w-min'>Domains</h4>
          <Group className='justify-end items-start'>
            <CreateDomainButton organizationHashid={organizationHashid} />
          </Group>
        </Group>
        <Group className='items-end'>
          <TextInput label='Search' placeholder='Search' />
        </Group>
        <div className='h-full overflow-auto'>
          <DomainInfiniteList organizationHashid={organizationHashid} />
        </div>
      </div>
    </div>
  );
}
