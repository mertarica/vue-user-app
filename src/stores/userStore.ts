import { defineStore } from 'pinia';
import { computed, ref, shallowRef } from 'vue';
import type { User } from '@/types/User';

export const useUserStore = defineStore('user', () => {
  const allUsers = shallowRef<User[]>([]);
  const selectedUser = ref<User | null>(null);
  const favoriteUsers = ref<User[]>([]);

  function setUsers(users: User[]) {
    allUsers.value = users;
  }

  function selectUser(user: User) {
    selectedUser.value = user;
  }

  function toggleFavorite(user: User) {
    const exists = favoriteUsers.value.find((u) => u.id === user.id);
    if (exists) {
      favoriteUsers.value = favoriteUsers.value.filter((u) => u.id !== user.id);
    } else {
      favoriteUsers.value = [...favoriteUsers.value, user];
    }
  }

  function clearFavorites() {
    favoriteUsers.value = [];
  }

  const isFavorite = computed(() => (id: string) => {
    return favoriteUsers.value.some((u) => u.id === id);
  });

  const favoriteCount = computed(() => favoriteUsers.value.length);

  return {
    allUsers,
    selectedUser,
    favoriteUsers,
    setUsers,
    selectUser,
    toggleFavorite,
    clearFavorites,
    isFavorite,
    favoriteCount,
  };
});
