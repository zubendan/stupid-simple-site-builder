'use client';
import { Center } from '@mantine/core';
import { useQueryStates } from 'nuqs';
import { use } from 'react';
import { searchParams } from '~/utils/searchParams';

export default function Page({
  params,
}: { params: Promise<{ organizationHashid: string }> }) {
  const [{ page, perPage, search }, setParams] = useQueryStates(searchParams);
  const { organizationHashid } = use(params);

  return <Center className='h-full'>Nothing here yet</Center>;
}
