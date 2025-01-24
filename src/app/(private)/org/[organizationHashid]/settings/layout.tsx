'use client';
import { Group, Tabs, TabsList, TabsTab } from '@mantine/core';
import { startCase } from 'lodash';
import { usePathname, useRouter } from 'next/navigation';
import { use } from 'react';
import { routes } from '~/utils/routes';

export default function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ organizationHashid: string }>;
}) {
  const { organizationHashid } = use(params);
  const router = useRouter();
  const pathname = usePathname();

  const tabs = [
    { label: 'General', href: routes.SETTINGS(organizationHashid) },
    { label: 'Roles', href: routes.ROLES(organizationHashid) },
    { label: 'Permissions', href: routes.PERMISSIONS(organizationHashid) },
  ];

  const handleChange = (value: string | null) => {
    if (!value) return;
    router.push(value);
  };

  return (
    <section className='grid grid-rows-[auto_1fr] gap-4 h-full'>
      <div>
        <Group>Settings</Group>
        <Tabs
          value={pathname}
          onChange={handleChange}
          classNames={{
            tab: 'data-[active]:border-skyfall-500 rounded-t-md hover:bg-skyfall-50 hover:border-skyfall-500',
          }}
        >
          <TabsList className='mt-4'>
            {tabs.map(({ label, href }) => (
              <TabsTab key={label} value={href}>
                {startCase(label)}
              </TabsTab>
            ))}
          </TabsList>
        </Tabs>
      </div>
      {children}
    </section>
  );
}
