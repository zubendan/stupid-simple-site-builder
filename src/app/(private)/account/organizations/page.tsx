'use client';
import { useDashboardStore } from '~/components/private/store/provider';
import { api } from '~/trpc/react';
import { useShallow } from 'zustand/react/shallow';

export default function Page() {
  const { user } = useDashboardStore(
    useShallow((s) => ({
      user: s.user,
    })),
  );
  const { data, isLoading } = api.organization.list.useQuery({
    page: 1,
    perPage: 10,
    search: '',
    userId: user?.id ? Number(user.id) : undefined,
  });

  const organizations = data?.organizations;

  if (!isLoading && organizations && organizations?.length < 1) {
    // create or join an organization
  }

  if (!isLoading) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log({ user, organizations }, 'log');
  }

  return (
    <main className='min-h-lvh'>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {organizations?.map((organization) => (
            <div key={organization.id}>{organization.name}</div>
          ))}
        </>
      )}
    </main>
  );
}
