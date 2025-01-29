'use client';
import { Badge, Group } from '@mantine/core';
import dayjs from 'dayjs';
import { useQueryStates } from 'nuqs';
import { use } from 'react';
import { CreateOrganizationRoleButton } from '~/app/(private)/_components/organizations/roles/CreateButton';
import { PaginatedListTable } from '~/app/(private)/_components/PaginatedListTable';
import { api } from '~/trpc/react';
import { DATE_TIME_FORMAT } from '~/utils/date';
import { searchParams } from '~/utils/searchParams';

export default function Page({
  params,
}: { params: Promise<{ organizationHashid: string }> }) {
  const [{ page, perPage, search }, setParams] = useQueryStates(searchParams);
  const { organizationHashid } = use(params);

  const { data, isLoading } = api.organizationRole.list.useQuery({
    page,
    perPage,
    search,
    organizationHashid,
  });

  const roles = data?.organizationUserRoles;

  return (
    <section className='grid grid-rows-[auto_1fr]'>
      <Group className='justify-end'>
        <CreateOrganizationRoleButton organizationHashid={organizationHashid} />
      </Group>
      <div className='grid grid-rows-[1fr_auto]'>
        <PaginatedListTable
          className='my-4'
          name='Agencies'
          totalPages={data?.pageCount}
          isLoading={isLoading}
          data={{
            head: ['Role', 'Description', 'Created'],
            body: roles?.map((role) => [
              <Group key={role.hashid} className='flex-nowrap'>
                {/* <ListActionsButton>
                  <ActionMenuItem
                    onClick={() => openEditModal(role.hashid)}
                    icon={IconPencil}
                    text='Edit'
                  />
                  <DeleteRoleButton
                    hashid={agency.hashid}
                    revalidate={refetch}
                  />
                </ListActionsButton> */}
                <Badge color={role.color}>{role.name}</Badge>
              </Group>,
              role.description,
              dayjs(role.createdAt).format(DATE_TIME_FORMAT),
            ]),
          }}
        />
      </div>
    </section>
  );
}
