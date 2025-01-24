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
    <section>
      <Group>Settings</Group>
      <Tabs
        className='w-auto grid-cols-[1fr] grid-rows-[auto_1fr]'
        value={pathname}
        onChange={handleChange}
        classNames={{
          tab: 'data-[active]:border-neutral-950 dark:data-[active]:border-neutral-300 rounded-t-lg',
        }}
      >
        <div>
          <TabsList className='mt-4 pl-[--mantine-spacing-xl]'>
            {tabs.map(({ label, href }) => (
              <TabsTab key={label} value={href}>
                {startCase(label)}
              </TabsTab>
            ))}
          </TabsList>
        </div>
      </Tabs>
      {children}
    </section>
  );
}
