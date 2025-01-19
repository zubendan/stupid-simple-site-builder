'use client';
import { Center, Loader, Table, type TableProps } from '@mantine/core';
import cn from 'classnames';

interface IListTable extends Omit<TableProps, 'onChange'> {
  isLoading?: boolean;
  name?: string;
  className?: string;
  rowClassName?: string;
}

export const ListTable = ({
  data,
  isLoading,
  name,
  className,
  rowClassName,
}: IListTable) => {
  return !isLoading ? (
    data?.body && data.body.length > 0 ? (
      <div className={cn(className, 'overflow-x-auto')}>
        <Table
          className='whitespace-nowrap'
          classNames={{
            thead: 'sticky top-0 bg-inherit z-10',
            tr: cn(rowClassName, `even:bg-theme-body`),
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
    <Center>
      <Loader type='dots' className={className} />
    </Center>
  );
};
