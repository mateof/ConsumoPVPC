<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4" class="d-flex align-center">
        <v-btn icon @click="decreaseMonth">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-select
          v-model="monthlyHourlyGastoSelectedMonth"
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
import { monthlyHourlyGastoSelectedMonth$ } from '@/state/SharedState.ts'; // Importa el estado compartido
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

const monthlyHourlyGastoSelectedMonth = ref<string | null>(null); // Estado local para sincronizar con el BehaviorSubject
const months = computed(() => {
  if (!props.data || !Array.isArray(props.data)) return [];
  return [...new Set((props.data as DataItem[]).filter(item => item?.fecha).map((item: DataItem) => item.fecha.slice(0, 7)))];
});

// Suscripción al estado compartido
let subscription: Subscription | null = null;
onMounted(() => {
  subscription = monthlyHourlyGastoSelectedMonth$.subscribe((month: string | null) => {
    monthlyHourlyGastoSelectedMonth.value = month;
  });

  // Inicializa el valor si no está definido
  if (!monthlyHourlyGastoSelectedMonth$.value && months.value.length > 0) {
    monthlyHourlyGastoSelectedMonth$.next(months.value[0]);
  }
});

onUnmounted(() => {
  subscription?.unsubscribe();
});

// Actualiza el estado compartido cuando cambie monthlyHourlyGastoSelectedMonth
watch(monthlyHourlyGastoSelectedMonth, (newMonth) => {
  monthlyHourlyGastoSelectedMonth$.next(newMonth);
});

const increaseMonth = () => {
  const currentIndex = months.value.indexOf(monthlyHourlyGastoSelectedMonth.value!);
  if (currentIndex > 0) {
    monthlyHourlyGastoSelectedMonth$.next(months.value[currentIndex - 1]);
  }
};

const decreaseMonth = () => {
  const currentIndex = months.value.indexOf(monthlyHourlyGastoSelectedMonth.value!);
  if (currentIndex < months.value.length - 1) {
    monthlyHourlyGastoSelectedMonth$.next(months.value[currentIndex + 1]);
  }
};

interface DataItem {
  fecha: string;
  hora: string;
  gasto_total: number;
  consumo_kWh: string;
}

const parseNumber = (value: string | undefined): number => {
  if (!value) return 0;
  return parseFloat(value.replace(',', '.')) || 0;
};

const chartData = computed(() => {
  if (!props.data || !Array.isArray(props.data)) {
    return { labels: [], datasets: [] };
  }

  const monthData = (props.data as DataItem[]).filter((item: DataItem) => item?.fecha?.slice(0, 7) === monthlyHourlyGastoSelectedMonth.value);
  const groupedGasto = monthData.reduce((acc, item) => {
    if (!item?.hora) return acc;
    const hour = item.hora;
    if (!acc[hour]) {
      acc[hour] = 0;
    }
    acc[hour] += item?.gasto_total || 0;
    return acc;
  }, {} as Record<string, number>);

  const groupedConsumo = monthData.reduce((acc, item) => {
    if (!item?.hora) return acc;
    const hour = item.hora;
    if (!acc[hour]) {
      acc[hour] = 0;
    }
    acc[hour] += parseNumber(item.consumo_kWh);
    return acc;
  }, {} as Record<string, number>);

  const sortedHours = Object.keys(groupedGasto).sort((a, b) => parseInt(a) - parseInt(b));

  return {
    labels: sortedHours,
    datasets: [
      {
        label: 'Gasto Total (€)',
        backgroundColor: chartColors.value.backgroundColor,
        borderColor: chartColors.value.borderColor,
        fill: false,
        data: sortedHours.map(hour => groupedGasto[hour]),
        yAxisID: 'y-left', // Asocia esta línea al eje Y izquierdo
      },
      {
        label: 'Consumo (kWh)',
        backgroundColor: '#ff9800',
        borderColor: '#ff9800',
        fill: false,
        data: sortedHours.map(hour => groupedConsumo[hour]),
        yAxisID: 'y-right', // Asocia esta línea al eje Y derecho
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
      yAxisID: 'y-left',
      title: {
        display: true,
        text: 'Gasto Total (€)',
      },
      position: 'left',
    },
    'y-right': {
      title: {
        display: true,
        text: 'Consumo (kWh)',
      },
      position: 'right',
      grid: {
        drawOnChartArea: false, // Evita que las líneas de la cuadrícula se superpongan
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      position: 'top' as const,
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem: any) {
          const label = tooltipItem.dataset.label || '';
          const value = tooltipItem.raw.toFixed(4);
          return `${label}: ${value}`;
        },
      },
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