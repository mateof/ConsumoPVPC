<template>
  <v-app class="app-background">
    <!-- Overlay con Spinner -->
    <v-overlay :model-value="showSpinner" class="loading-overlay">
      <div class="loading-content">
        <v-progress-circular
          indeterminate
          color="primary"
          size="72"
          width="6"
        ></v-progress-circular>
        <span class="loading-text">Cargando datos...</span>
      </div>
    </v-overlay>

    <v-main>
      <router-view />
    </v-main>

    <!-- Enlace a GitHub - FAB moderno -->
    <a
      href="https://github.com/mateof/ConsumoPVPC"
      target="_blank"
      rel="noopener noreferrer"
      class="github-fab"
      title="Ver en GitHub"
    >
      <svg height="24" width="24" viewBox="0 0 16 16" fill="currentColor">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
      </svg>
    </a>
  </v-app>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { showSpinner$ } from '@/state/SharedState.ts';
import { Subscription } from 'rxjs';

const showSpinner = ref(false);
let subscription: Subscription | null = null;

onMounted(() => {
  subscription = showSpinner$.subscribe((value: boolean | null) => {
    showSpinner.value = !!value;
  });
});

onUnmounted(() => {
  subscription?.unsubscribe();
});
</script>

<style scoped>
.app-background {
  min-height: 100vh;
}

.loading-overlay {
  backdrop-filter: blur(4px);
}

.loading-overlay :deep(.v-overlay__content) {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  padding: 2rem;
  background: rgba(var(--v-theme-surface), 0.95);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.loading-text {
  font-size: 1.1rem;
  font-weight: 500;
  color: rgb(var(--v-theme-primary));
  letter-spacing: 0.5px;
}

.github-fab {
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #24292e 0%, #1a1e22 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
}

.github-fab:hover {
  transform: translateY(-4px) scale(1.05);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.35);
  background: linear-gradient(135deg, #2d3339 0%, #24292e 100%);
}

.github-fab:active {
  transform: translateY(-2px) scale(1.02);
}

.github-fab svg {
  transition: transform 0.3s ease;
}

.github-fab:hover svg {
  transform: rotate(360deg);
}
</style>
