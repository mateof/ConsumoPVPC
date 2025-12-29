<template>
  <v-card :class="['modern-card', customClass]">
    <!-- Header -->
    <v-card-title class="card-header">
      <div class="header-content">
        <v-icon class="header-icon" size="24">mdi-chart-line</v-icon>
        <span class="header-title">{{ title }}</span>
      </div>
      <v-btn
        icon
        variant="text"
        size="small"
        class="expand-button"
        @click="toggleOffcanvas"
      >
        <v-icon>mdi-arrow-expand</v-icon>
      </v-btn>
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
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title class="offcanvas-title">{{ offcanvasTitle }}</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-divider></v-divider>
      <v-container class="offcanvas-content">
        <component :is="offcanvasComponent" :data="data" />
      </v-container>
    </v-navigation-drawer>
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

const toggleOffcanvas = () => {
  offcanvasOpen.value = !offcanvasOpen.value;
};

const onFooterAction = () => {
  emit('footerAction');
};
</script>

<style scoped>
.modern-card {
  margin-bottom: 1.5rem;
  position: relative;
  background: #ffffff;
  border: 1px solid rgba(0, 0, 0, 0.06);
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
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  color: #2563eb;
  opacity: 0.9;
}

.header-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  letter-spacing: -0.25px;
}

.expand-button {
  color: #64748b;
  transition: all 0.2s ease;
}

.expand-button:hover {
  color: #2563eb;
  background: rgba(37, 99, 235, 0.1);
}

.card-body {
  padding: 1.25rem;
}

.card-footer {
  padding: 0.75rem 1.25rem;
  background: #fafbfc;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
}

.offcanvas-drawer {
  background: #ffffff;
}

.offcanvas-toolbar {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.offcanvas-title {
  font-weight: 600;
  color: #1e293b;
}

.offcanvas-content {
  padding: 1.5rem;
}

:deep(nav.v-navigation-drawer) {
  width: 100% !important;
  max-width: 100% !important;
}
</style>