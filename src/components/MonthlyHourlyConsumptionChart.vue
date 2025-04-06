<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4" class="d-flex align-center">
        <v-btn icon @click="decreaseMonth">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-select
          v-model="monthlyHourlySelectedMonth"
          :items="months"
          label="Select Month"
          class="mx-2"
        ></v-select>
        <v-btn icon @click="increaseMonth">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
      </v-col>
    </v-row>
    <v-row>
      <v-col>
        <Line :data="chartData" :options="chartOptions" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { Line } from 'vue-chartjs';
import { monthlyHourlySelectedMonth$ } from '@/state/SharedState.ts'; // Importa el estado compartido
import { Subscription } from 'rxjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from 'chart.js';
import { chartColors } from '@/config/chartColors';

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
);

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});

const monthlyHourlySelectedMonth = ref<string | null>(null); // Estado local para sincronizar con el BehaviorSubject
const months = computed(() => [...new Set((props.data as DataItem[]).map((item: DataItem) => item.fecha.slice(0, 7)))]);

// Suscripción al estado compartido
let subscription: Subscription | null = null;
onMounted(() => {
  subscription = monthlyHourlySelectedMonth$.subscribe((month) => {
    monthlyHourlySelectedMonth.value = month;
  });

  // Inicializa el valor si no está definido
  if (!monthlyHourlySelectedMonth$.value && months.value.length > 0) {
    monthlyHourlySelectedMonth$.next(months.value[0]);
  }
});

onUnmounted(() => {
  subscription?.unsubscribe();
});

// Actualiza el estado compartido cuando cambie monthlyHourlySelectedMonth
watch(monthlyHourlySelectedMonth, (newMonth) => {
  monthlyHourlySelectedMonth$.next(newMonth);
});

const increaseMonth = () => {
  const currentIndex = months.value.indexOf(monthlyHourlySelectedMonth.value!);
  if (currentIndex > 0) {
    monthlyHourlySelectedMonth$.next(months.value[currentIndex - 1]);
  }
};

const decreaseMonth = () => {
  const currentIndex = months.value.indexOf(monthlyHourlySelectedMonth.value!);
  if (currentIndex < months.value.length - 1) {
    monthlyHourlySelectedMonth$.next(months.value[currentIndex + 1]);
  }
};

interface DataItem {
  fecha: string;
  hora: string;
  consumo_kWh: string;
}

const chartData = computed(() => {
  const monthData = (props.data as DataItem[]).filter((item: DataItem) => item.fecha.slice(0, 7) === monthlyHourlySelectedMonth.value);
  const groupedData = monthData.reduce((acc, item) => {
    const hour = item.hora;
    if (!acc[hour]) {
      acc[hour] = 0;
    }
    acc[hour] += parseFloat(item.consumo_kWh.replace(',', '.'));
    return acc;
  }, {} as Record<string, number>);

  const sortedHours = Object.keys(groupedData).sort((a, b) => parseInt(a) - parseInt(b));

  return {
    labels: sortedHours,
    datasets: [
      {
        label: 'Consumo (kWh)',
        backgroundColor: chartColors.value.backgroundColor,
        borderColor: chartColors.value.borderColor,
        fill: false,
        data: sortedHours.map(hour => groupedData[hour]),
      },
    ],
  };
});

const chartOptions = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      title: {
        display: true,
        text: 'Hora',
      },
    },
    y: {
      title: {
        display: true,
        text: 'Consumo (kWh)',
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
    },
  },
  layout: {
    padding: {
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
    },
  },
  backgroundColor: 'white',
});
</script>

<style scoped>
.chart-container {
  position: relative;
  margin: auto;
  height: 40vh;
  width: 80vw;
  background-color: white;
}
</style>