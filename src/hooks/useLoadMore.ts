/* eslint-disable no-unused-vars */
import { UseInfiniteQueryOptions, useInfiniteQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useRef } from 'react';

type QueryKey = unknown[];
interface Props<T> {
  queryKey: QueryKey;
  fetchFn: (page: number) => Promise<{ data: T[] }>;
  options?: UseInfiniteQueryOptions<{ data: T[]; page: number }, QueryKey>;
}

const defaultOptions: IntersectionObserverInit = {
  root: null,
  rootMargin: '0px',
  threshold: 0,
};

const useLoadMore = <T>(
  queryKey: Props<T>['queryKey'],
  fetchFn: Props<T>['fetchFn'],
  options: Props<T>['options']
) => {
  const observer = useRef<IntersectionObserver>(null);

  const nodeRef = useCallback((node: Element) => {
    if (!node || !observer.current) return;
    observer.current.observe(node);
  }, []);

  const { data, isFetching, fetchNextPage } = useInfiniteQuery<{
    data: T[];
    page: number;
  }>(
    [...queryKey],
    async ({ pageParam = 1 }) => {
      const res = await fetchFn(pageParam);
      return { data: res.data, page: pageParam };
    },
    {
      ...options,
      getNextPageParam: (res) => (res.data.length === 0 ? undefined : res.page + 1),
    }
  );

  const createNewObserver = useCallback(() => {
    return new IntersectionObserver((entries) => {
      const target = entries[0];
      if (target.isIntersecting && observer.current) {
        fetchNextPage();
        // unobserve when intersecting so that last item will not be observed to fetch again
        observer.current.unobserve(target.target);
      }
    }, defaultOptions);
  }, [fetchNextPage]);

  useEffect(() => {
    //  doesn't create new observer until options.enabled is true
    if (typeof options.enabled !== 'undefined' && !options.enabled) {
      observer.current = null;
      return;
    }
    observer.current = createNewObserver();
  }, [options?.enabled, createNewObserver]);

  const pageData = useMemo(() => data?.pages.map((page) => page.data).flat(), [data]);

  return { data: pageData ?? [], isFetching, nodeRef, fetchNextPage };
};

export default useLoadMore;
