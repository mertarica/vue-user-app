<template>
  <div class="p-6">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold">User List</h2>
      <div class="flex items-center gap-4">
        <button
          v-if="!isLoading"
          @click="handleRefresh"
          :disabled="isRefreshing"
          class="refresh-btn"
        >
          <div
            v-if="isRefreshing"
            class="animate-spin rounded-full h-3 w-3 border-b border-gray-600"
          />
          <span>{{ isRefreshing ? 'Refreshing...' : 'Refresh' }}</span>
        </button>
        <div class="text-sm text-gray-500">{{ totalUsers }} users loaded</div>
      </div>
    </div>

    <!-- Filters -->
    <Filters
      v-model:selectedCountry="selectedCountry"
      v-model:selectedGender="selectedGender"
      :countries="uniqueCountries"
    />

    <!-- Content with clear loading states -->
    <Transition name="fade" mode="out-in">
      <!-- Initial Loading -->
      <div v-if="isLoading" key="loading" class="loading-state">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"
        />
        <span class="ml-3 text-gray-500">Loading users...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="isError" key="error" class="error-state">
        <div class="text-red-400 text-6xl mb-4">⚠️</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          Failed to load users
        </h3>
        <p class="text-gray-500 mb-4">{{ error }}</p>
        <div class="flex justify-center gap-3">
          <button @click="handleRefresh" class="btn-primary">Retry</button>
          <button @click="handleReset" class="btn-secondary">
            Reset & Retry
          </button>
        </div>
      </div>

      <!-- No Results (Filtered) -->
      <div
        v-else-if="filteredUsers.length === 0 && users.length > 0"
        key="no-results"
        class="empty-state"
      >
        <div class="text-gray-400 text-6xl mb-4">🔍</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">No users found</h3>
        <p class="text-gray-500 mb-4">No users match your current filters.</p>
        <button @click="clearFilters" class="btn-primary">Clear Filters</button>
      </div>

      <!-- No Users At All -->
      <div v-else-if="users.length === 0" key="no-users" class="empty-state">
        <div class="text-gray-400 text-6xl mb-4">👤</div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          No users available
        </h3>
        <p class="text-gray-500 mb-4">
          Unable to load users. Please try again.
        </p>
        <button @click="handleRefresh" class="btn-primary">Retry</button>
      </div>

      <!-- User Grid -->
      <div v-else key="content">
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

        <!-- Load More Button -->
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
                  />
                  <span>Loading more...</span>
                </div>
                <span v-else key="text">Load More Users</span>
              </Transition>
            </button>
          </div>
        </Transition>

        <!-- End Message -->
        <Transition name="fade">
          <div
            v-if="!hasMorePages && filteredUsers.length > 0"
            class="text-center mt-8"
          >
            <div class="text-gray-500 mb-2">🎉 You've reached the end!</div>
            <p class="text-sm text-gray-400">
              {{ totalUsers }} users loaded total
            </p>
          </div>
        </Transition>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import { useUsers } from '@/composables/useUsers';
import { useUserStore } from '@/stores/userStore';
import UserCard from '@/components/UserCard.vue';
import Filters from '@/components/Filters.vue';
import { useRouter } from 'vue-router';
import type { User } from '@/types/User';
import { TransitionGroup, Transition } from 'vue';

const store = useUserStore();
const router = useRouter();

const {
  users,
  totalUsers,
  isLoading,
  isLoadingMore,
  isRefreshing,
  isError,
  error,
  hasMorePages,
  loadMore,
  refresh,
  reset,
} = useUsers();

const selectedCountry = ref('');
const selectedGender = ref('');

watchEffect(() => {
  if (users.value.length > 0) {
    store.setUsers(users.value);
  }
});

const filteredUsers = computed(() => {
  return users.value.filter((user) => {
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

async function handleRefresh() {
  await refresh();
}

async function handleReset() {
  await reset();
}

function goToDetails(user: User) {
  store.selectUser(user);
  router.push(`/user/${user.id}`);
}

function clearFilters() {
  selectedCountry.value = '';
  selectedGender.value = '';
}
</script>

<style scoped>
.loading-state,
.error-state,
.empty-state {
  @apply flex flex-col justify-center items-center py-12 text-center;
}

.refresh-btn {
  @apply text-sm bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-lg transition-colors flex items-center gap-2;
}

.btn-primary {
  @apply bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg transition-colors;
}

.btn-secondary {
  @apply bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors;
}

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

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-up-enter-active {
  transition: all 0.4s ease;
}

.slide-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.spin-fade-enter-active,
.spin-fade-leave-active {
  transition: all 0.2s ease;
}

.spin-fade-enter-from,
.spin-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

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
