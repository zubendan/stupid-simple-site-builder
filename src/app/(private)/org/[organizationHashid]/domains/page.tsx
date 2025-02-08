'use client';
import { Group, TextInput } from '@mantine/core';
import { use } from 'react';
import { DomainInfiniteList } from '~/app/(private)/_components/organizations/domains/DomainInfiniteList';

export default function Page({
  params,
}: { params: Promise<{ organizationHashid: string }> }) {
  const { organizationHashid } = use(params);

  return (
    <div className='grid grid-rows-[100px_1fr] grid-cols-1 gap-4'>
      <Group className='items-end'>
        <TextInput label='Search' placeholder='Search' />
      </Group>
      <div className=''>
        {/* <HydrateClient> */}
        <DomainInfiniteList organizationHashid={organizationHashid} />
        {/* </HydrateClient> */}
      </div>
    </div>
  );
}
