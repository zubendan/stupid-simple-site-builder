import { api } from '~/trpc/react';

export const DomainInfiniteList = ({
  organizationHashid,
}: { organizationHashid: string }) => {
  const { data, isLoading, fetchNextPage, isFetchingNextPage, hasNextPage } =
    api.domain.infiniteList.useInfiniteQuery(
      {
        organizationHashid,
        limit: 25,
        search: '',
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );
  console.log({ data });
  return <div>DomainInfiniteList</div>;
};
