<template>
  <div
    @click="handleClick"
    class="cursor-pointer bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 p-4 border border-gray-100 relative group"
  >
    <!-- Mobile Layout -->
    <div class="flex flex-col items-center text-center space-y-3 md:hidden">
      <img
        :src="user.picture"
        alt="user photo"
        class="w-16 h-16 rounded-full object-cover border-2 transition-colors"
        :class="isFavorite ? 'border-red-500' : 'border-indigo-500'"
      />
      <div class="space-y-1">
        <h3 class="text-base font-semibold text-gray-900 truncate">
          {{ user.name }}
        </h3>
        <p class="text-sm text-gray-600 truncate">
          {{ user.city }}, {{ user.country }}
        </p>
        <p class="text-xs text-indigo-600 truncate">{{ user.email }}</p>
        <span
          class="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-medium"
        >
          {{ user.age }} years
        </span>
      </div>
    </div>

    <!-- Desktop Layout -->
    <div class="hidden md:flex items-center gap-4">
      <img
        :src="user.picture"
        alt="user photo"
        class="w-12 h-12 md:w-16 md:h-16 rounded-full object-cover border-2 flex-shrink-0 transition-colors"
        :class="isFavorite ? 'border-red-500' : 'border-indigo-500'"
      />
      <div class="flex-grow min-w-0">
        <h3 class="text-sm md:text-base font-semibold text-gray-900 truncate">
          {{ user.name }}
        </h3>
        <p class="text-xs md:text-sm text-gray-600 truncate">
          {{ user.city }}, {{ user.country }}
        </p>
        <p class="text-xs text-indigo-600 truncate">{{ user.email }}</p>
      </div>
      <div class="flex-shrink-0">
        <span
          class="inline-block bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-medium"
        >
          {{ user.age }}
        </span>
      </div>
    </div>

    <div
      class="absolute bottom-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      :class="{ 'opacity-100': isFavorite }"
      @click.stop="toggleFavorite"
    >
      <button
        class="p-1 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow"
      >
        <svg
          class="w-4 h-4 transition-colors"
          :class="isFavorite ? 'text-red-500' : 'text-gray-400'"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fill-rule="evenodd"
            d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
            clip-rule="evenodd"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import type { User } from '@/types/User';

const props = defineProps<{ user: User }>();

const emit = defineEmits<{
  (e: 'select', user: User): void;
}>();

const store = useUserStore();

const isFavorite = computed(() => store.isFavorite(props.user.id));

function handleClick() {
  emit('select', props.user);
}

function toggleFavorite() {
  store.toggleFavorite(props.user);
}
</script>
