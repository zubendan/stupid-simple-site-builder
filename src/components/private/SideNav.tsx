import { IconProps, Icon } from '@iconify/react/dist/iconify.js';
import { Group, Tooltip, UnstyledButton } from '@mantine/core';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import React, { useState } from 'react';
import { routes } from '~/utils/routes';
import cn from 'classnames';

type TLinkItem = {
  icon: IconProps['icon'];
  label: string;
  href: string;
  can: () => boolean | undefined;
};

interface NavLinkProps extends Omit<TLinkItem, 'can'> {
  active: boolean;
  onClick: () => void;
  isCollapsed: boolean;
}

function NavLink({
  icon,
  label,
  active,
  onClick,
  href,
  isCollapsed,
}: NavLinkProps) {
  return (
    <Tooltip
      label={label}
      position='right'
      className='rounded-md bg-neutral-950 p-2 px-3 font-bold text-white'
      offset={12}
      disabled={!isCollapsed}
    >
      <UnstyledButton
        component={Link}
        href={href}
        onClick={onClick}
        className={cn(
          'flex w-full text-sm font-bold transition-colors duration-200 hover:bg-neutral-900',
          {
            'rounded-md p-3': isCollapsed,
            'rounded-l-md px-4 py-3': !isCollapsed,
            'bg-[--mantine-primary-color-7] bg-gradient-to-r from-[--mantine-primary-color-7] to-[--mantine-primary-color-9] text-white':
              active,
            'text-neutral-500 hover:text-white': !active,
          },
        )}
      >
        <Group className='flex-nowrap whitespace-nowrap'>
          <Icon icon={icon} className='text-xl' />
          {!isCollapsed && <span>{label}</span>}
        </Group>
      </UnstyledButton>
    </Tooltip>
  );
}

export const SideNav = ({
  organizationHashid,
}: { organizationHashid: string }) => {
  const pathname = usePathname();
  const path = pathname.split('/');
  const page = path[1];
  const linkData: TLinkItem[] = [
    {
      icon: 'tabler:template',
      label: 'Templates',
      href: routes.TEMPLATES(organizationHashid),
      can: () => true,
    },
    {
      icon: 'tabler:components',
      label: 'Components',
      href: routes.COMPONENTS(organizationHashid),
      can: () => true,
    },
    {
      icon: 'tabler:world',
      label: 'Domains',
      href: routes.DOMAINS(organizationHashid),
      can: () => true,
    },
    {
      icon: 'tabler:users',
      label: 'Users',
      href: routes.USERS(organizationHashid),
      can: () => true,
    },
  ];

  const headPath = `/${page}`;
  const [active, setActive] = useState(headPath);

  return (
    <nav className='w-full h-lvh py-6 px-3 flex flex-col justify-start items-center'>
      {linkData.map((link, index) => (
        <NavLink
          key={index}
          icon={link.icon}
          label={link.label}
          href={link.href}
          active={active === link.href}
          onClick={() => setActive(link.href)}
          isCollapsed={false}
        />
      ))}
    </nav>
  );
};
