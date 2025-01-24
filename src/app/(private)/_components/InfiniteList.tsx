import React from 'react';
import cn from 'classnames';
import { Center, Loader } from '@mantine/core';

export interface IInfiniteListProps {
  data?: React.ReactNode[];
  isLoading?: boolean;
  className?: string;
  nothingFound?: React.ReactNode;
  scrollLoaderComponent?: React.ReactNode;
}

export const InfiniteList = ({
  data,
  isLoading,
  className,
  nothingFound,
  scrollLoaderComponent,
}: IInfiniteListProps) => {
  return !isLoading ? (
    data && data.length > 0 ? (
      <div className={cn(className)}>
        {data.map((el) => el)} {scrollLoaderComponent}
      </div>
    ) : (
      <>{nothingFound}</>
    )
  ) : (
    <Center>
      <Loader type='dots' className={className} />
    </Center>
  );
};
