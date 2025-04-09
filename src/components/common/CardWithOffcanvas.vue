<template>
  <v-card>
    <!-- Header -->
    <v-card-title class="header">
      <span>{{ title }}</span>
    </v-card-title>
    <v-divider></v-divider> <!-- Línea debajo de la cabecera -->

    <!-- Botón mdi-arrow-left-bold -->
    <v-btn
      icon
      class="menu-button"
      @click="toggleOffcanvas"
    >
      <v-icon>mdi-arrow-left-bold</v-icon>
    </v-btn>

    <!-- Body -->
    <v-card-text>
      <component :is="bodyComponent" :data="data" />
    </v-card-text>

    <!-- Footer -->
    <v-card-actions>
      <v-container>
        <component :is="footerComponent" :data="data" />
      </v-container>
    </v-card-actions>

    <!-- Offcanvas -->
    <v-navigation-drawer
      v-model="offcanvasOpen"
      location="right"
      width="100%"
      absolute
      mode="temporary"
    >
      <v-toolbar flat>
        <v-btn icon @click="toggleOffcanvas">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>{{ offcanvasTitle }}</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-divider></v-divider>
      <v-container>
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
.v-card {
  margin-bottom: 16px;
  position: relative;
}

.header {
  background-color: #f5f5f5; /* Fondo gris claro */
}

.menu-button {
  position: absolute;
  top: 50%; /* A media altura */
  left: 16px; /* Alineado a la izquierda */
  transform: translateY(-50%); /* Centra el botón verticalmente */
  z-index: 1; /* Asegura que el botón esté encima del contenido */
}

::v-deep(nav.v-navigation-drawer) {
  width: 100% !important;
  max-width: 100% !important;
}
</style>