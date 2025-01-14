'use client';
import { useQueryStates } from 'nuqs';
import { use } from 'react';
import { api } from '~/trpc/react';
import { searchParams } from '~/utils/searchParams';
import { InviteButton } from '../../_components/organizations/InviteButton';
import { PaginatedListTable } from '../../_components/PaginatedListTable';
import { Badge, Group } from '@mantine/core';
import { capitalize } from 'lodash';
import dayjs from 'dayjs';

export default function Page({
  params,
}: { params: Promise<{ organizationHashid: string }> }) {
  const [{ page, perPage, search }, setParams] = useQueryStates(searchParams);
  const { organizationHashid } = use(params);

  const { data, isLoading } = api.organizationUser.list.useQuery({
    page,
    perPage,
    search,
    organizationHashid,
  });

  const organizationUsers = data?.organizationUsers;

  return (
    <div>
      <Group className='justify-end'>
        <InviteButton organizationHashid={organizationHashid} />
      </Group>
      <PaginatedListTable
        className='my-4 min-h-[calc(100vh-180px)]'
        name='Users'
        totalPages={data?.pageCount}
        isLoading={isLoading}
        data={{
          head: ['User', 'Roles', 'Email', 'Created At', 'Updated At'],
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
              {user.firstName} {user.lastName}
            </Group>,
            user.organizationRoles?.map((item, indez) => (
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
            )),
            user.email,
            dayjs(user.createdAt).format('YYYY-MM-DD'),
            dayjs(user.updatedAt).format('YYYY-MM-DD'),
          ]),
        }}
      />
    </div>
  );
}
