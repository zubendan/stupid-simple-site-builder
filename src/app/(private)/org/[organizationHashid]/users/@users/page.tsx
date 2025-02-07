'use client';
import {
  Avatar,
  Badge,
  Center,
  Group,
  Image,
  Loader,
  Stack,
} from '@mantine/core';
import { capitalize } from 'lodash';
import NextImage from 'next/image';
import { useQueryStates } from 'nuqs';
import { use } from 'react';
import { useInView } from 'react-intersection-observer';
import { InfiniteList } from '~/app/(private)/_components/InfiniteList';
import { InviteButton } from '~/app/(private)/_components/users/InviteButton';
import { api } from '~/trpc/react';
import { searchParams } from '~/utils/searchParams';

export default function Page({
  params,
}: { params: Promise<{ organizationHashid: string }> }) {
  const [{ search }] = useQueryStates(searchParams);
  const { organizationHashid } = use(params);
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    api.organization.user.infiniteList.useInfiniteQuery(
      {
        limit: 5,
        organizationHashid,
        search,
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
  const organizationUsers =
    data?.pages.flatMap((page) => page.organizationUsers) ?? [];
  return (
    <section className='grid grid-cols-[33%_1fr]'>
      <div>
        <h4 className='font-bold py-3'>Users</h4>
        <p className='text-sm text-neutral-700 pb-4'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto et
          architecto minima ipsam consequatur enim sed veniam odit maxime
          nesciunt explicabo itaque quam ullam, vitae sapiente iste
          consequuntur? Iste, pariatur.
        </p>
        <InviteButton organizationHashid={organizationHashid} />
      </div>
      <div className='bg-neutral-200 rounded-md p-2 h-full overflow-auto'>
        <InfiniteList
          isLoading={isLoading}
          data={organizationUsers.map((user) => {
            return (
              <Group key={user.hashid} className='justify-between py-1 px-4'>
                <Group className='flex-nowrap'>
                  {/* <ListActionsButton>
                <ActionMenuItem
                  onClick={() => openEditModal(user.hashid)}
                  icon={IconPencil}
                  text="Edit"
                />
                <DeleteUserButton hashid={user.hashid} revalidate={refetch} />
              </ListActionsButton> */}
                  {user.image ? (
                    <Image
                      component={NextImage}
                      className='rounded-full size-10 text-xs bg-neutral-500 text-transparent'
                      src={user.image}
                      alt='Profile Pic'
                      width={40}
                      height={40}
                    />
                  ) : (
                    <Avatar />
                  )}
                  <Stack className='gap-y-1'>
                    <p className='font-semibold'>
                      {user.firstName} {user.lastName}
                    </p>
                    <p className='text-xs font-medium text-neutral-700'>
                      {user.email}
                    </p>
                  </Stack>
                </Group>
                <Group>
                  {user.organizationRoles?.map((item, indez) => (
                    <Badge
                      size='md'
                      p='sm'
                      // color={getRoleColor(item.name as RoleType)}
                      key={item.hashid}
                      ml={indez > 0 ? 'xs' : 0}
                      variant='outline'
                    >
                      {capitalize(item.name)}
                    </Badge>
                  ))}
                </Group>
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
              <p className='text-center text-3xl font-semibold'>No users</p>
            </Center>
          }
        />
      </div>
    </section>
  );
}
