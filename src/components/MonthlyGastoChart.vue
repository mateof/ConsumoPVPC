<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4" class="d-flex align-center">
        <v-btn icon @click="decreaseMonth">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-select
          v-model="monthlyGastoSelectedMonth"
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
import { monthlyGastoSelectedMonth$ } from '@/state/SharedState.ts'; // Importa el estado compartido
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

const monthlyGastoSelectedMonth = ref<string | null>(null); // Estado local para sincronizar con el BehaviorSubject
const months = computed(() => [...new Set((props.data as DataItem[]).map((item: DataItem) => item.fecha.slice(0, 7)))]);

// Suscripción al estado compartido
let subscription: Subscription | null = null;
onMounted(() => {
  subscription = monthlyGastoSelectedMonth$.subscribe((month) => {
    monthlyGastoSelectedMonth.value = month;
  });

  // Inicializa el valor si no está definido
  if (!monthlyGastoSelectedMonth$.value && months.value.length > 0) {
    monthlyGastoSelectedMonth$.next(months.value[0]);
  }
});

onUnmounted(() => {
  subscription?.unsubscribe();
});

// Actualiza el estado compartido cuando cambie monthlyGastoSelectedMonth
watch(monthlyGastoSelectedMonth, (newMonth) => {
  monthlyGastoSelectedMonth$.next(newMonth);
});

const increaseMonth = () => {
  const currentIndex = months.value.indexOf(monthlyGastoSelectedMonth.value!);
  if (currentIndex > 0) {
    monthlyGastoSelectedMonth$.next(months.value[currentIndex - 1]);
  }
};

const decreaseMonth = () => {
  const currentIndex = months.value.indexOf(monthlyGastoSelectedMonth.value!);
  if (currentIndex < months.value.length - 1) {
    monthlyGastoSelectedMonth$.next(months.value[currentIndex + 1]);
  }
};

interface DataItem {
  fecha: string;
  hora: string;
  gasto_total: number;
  consumo_kWh: string;
  metodoObtencion: string;
}

const chartData = computed(() => {
  const monthData = (props.data as DataItem[]).filter((item: DataItem) => item.fecha.slice(0, 7) === monthlyGastoSelectedMonth.value);
  const dailyGasto = monthData.reduce((acc: { [key: string]: number }, item: DataItem) => {
    const day = item.fecha.slice(8, 10);
    if (!acc[day]) {
      acc[day] = 0;
    }
    acc[day] += item.gasto_total;
    return acc;
  }, {});

  const dailyConsumo = monthData.reduce((acc: { [key: string]: number }, item: DataItem) => {
    const day = item.fecha.slice(8, 10);
    if (!acc[day]) {
      acc[day] = 0;
    }
    acc[day] += parseFloat(item.consumo_kWh.replace(',', '.'));
    return acc;
  }, {});

  const sortedDailyGasto = Object.keys(dailyGasto).sort((a, b) => parseInt(a) - parseInt(b));

  return {
    labels: sortedDailyGasto,
    datasets: [
      {
        label: 'Gasto Total (€)',
        backgroundColor: chartColors.value.backgroundColor,
        borderColor: chartColors.value.borderColor,
        fill: false,
        data: sortedDailyGasto.map(day => dailyGasto[day]),
        yAxisID: 'y-left', // Asocia esta línea al eje Y izquierdo
      },
      {
        label: 'Consumo (kWh)',
        backgroundColor: '#ff9800',
        borderColor: '#ff9800',
        fill: false,
        data: sortedDailyGasto.map(day => dailyConsumo[day]),
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
        text: 'Día del Mes',
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
          const value = tooltipItem.raw;
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
}
</style>