'use client';
import { useDashboardStore } from '~/components/private/store/provider';
import { api } from '~/trpc/react';

export default function Page() {
  const { user } = useDashboardStore((s) => ({
    user: s.user,
  }));
  const organizations = api.organization.list.useQuery({
    page: 1,
    perPage: 10,
    search: '',
    userHashid: '',
  });

  // biome-ignore lint/suspicious/noConsole: <explanation>
  console.log({ user });

  return (
    <main className='min-h-lvh'>
      <div></div>
    </main>
  );
}
