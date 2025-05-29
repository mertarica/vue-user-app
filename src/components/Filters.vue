<template>
  <div class="flex flex-col md:flex-row flex-wrap gap-4 mb-6">
    <div class="w-full md:w-auto">
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Country
      </label>
      <select
        v-model="selectedCountry"
        class="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-48 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">All Countries</option>
        <option v-for="country in countries" :key="country" :value="country">
          {{ country }}
        </option>
      </select>
    </div>

    <div class="w-full md:w-auto">
      <label class="block text-sm font-medium text-gray-700 mb-1">
        Gender
      </label>
      <select
        v-model="selectedGender"
        class="border border-gray-300 rounded-lg px-3 py-2 w-full md:w-48 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
      >
        <option value="">All Genders</option>
        <option value="male">Male</option>
        <option value="female">Female</option>
      </select>
    </div>

    <div class="w-full md:w-auto md:flex md:items-end">
      <button
        v-if="hasActiveFilters"
        @click="clearFilters"
        class="w-full md:w-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
        Clear Filters
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  selectedCountry: string;
  selectedGender: string;
  countries: string[];
}>();

const emit = defineEmits<{
  (e: 'update:selectedCountry', value: string): void;
  (e: 'update:selectedGender', value: string): void;
}>();

const selectedCountry = computed({
  get: () => props.selectedCountry,
  set: (val) => emit('update:selectedCountry', val),
});

const selectedGender = computed({
  get: () => props.selectedGender,
  set: (val) => emit('update:selectedGender', val),
});

const hasActiveFilters = computed(() => {
  return props.selectedCountry !== '' || props.selectedGender !== '';
});

function clearFilters() {
  emit('update:selectedCountry', '');
  emit('update:selectedGender', '');
}
</script>