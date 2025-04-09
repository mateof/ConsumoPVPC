<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4" class="d-flex align-center">
        <v-btn icon @click="decreaseDay">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-select
          v-model="dailyGastoSelectedDay"
          :items="days"
          label="Select Day"
          class="mx-2"
        ></v-select>
        <v-btn icon @click="increaseDay">
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
import { dailyGastoSelectedDay$ } from '@/state/SharedState.ts'; // Importa el estado compartido
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

const dailyGastoSelectedDay = ref<string | null>(null); // Estado local para sincronizar con el BehaviorSubject
const days = computed(() => [...new Set((props.data as DataItem[]).map((item: DataItem) => item.fecha))]);

// Suscripción al estado compartido
let subscription: Subscription | null = null;
onMounted(() => {
  subscription = dailyGastoSelectedDay$.subscribe((day) => {
    dailyGastoSelectedDay.value = day;
  });

  // Inicializa el valor si no está definido
  if (!dailyGastoSelectedDay$.value && days.value.length > 0) {
    dailyGastoSelectedDay$.next(days.value[0]);
  }
});

onUnmounted(() => {
  subscription?.unsubscribe();
});

// Actualiza el estado compartido cuando cambie dailyGastoSelectedDay
watch(dailyGastoSelectedDay, (newDay) => {
  dailyGastoSelectedDay$.next(newDay);
});

const increaseDay = () => {
  const currentIndex = days.value.indexOf(dailyGastoSelectedDay.value!);
  if (currentIndex > 0) {
    dailyGastoSelectedDay$.next(days.value[currentIndex - 1]);
  }
};

const decreaseDay = () => {
  const currentIndex = days.value.indexOf(dailyGastoSelectedDay.value!);
  if (currentIndex < days.value.length - 1) {
    dailyGastoSelectedDay$.next(days.value[currentIndex + 1]);
  }
};

interface DataItem {
  fecha: string;
  hora: string;
  gasto_total: number;
  consumo_kWh: string;
  metodoObtencion: string;
  precio_kwh: number;
}

const chartData = computed(() => {
  const dayData = (props.data as DataItem[]).filter((item: DataItem) => item.fecha === dailyGastoSelectedDay.value);
  const sortedDayData = dayData.sort((a, b) => a.hora.localeCompare(b.hora));

  return {
    labels: sortedDayData.map(item => item.hora),
    datasets: [
      {
        label: 'Gasto Total (€)',
        backgroundColor: chartColors.value.backgroundColor,
        borderColor: chartColors.value.borderColor,
        fill: false,
        data: sortedDayData.map(item => item.gasto_total),
        metodo: sortedDayData.map(item => item.metodoObtencion),
        precioKwh: sortedDayData.map(item => item.precio_kwh),
        yAxisID: 'y-left', // Asocia esta línea al eje Y izquierdo
      },{
        label: 'Precio por kWh (€)',
        backgroundColor: '#4caf50',
        borderColor: '#4caf50',
        fill: false,
        data: sortedDayData.map(item => item.precio_kwh),
        yAxisID: 'y-left', // Asocia esta línea al eje Y izquierdo
      },
      {
        label: 'Consumo (kWh)',
        backgroundColor: '#ff9800',
        borderColor: '#ff9800',
        fill: false,
        data: sortedDayData.map(item => parseFloat(item.consumo_kWh.replace(',', '.'))),
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
        text: 'Gasto Total (€) / Precio por kWh (€)',
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
          const metodoObtencion = tooltipItem.dataset.metodo?.[tooltipItem.dataIndex];
          const precioKwh = tooltipItem.dataset.precioKwh?.[tooltipItem.dataIndex];
          return (metodoObtencion
            ? `${label}: ${value} (Método: ${metodoObtencion})`
            : `${label}: ${value}`) + (precioKwh ? ` (Precio Kwh: ${precioKwh.toFixed(4)})` : '');
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