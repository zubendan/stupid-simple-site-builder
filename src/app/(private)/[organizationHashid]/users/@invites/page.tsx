'use client';
import { Avatar, Badge, Group, Image, Stack } from '@mantine/core';
import { capitalize } from 'lodash';
import NextImage from 'next/image';
import { useQueryStates } from 'nuqs';
import { use } from 'react';
import { ListTable } from '~/app/(private)/_components/ListTable';
import { ListPagination } from '~/app/(private)/_components/Pagination';
import { InviteButton } from '~/app/(private)/_components/users/InviteButton';
import { api } from '~/trpc/react';
import { searchParams } from '~/utils/searchParams';

export default function Page({
  params,
}: { params: Promise<{ organizationHashid: string }> }) {
  const [{ page, perPage, search }, setParams] = useQueryStates(searchParams);
  const { organizationHashid } = use(params);

  const { data, isLoading } = api.invite.list.useQuery({
    page,
    perPage,
    search,
    organizationHashid,
  });
  const organizationUsers = data?.organizationUsers;
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
      <div>
        <div className='bg-neutral-200 rounded-md p-2 h-[calc(100%-106px)]'>
          <ListTable
            className=''
            rowClassName='bg-inherit [&>td]:bg-inherit'
            name='Users'
            isLoading={isLoading}
            data={{
              body: organizationUsers?.map((user) => [
                <Group key={user.hashid} className='flex-nowrap'>
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
                </Group>,
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
                </Group>,
              ]),
            }}
          />
        </div>
        <ListPagination totalPages={data?.pageCount} />
      </div>
    </section>
  );
}
