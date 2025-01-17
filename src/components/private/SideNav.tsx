'use client';

import { Icon, IconProps } from '@iconify/react/dist/iconify.js';
import {
  Button,
  Group,
  Menu,
  MenuTarget,
  ScrollArea,
  Tooltip,
  UnstyledButton,
  Image,
  Divider,
  Avatar,
  MenuDropdown,
  MenuLabel,
  MenuItem,
  MenuDivider,
} from '@mantine/core';
import cn from 'classnames';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { routes } from '~/utils/routes';
import { useDashboardStore } from './store/provider';
import { useShallow } from 'zustand/react/shallow';
import { signOut } from 'next-auth/react';
import { api } from '~/trpc/react';
import { OrganizationNavList } from '~/app/(private)/_components/organizations/NavList';

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
          'flex w-full text-sm font-bold transition-colors duration-200 hover:bg-neutral-200',
          {
            'rounded-md p-3': isCollapsed,
            'rounded-l-md px-4 py-3': !isCollapsed,
            'bg-[--mantine-primary-color-7] bg-gradient-to-r from-[--mantine-primary-color-7] to-[--mantine-primary-color-9] text-white':
              active,
            'text-neutral-500 hover:text-black': !active,
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

interface ISideBarNavProps {
  organizationHashid: string;
}

export const SideNav = ({ organizationHashid }: ISideBarNavProps) => {
  const { data: org } = api.organization.find.useQuery({
    hashid: organizationHashid,
  });
  const { isCollapsed, toggleCollapse, isImpersonating, user } =
    useDashboardStore(
      useShallow((s) => ({
        isCollapsed: s.isSidebarCollapsed,
        toggleCollapse: s.toggleSidebarCollapsed,
        isImpersonating: s.isImpersonating,
        user: s.user,
      })),
    );
  const pathname = usePathname();
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
    {
      icon: 'tabler:settings-2',
      label: 'Settings',
      href: routes.SETTINGS(organizationHashid),
      can: () => true,
    },
  ];

  const [active, setActive] = useState(pathname);

  return (
    <div
      className={`static bottom-0 left-0 top-0 z-[201] ${isCollapsed ? 'hidden sm:block' : 'block'} h-screen max-h-screen ${isImpersonating ? 'min-h-[calc(100vh-20px)]' : 'min-h-screen'} shadow-xl`}
    >
      <ScrollArea
        h='100vh'
        type='hover'
        scrollbars='y'
        offsetScrollbars={true}
        scrollbarSize={0}
      >
        <nav
          className={` ${isCollapsed ? 'hidden sm:grid' : 'grid'} h-screen max-h-screen grid-rows-[1fr_auto] ${isImpersonating ? 'min-h-[calc(100vh_-_20px)]' : 'min-h-screen'}`}
        >
          <div>
            <div className='grid grid-cols-[auto_1fr] sm:grid-cols-1'>
              <div className='block p-4 pr-0 sm:hidden'>
                <Button
                  className='h-full p-2'
                  variant='subtle'
                  size='xs'
                  onClick={toggleCollapse}
                >
                  <Icon icon='tabler:x' className='text-xl' />
                </Button>
              </div>
              <div
                className={cn('relative min-h-16 flex-none', {
                  'p-5 pl-1 sm:pl-5': !isCollapsed,
                  'px-2 py-5 text-center': isCollapsed,
                })}
              >
                <h1
                  className={cn(
                    'flex h-full items-center text-nowrap font-bold',
                    {
                      'justify-center': isCollapsed,
                    },
                  )}
                >
                  <span
                    className={`text-center ${isCollapsed ? '' : 'w-full'}`}
                  >
                    VERSA
                  </span>
                </h1>
              </div>
            </div>
            <div
              className={`w-full overflow-y-auto ${isCollapsed ? 'px-2' : 'pl-2'}`}
            >
              {linkData.map((link, index) => {
                return (
                  <NavLink
                    key={index}
                    icon={link.icon}
                    label={link.label}
                    href={link.href}
                    active={active === link.href}
                    onClick={() => setActive(link.href)}
                    isCollapsed={isCollapsed}
                  />
                );
              })}
            </div>
          </div>
          <Divider className='my-2 border-neutral-500' />
          {user && (
            <div className={`mb-2 grid w-full ${isCollapsed ? 'p-2' : 'px-2'}`}>
              <Menu
                width={260}
                position='top-start'
                transitionProps={{
                  transition: 'pop-bottom-left',
                  duration: 200,
                }}
                withinPortal
                closeOnItemClick={false}
              >
                <MenuTarget>
                  <UnstyledButton
                    className={cn(
                      'grid w-full items-center gap-3 font-bold transition-colors duration-200 hover:bg-neutral-200 rounded-md',
                      {
                        'grid-cols-[auto_1fr] px-5 py-3': !isCollapsed,
                        'grid-cols-1 justify-items-center p-2': isCollapsed,
                      },
                    )}
                  >
                    {org?.image ? (
                      <Image
                        className='rounded-lg size-7 text-xs bg-neutral-500 text-transparent'
                        src={org?.image}
                        alt='Profile Pic'
                        width={28}
                        height={28}
                      />
                    ) : (
                      <Avatar>
                        <Icon icon='tabler:box' className='size-5 text-xl' />
                      </Avatar>
                    )}
                    {!isCollapsed && (
                      <div className='flex w-full items-center justify-between gap-1 pr-2'>
                        <p className='m-0 line-clamp-1 break-all text-sm'>
                          {org?.name}
                        </p>
                      </div>
                    )}
                  </UnstyledButton>
                </MenuTarget>
                <MenuDropdown classNames={{ dropdown: 'rounded-lg' }}>
                  <div>
                    <OrganizationNavList user={user} />
                  </div>
                </MenuDropdown>
              </Menu>
              <Menu
                width={260}
                position='top-start'
                transitionProps={{
                  transition: 'pop-bottom-left',
                  duration: 200,
                }}
                withinPortal
                closeOnItemClick={false}
              >
                <MenuTarget>
                  <UnstyledButton
                    className={cn(
                      'grid w-full items-center gap-3 font-bold transition-colors duration-200 hover:bg-neutral-200 rounded-md',
                      {
                        'grid-cols-[auto_1fr] px-5 py-3': !isCollapsed,
                        'grid-cols-1 justify-items-center p-2': isCollapsed,
                      },
                    )}
                  >
                    {user?.image ? (
                      <Image
                        className='rounded-full size-7 text-xs bg-neutral-500 text-transparent'
                        src={user?.image}
                        alt='Profile Pic'
                        width={28}
                        height={28}
                      />
                    ) : (
                      <Avatar />
                    )}
                    {!isCollapsed && (
                      <div className='flex w-full items-center justify-between gap-1 pr-2'>
                        <p className='m-0 line-clamp-1 break-all text-sm'>
                          {user.firstName + ' ' + user.lastName}
                        </p>
                      </div>
                    )}
                  </UnstyledButton>
                </MenuTarget>
                <MenuDropdown classNames={{ dropdown: 'rounded-lg' }}>
                  {/* <ColorSchemeToggle /> */}
                  <MenuLabel>Settings</MenuLabel>
                  <MenuItem
                    leftSection={
                      <Icon icon='tabler:settings' fontSize='1rem' />
                    }
                    component={Link}
                    href={routes.ACCOUNT}
                  >
                    Account settings
                  </MenuItem>
                  <MenuDivider />
                  <MenuItem
                    leftSection={<Icon icon='tabler:logout' fontSize='1rem' />}
                    component='button'
                    onClick={() => signOut({ callbackUrl: routes.HOME })}
                  >
                    Sign Out
                  </MenuItem>
                </MenuDropdown>
              </Menu>
              <div className='hidden sm:block'>
                <Tooltip
                  label='Expand Navigation'
                  position='right'
                  className='rounded-md bg-neutral-950 p-2 px-3 font-bold text-white'
                  offset={12}
                  disabled={!isCollapsed}
                >
                  <UnstyledButton
                    onClick={toggleCollapse}
                    className={cn(
                      'flex w-full items-center rounded-md text-sm font-bold transition-colors duration-200 hover:bg-neutral-200',
                      {
                        'p-3': isCollapsed,
                        'px-6 py-3': !isCollapsed,
                      },
                    )}
                  >
                    <Group className='flex-nowrap whitespace-nowrap'>
                      <Icon
                        icon='tabler:chevron-left'
                        className={cn('text-xl', {
                          'rotate-180': isCollapsed,
                        })}
                      />
                      {!isCollapsed && <span>Collapse</span>}
                    </Group>
                  </UnstyledButton>
                </Tooltip>
              </div>
            </div>
          )}
        </nav>
      </ScrollArea>
    </div>
  );
};
