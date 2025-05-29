import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import { createPinia } from 'pinia';
import './assets/main.css';

const app = createApp(App);

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