import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { User } from '@/types/User';

export const useUserStore = defineStore('user', () => {
  const selectedUserId = ref<string | null>(null);
  const favoriteUserIds = ref<Set<string>>(new Set());

  function getSelectedUser(users: User[]): User | null {
    return users.find((u) => u.id === selectedUserId.value) || null;
  }

  function getFavoriteUsers(users: User[]): User[] {
    return users.filter((u) => favoriteUserIds.value.has(u.id));
  }

  return {
    selectedUserId,
    favoriteUserIds,
    getSelectedUser,
    getFavoriteUsers,
    selectUser: (id: string) => {
      selectedUserId.value = id;
    },

    toggleFavorite: (id: string) => {
      if (favoriteUserIds.value.has(id)) {
        favoriteUserIds.value.delete(id);
      } else {
        favoriteUserIds.value.add(id);
      }
      favoriteUserIds.value = new Set(favoriteUserIds.value);
    },

    clearFavorites: () => {
      favoriteUserIds.value.clear();
    },

    isFavorite: (id: string) => favoriteUserIds.value.has(id),

    favoriteCount: computed(() => favoriteUserIds.value.size),
  };
});
