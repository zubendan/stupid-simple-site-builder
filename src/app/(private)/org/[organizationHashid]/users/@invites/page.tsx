'use client';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Center, Group, Loader, Stack } from '@mantine/core';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useQueryStates } from 'nuqs';
import { use } from 'react';
import { useInView } from 'react-intersection-observer';
import { InfiniteList } from '~/app/(private)/_components/InfiniteList';
import { api } from '~/trpc/react';
import { searchParams } from '~/utils/searchParams';
dayjs.extend(relativeTime);

export default function Page({
  params,
}: { params: Promise<{ organizationHashid: string }> }) {
  const [{ page, perPage }] = useQueryStates(searchParams);
  const { organizationHashid } = use(params);

  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    api.organization.invite.infiniteList.useInfiniteQuery(
      {
        limit: 5,
        organizationHashid,
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
  const invites = data?.pages.flatMap((page) => page.invites) ?? [];
  return (
    <section className='grid grid-cols-[33%_1fr]'>
      <div>
        <h4 className='font-bold py-3'>Pending Invites</h4>
        <p className='text-sm text-neutral-700 pb-4'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto et
          architecto minima ipsam consequatur enim sed veniam odit maxime
          nesciunt explicabo itaque quam ullam, vitae sapiente iste
          consequuntur? Iste, pariatur.
        </p>
      </div>
      <div className='bg-neutral-200 rounded-md p-2 h-full overflow-auto'>
        <InfiniteList
          isLoading={isLoading}
          data={invites?.map((invite) => {
            return (
              <Group key={invite.token} className='flex-nowrap'>
                {/* <ListActionsButton>
                <ActionMenuItem
                  onClick={() => openEditModal(user.hashid)}
                  icon={IconPencil}
                  text="Edit"
                />
                <DeleteUserButton hashid={user.hashid} revalidate={refetch} />
              </ListActionsButton> */}
                <Icon
                  icon='tabler:clock'
                  className='size-10 bg-neutral-500 rounded-full text-white p-1'
                />
                <Stack className='gap-y-1'>
                  <p className='font-semibold'>{invite.email}</p>
                  <p className='text-xs font-medium text-neutral-700'>
                    Expires {dayjs(invite.expiresAt).fromNow()}
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
                No pending invites
              </p>
            </Center>
          }
        />
      </div>
    </section>
  );
}
