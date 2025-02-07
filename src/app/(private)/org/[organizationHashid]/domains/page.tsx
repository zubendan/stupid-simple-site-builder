import { Group } from '@mantine/core';
import { api } from '~/trpc/server';

export default async function Page({
  params,
}: { params: Promise<{ organizationHashid: string }> }) {
  const { organizationHashid } = await params;
  const { domains } = await api.domain.infiniteList({
    limit: 25,
    organizationHashid,
    search: '',
  });

  return (
    <div className='grid grid-rows-[100px_1fr] grid-cols-1'>
      <Group className='bg-blue-500 items-end'>
        <h1>Domains</h1>
      </Group>
      <div className='bg-red-500'>
        {domains.map((domain) => (
          <div
            key={domain.hashid}
            className='text-black p-5 bg-neutral-200 rounded-md'
          >
            {domain.domain}
          </div>
        ))}
      </div>
    </div>
  );
}
