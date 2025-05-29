<template>
  <div class="flex flex-col min-h-screen">
    <Header />

    <main class="flex-grow container mx-auto p-4">
      <ErrorBoundary>
        <RouterView />
      </ErrorBoundary>
    </main>

    <Footer />
  </div>
</template>

<script setup lang="ts">
import Header from '@/components/layout/Header.vue';
import Footer from '@/components/layout/Footer.vue';
import ErrorBoundary from '@/components/ErrorBoundary.vue';
</script>
