import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import router from './router';
import { VueQueryPlugin } from 'vue-query';

import { createPinia } from 'pinia';
const pinia = createPinia();

import '@/scss/index.scss';

// Vuetify
import 'vuetify/styles';
import { ThemeDefinition, createVuetify } from 'vuetify';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import '@mdi/font/css/materialdesignicons.css';

const myCustomLightTheme: ThemeDefinition = {
  dark: false,
  colors: {
    primary: '#2563eb',
    'primary-darken-1': '#1d4ed8',
    secondary: '#10b981',
    'secondary-darken-1': '#059669',
    accent: '#8b5cf6',
    error: '#ef4444',
    warning: '#f59e0b',
    info: '#3b82f6',
    success: '#22c55e',
    background: '#f8fafc',
    surface: '#ffffff',
    'surface-variant': '#f1f5f9',
    'on-surface': '#1e293b',
    'on-background': '#0f172a',
  },
};

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme,
    },
  },
  defaults: {
    VCard: {
      elevation: 0,
      rounded: 'lg',
    },
    VBtn: {
      rounded: 'lg',
    },
  },
});

createApp(App)
  .use(VueQueryPlugin)
  .use(pinia)
  .use(vuetify)
  .use(router)
  .mount('#app');
