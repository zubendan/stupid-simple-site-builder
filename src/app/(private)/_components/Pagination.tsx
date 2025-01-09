'use client';
import {
  Group,
  PaginationItems,
  PaginationNext,
  PaginationPrevious,
  PaginationRoot,
  Select,
  Text,
} from '@mantine/core';
import { useQueryStates } from 'nuqs';

import { searchParams } from '~/utils/searchParams';

const PAGINATION_OPTIONS = [
  {
    label: '10',
    value: '10',
  },
  {
    label: '15',
    value: '15',
  },
  {
    label: '25',
    value: '25',
  },
  {
    label: '50',
    value: '50',
  },
  {
    label: '100',
    value: '100',
  },
];

export interface IListPaginationProps {
  totalPages?: number;
}

export const ListPagination = ({ totalPages = 0 }: IListPaginationProps) => {
  const [{ page, perPage }, setParams] = useQueryStates(searchParams, {
    history: 'push',
    shallow: false,
  });

  const isExistingOption =
    PAGINATION_OPTIONS.findIndex(
      (option) => option.value === String(perPage),
    ) !== -1;
  const optionToAdd = !isExistingOption
    ? [{ label: String(perPage), value: String(perPage) }]
    : [];

  const handlePerPageChange = (value: string | null) =>
    setParams({ page: 1, perPage: Number(value) ?? 25 });

  return (
    <PaginationRoot
      value={page}
      total={totalPages}
      onChange={(page) => setParams({ page })}
    >
      <div className='my-8 flex flex-col items-center gap-4 md:flex md:flex-row md:justify-between'>
        <Group gap={4}>
          <PaginationPrevious />
          <PaginationItems />
          <PaginationNext />
        </Group>
        <Group gap='sm'>
          <Text size='sm' className='hidden md:block'>
            Display
          </Text>
          <Select
            className='relative max-w-[85px]'
            classNames={{
              label: 'absolute bottom-full',
            }}
            value={String(perPage)}
            allowDeselect={false}
            onChange={handlePerPageChange}
            data={[...PAGINATION_OPTIONS, ...optionToAdd].sort(
              (a, b) => +a.value - +b.value,
            )}
          />
          <Text size='sm'>items per page</Text>
        </Group>
      </div>
    </PaginationRoot>
  );
};
