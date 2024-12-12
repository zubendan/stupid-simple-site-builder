import { SideNav } from '~/components/private/SideNav';
import cn from 'classnames';

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ organizationHashid: string }>;
}) {
  const { organizationHashid } = await params;
  const isCollapsed = false;

  return (
    <main className='grid grid-cols-[100%] grid-rows-[auto_1fr]'>
      <div className='bg-red-500 h-0 flex justify-center items-center'>
        <span className='text-xs text-white font-bold'>
          impersonation Banner
        </span>
      </div>
      <div
        className={cn(
          `grid grid-cols-[100%] grid-rows-[100%] transition-[grid-template-columns] sm:grid-cols-[220px_1fr]`,
          {
            'sm:grid-cols-[60px_1fr]': isCollapsed,
          },
        )}
      >
        <SideNav organizationHashid={organizationHashid} />
        <section className='bg-blue-500'>{children}</section>
      </div>
    </main>
  );
}
