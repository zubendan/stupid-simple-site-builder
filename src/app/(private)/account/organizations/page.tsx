'use client';
import { useShallow } from 'zustand/react/shallow';
import { useDashboardStore } from '~/components/private/store/provider';
import { api } from '~/trpc/react';

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

  if (!isLoading) {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log({ user, organizations }, 'log');
  }

  return (
    <main className='min-h-lvh'>
      {isLoading ? (
        <div>Loading...</div>
      ) : organizations && organizations?.length > 0 ? (
        <>
          {organizations?.map((organization) => (
            <div key={organization.id}>{organization.name}</div>
          ))}
        </>
      ) : (
        <div>Looks like you don't have any organizations yet</div>
      )}
    </main>
  );
}
