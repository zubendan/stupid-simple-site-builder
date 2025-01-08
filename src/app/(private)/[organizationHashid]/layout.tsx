'use client';
import cn from 'classnames';
import { use } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { SideNav } from '~/components/private/SideNav';
import { useDashboardStore } from '~/components/private/store/provider';

export default function Layout({
  organizations,
  children,
  params,
}: {
  organizations: React.ReactNode;
  children: React.ReactNode;
  params: Promise<{ organizationHashid: string }>;
}) {
  const { organizationHashid } = use(params);
  const { isCollapsed } = useDashboardStore(
    useShallow((s) => ({
      isCollapsed: s.isSidebarCollapsed,
    })),
  );

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
        {organizations}
        <SideNav
          organizationHashid={organizationHashid}
          organizationMenu={organizations}
        />
        <section className='bg-blue-500'>{children}</section>
      </div>
    </main>
  );
}
