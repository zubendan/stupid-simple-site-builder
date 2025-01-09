'use client';
import { Loader, Table, type TableProps } from '@mantine/core';
import cn from 'classnames';

import {
  type IListPaginationProps,
  ListPagination,
} from '~/app/(private)/_components/Pagination';

interface IPaginatedListTable
  extends Omit<TableProps, 'onChange'>,
    IListPaginationProps {
  isLoading?: boolean;
  name?: string;
  className?: string;
}

export const PaginatedListTable = ({
  data,
  isLoading,
  totalPages,
  name,
  className,
}: IPaginatedListTable) => {
  return (
    <>
      {!isLoading ? (
        data?.body && data.body.length > 0 ? (
          <div className={cn(className, 'overflow-x-auto')}>
            <Table
              className='whitespace-nowrap'
              classNames={{
                thead: 'sticky top-0 bg-inherit z-10',
                tr: 'even:bg-theme-body',
                th: 'first-of-type:sticky first-of-type:left-[0px] bg-theme-body',
                td: 'first-of-type:sticky first-of-type:left-[0px] bg-inherit',
              }}
              striped
              highlightOnHover
              data={data}
            />
          </div>
        ) : (
          <p className='text-center text-3xl font-semibold'>
            No {name ?? 'data'} found
          </p>
        )
      ) : (
        <Loader className={className} />
      )}
      <ListPagination totalPages={totalPages} />
    </>
  );
};
