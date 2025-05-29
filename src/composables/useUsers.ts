import { computed } from 'vue';
import { useInfiniteQuery, useQueryClient } from '@tanstack/vue-query';
import type { User } from '@/types/User';

const USERS_PER_PAGE = 21;

async function fetchUsersPage(
  page: number
): Promise<{ users: User[]; hasMore: boolean }> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const res = await fetch(
      `https://randomuser.me/api/?results=${USERS_PER_PAGE}&page=${page}&seed=userapp`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    const data = await res.json();

    const users = data.results.map(
      (u: any): User => ({
        id: `${u.login.uuid}-${page}`,
        name: `${u.name.first} ${u.name.last}`,
        age: u.dob.age,
        gender: u.gender,
        email: u.email,
        city: u.location.city,
        country: u.location.country,
        picture: u.picture.large,
      })
    );

    return {
      users,
      hasMore: page < 5, // Demo limit
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

export function useUsers() {
  const queryClient = useQueryClient();

  const query = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: ({ pageParam = 1 }) => fetchUsersPage(pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const users = computed(
    () => query.data.value?.pages.flatMap((page) => page.users) ?? []
  );

  return {
    users,
    totalUsers: computed(() => users.value.length),
    isLoading: query.isLoading,
    isLoadingMore: query.isFetchingNextPage,
    isRefreshing: query.isRefetching,
    isError: query.isError,
    error: computed(() => {
      const err = query.error.value;
      if (!err) return null;

      if (err.message.includes('fetch'))
        return 'Network error. Please check your connection.';
      if (err.message.includes('abort'))
        return 'Request timeout. Please try again.';
      return err.message || 'An unexpected error occurred.';
    }),
    hasMorePages: query.hasNextPage,
    loadMore: query.fetchNextPage,
    refresh: query.refetch,
    reset: () => queryClient.resetQueries({ queryKey: ['users'] }),
  };
}
