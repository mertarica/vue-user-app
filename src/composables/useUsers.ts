import { computed } from 'vue';
import { useInfiniteQuery, useQueryClient } from '@tanstack/vue-query';
import type { User } from '@/types/User';

const USERS_PER_PAGE = 21;

// API Functions
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
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ['users'],
    queryFn: ({ pageParam = 1 }) => fetchUsersPage(pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  const users = computed(() => {
    return data.value?.pages.flatMap((page) => page.users) ?? [];
  });

  const totalUsers = computed(() => users.value.length);

  const errorMessage = computed(() => {
    if (error.value instanceof Error) {
      return error.value.message;
    }
    return error.value ? String(error.value) : null;
  });

  const actions = {
    loadMore: async () => {
      if (hasNextPage.value && !isFetchingNextPage.value) {
        await fetchNextPage();
      }
    },

    refresh: async () => {
      await refetch();
    },

    reset: async () => {
      await queryClient.resetQueries({ queryKey: ['users'] });
    },
  };

  return {
    users,
    totalUsers,
    isLoading,
    isLoadingMore: computed(() => isFetchingNextPage.value),
    isRefreshing: computed(() => isRefetching.value),
    isError,
    error: errorMessage,
    hasMorePages: computed(() => hasNextPage.value),
    ...actions,
  };
}
