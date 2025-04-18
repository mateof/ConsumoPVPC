<template>
  
  <v-app>
    <!-- Overlay con Spinner -->
  <v-overlay :model-value="showSpinner">
      <v-progress-circular indeterminate color="primary" size="64"></v-progress-circular>
      <span class="ml-4 text-h6">Cargando Datos...</span>
    </v-overlay>
    <v-main>
      <router-view />
    </v-main>

    

    <!-- Enlace a GitHub -->
    <a href="https://github.com/mateof/ConsumoPVPC">
      <img
        class="github-corner"
        src="https://github.blog/wp-content/uploads/2008/12/forkme_right_darkblue_121621.png"
        alt="Fork me on GitHub"
      />
    </a>
  </v-app>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { showSpinner$ } from '@/state/SharedState.ts'; // Importa el estado compartido
import { Subscription } from 'rxjs';

const showSpinner = ref(false); // Estado local para manejar el overlay
let subscription: Subscription | null = null;

// Suscripción al BehaviorSubject
onMounted(() => {
  subscription = showSpinner$.subscribe((value) => {
    showSpinner.value = !!value; // Actualiza el estado local basado en el BehaviorSubject
  });
});

onUnmounted(() => {
  subscription?.unsubscribe(); // Limpia la suscripción al desmontar el componente
});
</script>

<style scoped>
.github-corner {
  position: absolute;
  top: 0;
  right: 0;
  border: 0;
  z-index: 1000;
}

.v-overlay {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}
</style>
