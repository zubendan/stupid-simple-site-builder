import { Icon } from '@iconify/react/dist/iconify.js';
import { Center, Group, Loader, Stack } from '@mantine/core';
import Link from 'next/link';
import { useInView } from 'react-intersection-observer';
import { api } from '~/trpc/react';
import { routes } from '~/utils/routes';
import { InfiniteList } from '../../InfiniteList';
import { ListActionsButton } from '../../ListActions';
import { DeleteDomainButton } from './DeleteButton';

export const DomainInfiniteList = ({
  organizationHashid,
}: { organizationHashid: string }) => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    api.domain.infiniteList.useInfiniteQuery(
      {
        organizationHashid,
        limit: 25,
        search: '',
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );
  const { ref } = useInView({
    onChange(inView) {
      if (inView) {
        fetchNextPage();
      }
    },
  });

  const domains = data?.pages.flatMap((page) => page.domains) ?? [];

  return (
    <InfiniteList
      isLoading={isLoading}
      data={domains?.map((domain) => {
        return (
          <Group
            key={domain.hashid}
            className='flex-nowrap border-solid border-b-2 border-neutral-200 p-2 gap-x-2'
          >
            <ListActionsButton>
              <DeleteDomainButton hashid={domain.hashid} />
            </ListActionsButton>
            <Icon
              icon='tabler:world'
              className={`size-8 rounded-md text-white p-1 ${
                domain.isVerified ? 'bg-green-400' : 'bg-red-400'
              }`}
            />
            <Stack className='gap-y-1'>
              <Link
                className='font-semibold border-b border-dashed border-b-neutral-600 cursor-pointer'
                href={routes.DOMAIN(organizationHashid, domain.hashid)}
              >
                {domain.domain}
              </Link>
              <p className='text-xs font-medium text-neutral-700'>
                {domain.isVerified ? 'Verified' : 'Unverified'}
              </p>
            </Stack>
          </Group>
        );
      })}
      scrollLoaderComponent={
        hasNextPage ? (
          <div
            ref={ref}
            className={`flex justify-center items-center h-14 rounded-md ${isFetchingNextPage ? 'bg-neutral-300' : ''}`}
          >
            {isFetchingNextPage && <Loader type='dots' />}
          </div>
        ) : null
      }
      nothingFound={
        <Center className='h-full'>
          <p className='text-center text-3xl font-semibold'>
            No pending domains
          </p>
        </Center>
      }
    />
  );
};
