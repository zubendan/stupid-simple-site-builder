/* eslint-disable @typescript-eslint/no-shadow */
import {
  ActionIcon,
  Group,
  Menu,
  MenuDropdown,
  MenuItem,
  type MenuItemProps,
  MenuTarget,
} from '@mantine/core';
import { Icon, IconProps } from '@iconify/react';
import Link from 'next/link';
import React from 'react';

export const ListActionsButton = ({
  children,
}: { children: React.ReactNode }) => (
  <Menu width={200} position='right' withArrow shadow='md'>
    <MenuTarget>
      <ActionIcon
        variant='transparent'
        className='rounded-md hover:bg-neutral-300 dark:hover:bg-neutral-600'
      >
        <Icon
          icon='tabler:dots-vertical'
          className='size-5 text-neutral-950 dark:text-neutral-200'
        />
      </ActionIcon>
    </MenuTarget>
    <MenuDropdown className='p-1'>{children}</MenuDropdown>
  </Menu>
);

export const LinkMenuItem = ({
  href,
  icon = 'tabler:eye',
  className = 'size-5 text-neutral-950 dark:text-neutral-200',
  text = 'View',
  ...restProps
}: MenuItemProps & {
  href: string;
  icon: IconProps['icon'];
  className?: string;
  text?: string;
}) => (
  <MenuItem className='text-base' component={Link} href={href} {...restProps}>
    <Group>
      <Icon icon={icon} className={className} />
      {text}
    </Group>
  </MenuItem>
);

export const ActionMenuItem = ({
  onClick,
  icon,
  className = 'size-5 text-neutral-950 dark:text-neutral-200',
  text = 'View',
  disabled,
}: {
  onClick: () => void;
  icon: IconProps['icon'];
  className?: string;
  text?: string;
  disabled?: boolean;
}) => (
  <MenuItem className='text-base' onClick={onClick} disabled={disabled}>
    <Group>
      <Icon icon={icon} className={className} />
      {text}
    </Group>
  </MenuItem>
);
