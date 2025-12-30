<template>
  <v-card :class="['modern-card', customClass]">
    <!-- Header -->
    <v-card-title class="card-header">
      <div class="header-content">
        <v-icon class="header-icon" size="24">mdi-chart-line</v-icon>
        <span class="header-title">{{ title }}</span>
      </div>
      <div class="header-actions">
        <v-btn
          icon
          variant="text"
          size="small"
          class="action-button"
          @click="toggleFullscreen"
          title="Pantalla completa"
        >
          <v-icon>mdi-fullscreen</v-icon>
        </v-btn>
        <v-btn
          icon
          variant="text"
          size="small"
          class="action-button"
          @click="toggleOffcanvas"
          title="Ver detalles"
        >
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
      </div>
    </v-card-title>

    <!-- Body -->
    <v-card-text class="card-body">
      <component :is="bodyComponent" :data="data" />
    </v-card-text>

    <!-- Footer -->
    <v-card-actions class="card-footer">
      <component :is="footerComponent" :data="data" />
    </v-card-actions>

    <!-- Offcanvas -->
    <v-navigation-drawer
      v-model="offcanvasOpen"
      location="right"
      width="100%"
      absolute
      temporary
      class="offcanvas-drawer"
    >
      <v-toolbar flat class="offcanvas-toolbar">
        <v-btn icon variant="text" @click="toggleOffcanvas">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
        <v-toolbar-title class="offcanvas-title">{{ offcanvasTitle }}</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-divider></v-divider>
      <v-container class="offcanvas-content">
        <component :is="offcanvasComponent" :data="data" />
      </v-container>
    </v-navigation-drawer>

    <!-- Fullscreen Dialog -->
    <v-dialog
      v-model="fullscreenOpen"
      fullscreen
      transition="dialog-bottom-transition"
    >
      <v-card class="fullscreen-card">
        <v-toolbar flat class="fullscreen-toolbar">
          <v-btn icon variant="text" @click="toggleFullscreen">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title class="fullscreen-title">{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
        <v-divider></v-divider>
        <v-card-text class="fullscreen-content">
          <component :is="bodyComponent" :data="data" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </v-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  offcanvasTitle: {
    type: String,
    required: true,
  },
  bodyComponent: {
    type: [Object, String],
    required: true,
  },
  offcanvasComponent: {
    type: [Object, String],
    required: true,
  },
  footerComponent: {
    type: [Object, String],
    required: true,
  },
  data: {
    type: Array,
    required: true,
  },
  customClass: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['footerAction']);

const offcanvasOpen = ref(false);
const fullscreenOpen = ref(false);

const toggleOffcanvas = () => {
  offcanvasOpen.value = !offcanvasOpen.value;
};

const toggleFullscreen = () => {
  fullscreenOpen.value = !fullscreenOpen.value;
};

const onFooterAction = () => {
  emit('footerAction');
};
</script>

<style scoped>
.modern-card {
  margin-bottom: 1.5rem;
  position: relative;
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
}

.modern-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  background: rgba(var(--v-theme-surface-variant), 0.5);
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.06);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  color: rgb(var(--v-theme-primary));
  opacity: 0.9;
}

.header-title {
  font-size: 1rem;
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
  letter-spacing: -0.25px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.action-button {
  color: rgba(var(--v-theme-on-surface), 0.6);
  transition: all 0.2s ease;
}

.action-button:hover {
  color: rgb(var(--v-theme-primary));
  background: rgba(var(--v-theme-primary), 0.1);
}

.card-body {
  padding: 1.25rem;
}

.card-footer {
  padding: 0.75rem 1.25rem;
  background: rgba(var(--v-theme-surface-variant), 0.3);
  border-top: 1px solid rgba(var(--v-theme-on-surface), 0.04);
}

.offcanvas-drawer {
  background: rgb(var(--v-theme-surface)) !important;
}

.offcanvas-toolbar {
  background: rgba(var(--v-theme-surface-variant), 0.5) !important;
}

.offcanvas-title {
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.offcanvas-content {
  padding: 1.5rem;
}

:deep(nav.v-navigation-drawer) {
  width: 100% !important;
  max-width: 100% !important;
}

/* Fullscreen dialog styles */
:deep(.v-dialog--fullscreen) {
  z-index: 9999 !important;
}

:deep(.v-dialog--fullscreen > .v-overlay__content) {
  width: 100% !important;
  max-width: 100% !important;
  margin: 0 !important;
  padding: 0 !important;
}

.fullscreen-card {
  height: 100vh;
  max-height: 100vh;
  width: 100%;
  max-width: 100% !important;
  min-width: 100% !important;
  display: flex;
  flex-direction: column;
  background: rgb(var(--v-theme-surface)) !important;
  border-radius: 0 !important;
  margin: 0 !important;
  overflow: hidden !important;
}

.fullscreen-toolbar {
  background: rgba(var(--v-theme-surface-variant), 0.5) !important;
  flex: 0 0 auto;
  height: 64px;
  min-height: 64px;
}

.fullscreen-title {
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.fullscreen-content {
  flex: 1;
  padding: 1rem;
  overflow: hidden !important;
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 100%;
  height: calc(100vh - 64px);
  max-height: calc(100vh - 64px);
}

.fullscreen-content :deep(.v-container) {
  flex: 1;
  display: flex;
  flex-direction: column;
  max-width: 100% !important;
  padding: 0 !important;
  height: 100%;
  overflow: hidden;
}

/* First row (selector) - fixed height */
.fullscreen-content :deep(.v-container > .v-row:first-child) {
  flex: 0 0 auto;
  margin: 0 0 0.5rem 0 !important;
  width: 100%;
  height: auto;
}

/* Second row (chart) - fills remaining space */
.fullscreen-content :deep(.v-container > .v-row:last-child) {
  flex: 1;
  margin: 0 !important;
  width: 100%;
  min-height: 0;
}

.fullscreen-content :deep(.v-col) {
  padding: 0 0.5rem !important;
}

.fullscreen-content :deep(.v-container > .v-row:last-child > .v-col) {
  height: 100%;
  display: flex;
  align-items: stretch;
}

.fullscreen-content :deep(canvas) {
  width: 100% !important;
  max-width: 100% !important;
  height: 100% !important;
}
</style>