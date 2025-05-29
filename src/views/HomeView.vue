<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold">User List</h2>
      <div class="text-sm text-gray-500">{{ totalUsers }} users loaded</div>
    </div>

    <!-- Filters -->
    <Filters
      v-model:selectedCountry="selectedCountry"
      v-model:selectedGender="selectedGender"
      :countries="uniqueCountries"
    />

    <!-- Loading State with simple fade -->
    <Transition name="fade" mode="out-in">
      <div
        v-if="isLoading"
        key="loading"
        class="flex justify-center items-center py-12"
      >
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"
        ></div>
        <span class="ml-3 text-gray-500">Loading users...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" key="error" class="text-center py-12">
        <div class="text-red-400 text-6xl mb-4">⚠️</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          Failed to load users
        </h3>
        <p class="text-gray-500 mb-4">{{ error }}</p>
        <button
          @click="retryFetch"
          class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>

      <!-- Empty State (No filtered results) -->
      <div
        v-else-if="filteredUsers.length === 0 && store.allUsers.length > 0"
        key="no-results"
        class="text-center py-12"
      >
        <div class="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No users found</h3>
        <p class="text-gray-500 mb-4">No users match your current filters.</p>
        <button
          @click="clearFilters"
          class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Clear Filters
        </button>
      </div>

      <!-- Empty State (No users at all) -->
      <div
        v-else-if="!isLoading && store.allUsers.length === 0"
        key="no-users"
        class="text-center py-12"
      >
        <div class="text-gray-400 text-6xl mb-4">👤</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          No users available
        </h3>
        <p class="text-gray-500 mb-4">
          Unable to load users. Please try again.
        </p>
        <button
          @click="retryFetch"
          class="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>

      <div v-else key="content">
        <!-- Simple grid with subtle entrance animations -->
        <TransitionGroup
          name="card-fade"
          tag="div"
          class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
        >
          <UserCard
            v-for="user in filteredUsers"
            :key="user.id"
            :user="user"
            @select="goToDetails"
          />
        </TransitionGroup>

        <!-- Clean Load More Button -->
        <Transition name="slide-up">
          <div
            v-if="hasMorePages && filteredUsers.length > 0"
            class="flex justify-center mt-8"
          >
            <button
              @click="loadMore"
              :disabled="isLoadingMore"
              class="load-more-btn"
            >
              <Transition name="spin-fade" mode="out-in">
                <div
                  v-if="isLoadingMore"
                  key="loading"
                  class="flex items-center gap-2"
                >
                  <div
                    class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
                  ></div>
                  <span>Loading...</span>
                </div>
                <span v-else key="text">Load More Users</span>
              </Transition>
            </button>
          </div>
        </Transition>

        <!-- Simple end message -->
        <Transition name="fade">
          <div
            v-if="!hasMorePages && filteredUsers.length > 0"
            class="text-center mt-8 text-gray-500"
          >
            <p>You've reached the end! 🎉</p>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useUsers } from '@/composables/useUsers';
import { useUserStore } from '@/stores/userStore';
import UserCard from '@/components/UserCard.vue';
import Filters from '@/components/Filters.vue';
import { useRouter } from 'vue-router';
import type { User } from '@/types/User';
import { TransitionGroup, Transition } from 'vue';

// Store, Router, and Data
const store = useUserStore();
const router = useRouter();
const {
  users,
  fetchUsers,
  loadMoreUsers,
  refreshUsers,
  isLoading,
  isLoadingMore,
  error,
  hasMorePages,
  totalUsers,
} = useUsers();

const selectedCountry = ref('');
const selectedGender = ref('');

onMounted(async () => {
  await fetchUsers();
  store.setUsers(users.value);
});

const filteredUsers = computed(() => {
  const allUsers = users.value;

  return allUsers.filter((user) => {
    const matchCountry = selectedCountry.value
      ? user.country === selectedCountry.value
      : true;
    const matchGender = selectedGender.value
      ? user.gender === selectedGender.value
      : true;
    return matchCountry && matchGender;
  });
});

const uniqueCountries = computed(() => {
  const countries = users.value.map((u) => u.country);
  return [...new Set(countries)].sort();
});

function goToDetails(user: User) {
  store.selectUser(user);
  router.push(`/user/${user.id}`);
}

function clearFilters() {
  selectedCountry.value = '';
  selectedGender.value = '';
}

async function retryFetch() {
  await refreshUsers();
  store.setUsers(users.value);
}

async function loadMore() {
  await loadMoreUsers();
  store.setUsers(users.value);
}
</script>

<style scoped>
/* Simple load more button */
.load-more-btn {
  @apply bg-indigo-500 hover:bg-indigo-600 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-medium transition-all duration-300;
}

.load-more-btn:not(:disabled):hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.25);
}

.load-more-btn:disabled {
  cursor: not-allowed;
}

/* Fade transition */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Slide up transition */
.slide-up-enter-active {
  transition: all 0.4s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

/* Spin fade transition */
.spin-fade-enter-active,
.spin-fade-leave-active {
  transition: all 0.2s ease;
}

.spin-fade-enter-from,
.spin-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

/* Card fade transition */
.card-fade-enter-active {
  transition: all 0.4s ease;
}

.card-fade-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.card-fade-leave-active {
  transition: all 0.3s ease;
}

.card-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.card-fade-move {
  transition: transform 0.3s ease;
}
</style>
