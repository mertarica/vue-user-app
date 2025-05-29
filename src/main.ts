import { createApp } from 'vue';
import { VueQueryPlugin } from '@tanstack/vue-query';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import './assets/main.css';

const app = createApp(App);

app.use(VueQueryPlugin, {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: 2,
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
      },
    },
  },
});

// Global error handler
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err);
  console.error('Component instance:', instance);
  console.error('Error info:', info);
};

// Global warning handler
app.config.warnHandler = (msg, instance, trace) => {
  console.warn('Vue warning:', msg);
  console.warn('Component instance:', instance);
  console.warn('Component trace:', trace);
};

app.use(createPinia());
app.use(router);
app.mount('#app');
