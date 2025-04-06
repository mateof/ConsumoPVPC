<template>
  <v-card>
    <!-- Header -->
    <v-card-title>
      <span>{{ title }}</span>
      <v-spacer></v-spacer>
      <v-btn icon @click="toggleOffcanvas">
        <v-icon>mdi-menu</v-icon>
      </v-btn>
    </v-card-title>

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
}

::v-deep(nav.v-navigation-drawer) {
  width: 100% !important;
  max-width: 100% !important;
}
</style>