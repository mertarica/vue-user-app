<template>
  <header class="bg-indigo-600 text-white p-4 shadow">
    <div class="flex justify-between items-center">
      <div class="text-lg sm:text-xl font-bold cursor-pointer" @click="$router.push('/')">
        <span class="hidden sm:inline">User Management App</span>
        <span class="sm:hidden">UMA</span>
      </div>
      
      <!-- Desktop Navigation -->
      <nav class="hidden sm:flex space-x-4">
        <RouterLink to="/" class="hover:underline transition-colors flex items-center gap-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
          </svg>
          <span>Home</span>
        </RouterLink>
        <RouterLink to="/favorites" class="hover:underline transition-colors flex items-center gap-2">
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
          </svg>
          <span>Favorites</span>
        </RouterLink>
      </nav>
      
      <!-- Mobile Navigation -->
      <nav class="flex sm:hidden space-x-4">
        <RouterLink to="/" class="hover:opacity-75 transition-opacity">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"/>
          </svg>
        </RouterLink>
        <RouterLink to="/favorites" class="hover:opacity-75 transition-opacity">
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"/>
          </svg>
        </RouterLink>
      </nav>
    </div>
  </header>
</template>