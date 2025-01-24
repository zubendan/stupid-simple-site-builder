'use client';
import { Button, Group } from '@mantine/core';
import { useQueryStates } from 'nuqs';
import { use } from 'react';
import { api } from '~/trpc/react';
import { searchParams } from '~/utils/searchParams';

export default function Page({
  params,
}: { params: Promise<{ organizationHashid: string }> }) {
  const [{ page, perPage, search }, setParams] = useQueryStates(searchParams);
  const { organizationHashid } = use(params);

  const { data, isLoading } = api.organizationUserRole.list.useQuery({
    page,
    perPage,
    search,
    organizationHashid,
  });

  return (
    <div>
      <Group className='justify-end'>
        <Button>Button</Button>
      </Group>
    </div>
  );
}
