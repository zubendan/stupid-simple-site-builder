'use client';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Group, Stack } from '@mantine/core';
import dayjs from 'dayjs';
import { useQueryStates } from 'nuqs';
import { use } from 'react';
import { ListTable } from '~/app/(private)/_components/ListTable';
import { ListPagination } from '~/app/(private)/_components/Pagination';
import { api } from '~/trpc/react';
import { searchParams } from '~/utils/searchParams';

export default function Page({
  params,
}: { params: Promise<{ organizationHashid: string }> }) {
  const [{ page, perPage }] = useQueryStates(searchParams);
  const { organizationHashid } = use(params);

  const { data, isLoading } = api.invite.list.useQuery({
    page,
    perPage,
    organizationHashid,
  });
  const invites = data?.invites;
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
            name='Invites'
            isLoading={isLoading}
            data={{
              body: invites?.map((invite) => [
                <Group key={invite.token} className='flex-nowrap'>
                  {/* <ListActionsButton>
                <ActionMenuItem
                  onClick={() => openEditModal(user.hashid)}
                  icon={IconPencil}
                  text="Edit"
                />
                <DeleteUserButton hashid={user.hashid} revalidate={refetch} />
              </ListActionsButton> */}
                  <Icon icon='tabler:clock' className='size-9' />
                  <Stack className='gap-y-1'>
                    <p className='font-semibold'>{invite.email}</p>
                    <p className='text-xs font-medium text-neutral-700'>
                      {dayjs(invite.expiresAt).diff(dayjs(), 'days')}
                    </p>
                  </Stack>
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
