<template>
  <v-container>
    <v-row>
      <!-- Caja: Consumo Total -->
      <v-col cols="12" md="4">
        <v-card class="pa-4" outlined>
          <v-card-title class="text-h6">Consumo Total</v-card-title>
          <v-card-text class="text-h5 font-weight-bold">
            {{ totalConsumption }} kWh
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Caja: Consumo Máximo -->
      <v-col cols="12" md="4">
        <v-card class="pa-4" outlined>
          <v-card-title class="text-h6">Consumo Máximo</v-card-title>
          <v-card-text class="text-h5 font-weight-bold">
            {{ maxConsumption }} kWh
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Caja: Consumo Mínimo -->
      <v-col cols="12" md="4">
        <v-card class="pa-4" outlined>
          <v-card-title class="text-h6">Consumo Mínimo</v-card-title>
          <v-card-text class="text-h5 font-weight-bold">
            {{ minConsumption }} kWh
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { Subscription } from 'rxjs';
import { consumptionSelectedDay$ } from '@/state/SharedState.ts'; // Importa el estado compartido

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
  subscription = consumptionSelectedDay$.subscribe((day: string | null) => {
    selectedDay.value = day;
  });

  // Inicializa el valor si no está definido
  if (!consumptionSelectedDay$.value && days.value.length > 0) {
    consumptionSelectedDay$.next(days.value[0]);
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

// Calcula el consumo total, máximo y mínimo
const totalConsumption = computed(() =>
  filteredData.value.reduce(
    (total, item) => total + parseFloat(item.consumo_kWh.replace(',', '.')),
    0
  ).toFixed(2)
);

const maxConsumption = computed(() =>
  Math.max(
    ...filteredData.value.map((item) =>
      parseFloat(item.consumo_kWh.replace(',', '.'))
    )
  ).toFixed(2)
);

const minConsumption = computed(() =>
  Math.min(
    ...filteredData.value.map((item) =>
      parseFloat(item.consumo_kWh.replace(',', '.'))
    )
  ).toFixed(2)
);

// Interfaz para los datos
interface DataItem {
  fecha: string;
  hora: string;
  consumo_kWh: string;
}
</script>

<style scoped>
.v-card {
  text-align: center;
}
</style>