<template>
  <v-container>
    <v-row>
      <!-- Caja: Gasto Total -->
      <v-col cols="12" md="4">
        <v-card class="pa-4" outlined>
          <v-card-title class="text-h6">Gasto Total</v-card-title>
          <v-card-text class="text-h5 font-weight-bold">
            {{ totalGasto }} €
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Caja: Gasto Máximo -->
      <v-col cols="12" md="4">
        <v-card class="pa-4" outlined>
          <v-card-title class="text-h6">Gasto Máximo</v-card-title>
          <v-card-text class="text-h5 font-weight-bold">
            {{ maxGasto }} €
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Caja: Gasto Mínimo -->
      <v-col cols="12" md="4">
        <v-card class="pa-4" outlined>
          <v-card-title class="text-h6">Gasto Mínimo</v-card-title>
          <v-card-text class="text-h5 font-weight-bold">
            {{ minGasto }} €
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Subscription } from 'rxjs';
import { dailyGastoSelectedDay$ } from '@/state/SharedState.ts'; // Importa el estado compartido

// Props
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

// Estado local para el día seleccionado
const selectedDay = ref<string | null>(null);
const days = computed(() => {
  if (!props.data || !Array.isArray(props.data)) return [];
  return [...new Set((props.data as DataItem[]).filter(item => item?.fecha).map((item: DataItem) => item.fecha))];
});

// Suscripción al estado compartido
let subscription: Subscription | null = null;
onMounted(() => {
  subscription = dailyGastoSelectedDay$.subscribe((day: string | null) => {
    selectedDay.value = day;
  });

  // Inicializa el valor si no está definido
  if (!dailyGastoSelectedDay$.value && days.value.length > 0) {
    dailyGastoSelectedDay$.next(days.value[0]);
  }
});

onUnmounted(() => {
  subscription?.unsubscribe();
});

// Filtra los datos del día seleccionado
const filteredData = computed(() => {
  if (!selectedDay.value || !props.data || !Array.isArray(props.data)) return [];
  return (props.data as DataItem[]).filter(
    (item: DataItem) => item?.fecha === selectedDay.value
  );
});

// Calcula el gasto total, máximo y mínimo
const totalGasto = computed(() =>
  filteredData.value.reduce(
    (total, item) => total + item.gasto_total,
    0
  ).toFixed(2)
);

const maxGasto = computed(() =>
  Math.max(
    ...filteredData.value.map((item) => item.gasto_total)
  ).toFixed(2)
);

const minGasto = computed(() =>
  Math.min(
    ...filteredData.value.map((item) => item.gasto_total)
  ).toFixed(2)
);

// Interfaz para los datos
interface DataItem {
  fecha: string;
  hora: string;
  gasto_total: number;
}
</script>

<style scoped>
.v-card {
  text-align: center;
}
</style>