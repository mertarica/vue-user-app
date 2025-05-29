<template>
  <div v-if="hasError" class="error-boundary">
    <div class="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
      <div class="text-red-500 text-4xl mb-4">⚠️</div>
      <h3 class="text-lg font-semibold text-red-800 mb-2">
        Something went wrong
      </h3>
      <p class="text-red-600 mb-4">{{ errorMessage }}</p>
      <button
        @click="retry"
        class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
  <slot v-else />
</template>

<script setup lang="ts">
import { ref, onErrorCaptured } from 'vue';

const hasError = ref(false);
const errorMessage = ref('');

onErrorCaptured((err: Error, instance, info) => {
  console.error('Error captured:', err);
  console.error('Component instance:', instance);
  console.error('Component info:', info);

  hasError.value = true;
  errorMessage.value = err.message || 'An unexpected error occurred';

  return false;
});

function retry() {
  hasError.value = false;
  errorMessage.value = '';
}
</script>
