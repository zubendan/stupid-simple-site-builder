'use client';
import { Badge, Group } from '@mantine/core';
import dayjs from 'dayjs';
import { capitalize } from 'lodash';
import { useQueryStates } from 'nuqs';
import { use } from 'react';
import { PaginatedListTable } from '~/app/(private)/_components/PaginatedListTable';
import { api } from '~/trpc/react';
import { searchParams } from '~/utils/searchParams';

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
    <section className='grid grid-rows-[100%] grid-cols-[33%_1fr]'>
      <div>
        <h4>Pending Invites</h4>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Iusto et
          architecto minima ipsam consequatur enim sed veniam odit maxime
          nesciunt explicabo itaque quam ullam, vitae sapiente iste
          consequuntur? Iste, pariatur.
        </p>
      </div>
      <div className=''>
        <PaginatedListTable
          className='my-4'
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
    </section>
  );
}
