import { unstable_noStore as noStore } from 'next/cache';
import cn from 'classnames';

import { auth } from '~/server/auth';
import { redirect } from 'next/navigation';
import { routes } from '~/utils/routes';

export default async function Layout({
  children,
}: { children: React.ReactNode }) {
  noStore();
  const session = await auth();

  if (!session) {
    redirect(routes.SIGN_IN);
  }

  const isCollapsed = false;

  return (
    <main className='grid grid-cols-[100%] grid-rows-[auto_1fr]'>
      <div className='bg-red-500 h-2'>impersonation Banner</div>
      <div
        className={cn(
          `grid grid-cols-[100%] grid-rows-[100%] transition-[grid-template-columns] sm:grid-cols-[220px_1fr]`,
          {
            'sm:grid-cols-[60px_1fr]': isCollapsed,
          },
        )}
      >
        <div className='bg-orange-500'>sidenav</div>
        <section className='bg-blue-500'>body</section>
      </div>
      {children}
    </main>
  );
}
