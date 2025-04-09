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
import { monthlyHourlyGastoSelectedMonth$ } from '@/state/SharedState.ts'; // Importa el estado compartido

// Props
const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

// Estado local para el mes seleccionado
const selectedMonth = ref<string | null>(null);
const months = computed(() => [...new Set((props.data as DataItem[]).map((item: DataItem) => item.fecha.slice(0, 7)))]);

// Suscripción al estado compartido
let subscription: Subscription | null = null;
onMounted(() => {
  subscription = monthlyHourlyGastoSelectedMonth$.subscribe((month) => {
    selectedMonth.value = month;
  });

  // Inicializa el valor si no está definido
  if (!monthlyHourlyGastoSelectedMonth$.value && months.value.length > 0) {
    monthlyHourlyGastoSelectedMonth$.next(months.value[0]);
  }
});

onUnmounted(() => {
  subscription?.unsubscribe();
});

// Filtra los datos del mes seleccionado
const filteredData = computed(() => {
  if (!selectedMonth.value) return [];
  return (props.data as DataItem[]).filter(
    (item: DataItem) => item.fecha.slice(0, 7) === selectedMonth.value
  );
});

// Agrupa los datos por hora y calcula el gasto total por hora
const groupedByHour = computed(() => {
  const grouped: Record<string, number> = {};
  filteredData.value.forEach((item) => {
    if (!grouped[item.hora]) {
      grouped[item.hora] = 0;
    }
    grouped[item.hora] += item.gasto_total;
  });
  return grouped;
});

// Calcula el gasto total, máximo y mínimo
const totalGasto = computed(() =>
  filteredData.value.reduce(
    (total, item) => total + item.gasto_total,
    0
  ).toFixed(2)
);

const maxGasto = computed(() =>
  Math.max(...Object.values(groupedByHour.value)).toFixed(2)
);

const minGasto = computed(() =>
  Math.min(...Object.values(groupedByHour.value)).toFixed(2)
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