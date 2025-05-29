import { defineStore } from 'pinia';
import type { User } from '@/types/User';

export const useUserStore = defineStore('user', {
  state: () => ({
    allUsers: [] as User[],
    selectedUser: null as User | null,
    favoriteUsers: [] as User[],
  }),

  actions: {
    setUsers(users: User[]) {
      this.allUsers = users;
    },
    selectUser(user: User) {
      this.selectedUser = user;
    },
    toggleFavorite(user: User) {
      const exists = this.favoriteUsers.find((u) => u.id === user.id);
      if (exists) {
        this.favoriteUsers = this.favoriteUsers.filter((u) => u.id !== user.id);
      } else {
        this.favoriteUsers.push(user);
      }
    },
    clearFavorites() {
      this.favoriteUsers = [];
    },
  },

  getters: {
    isFavorite: (state) => (id: string) => {
      return state.favoriteUsers.some((u) => u.id === id);
    },
  },
});
