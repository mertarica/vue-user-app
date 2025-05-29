import { ref, computed } from 'vue';
import type { User } from '@/types/User';

export function useUsers() {
  const users = ref<User[]>([]);
  const isLoading = ref(false);
  const isLoadingMore = ref(false);
  const error = ref<string | null>(null);
  const currentPage = ref(1);
  const hasMorePages = ref(true);
  const usersPerPage = 21;

  const totalUsers = computed(() => users.value.length);

  const fetchUsers = async (page = 1, append = false) => {
    if (append) {
      isLoadingMore.value = true;
    } else {
      isLoading.value = true;
      users.value = []; // Clear existing users for fresh fetch
    }
    
    error.value = null;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(
        `https://randomuser.me/api/?results=${usersPerPage}&page=${page}&seed=userapp`,
        {
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      
      const newUsers = data.results.map(
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

      if (append) {
        users.value = [...users.value, ...newUsers];
      } else {
        users.value = newUsers;
      }

      currentPage.value = page;
      // For demo purposes, let's say we have max 5 pages
      hasMorePages.value = page < 5;

    } catch (err) {
      console.error('Failed to fetch users:', err);

      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          error.value = 'Request timed out. Please try again.';
        } else {
          error.value = err.message;
        }
      } else {
        error.value = 'Failed to fetch users';
      }
    } finally {
      isLoading.value = false;
      isLoadingMore.value = false;
    }
  };

  const loadMoreUsers = async () => {
    if (!hasMorePages.value || isLoadingMore.value) return;
    await fetchUsers(currentPage.value + 1, true);
  };

  const refreshUsers = async () => {
    currentPage.value = 1;
    hasMorePages.value = true;
    await fetchUsers(1, false);
  };

  return {
    users,
    fetchUsers,
    loadMoreUsers,
    refreshUsers,
    isLoading,
    isLoadingMore,
    error,
    currentPage,
    hasMorePages,
    totalUsers,
  };
}