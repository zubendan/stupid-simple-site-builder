import { unstable_noStore as noStore } from 'next/cache';

import { redirect } from 'next/navigation';
import { DashboardStoreProvider } from '~/components/private/store/provider';
import { auth } from '~/server/auth';
import { routes } from '~/utils/routes';

export default async function Layout({
  children,
}: { children: React.ReactNode }) {
  noStore();
  const session = await auth();

  if (!session) {
    redirect(routes.SIGN_IN);
  }

  const user = session?.user;

  return (
    <DashboardStoreProvider initState={{ user }}>
      {children}
    </DashboardStoreProvider>
  );
}
