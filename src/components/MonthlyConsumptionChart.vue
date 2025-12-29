<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4" class="d-flex align-center">
        <v-btn icon @click="decreaseMonth">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-select
          v-model="monthlyConsumptionSelectedMonth"
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
import { monthlyConsumptionSelectedMonth$ } from '@/state/SharedState.ts'; // Importa el estado compartido
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
import { PropType } from 'vue';

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
    type: Array as PropType<DataItem[]>,
    required: true,
  },
});

const monthlyConsumptionSelectedMonth = ref<string | null>(null); // Estado local para sincronizar con el BehaviorSubject
const months = computed(() => {
  if (!props.data || !Array.isArray(props.data)) return [];
  return [...new Set((props.data as DataItem[]).filter(item => item?.fecha).map((item: DataItem) => item.fecha.slice(0, 7)))];
});

// Suscripción al estado compartido
let subscription: Subscription | null = null;
onMounted(() => {
  subscription = monthlyConsumptionSelectedMonth$.subscribe((month: string | null) => {
    monthlyConsumptionSelectedMonth.value = month;
  });

  // Inicializa el valor si no está definido
  if (!monthlyConsumptionSelectedMonth$.value && months.value.length > 0) {
    monthlyConsumptionSelectedMonth$.next(months.value[0]);
  }
});

onUnmounted(() => {
  subscription?.unsubscribe();
});

// Actualiza el estado compartido cuando cambie monthlyConsumptionSelectedMonth
watch(monthlyConsumptionSelectedMonth, (newMonth) => {
  monthlyConsumptionSelectedMonth$.next(newMonth);
});

const increaseMonth = () => {
  const currentIndex = months.value.indexOf(monthlyConsumptionSelectedMonth.value!);
  if (currentIndex > 0) {
    monthlyConsumptionSelectedMonth$.next(months.value[currentIndex - 1]);
  }
};

const decreaseMonth = () => {
  const currentIndex = months.value.indexOf(monthlyConsumptionSelectedMonth.value!);
  if (currentIndex < months.value.length - 1) {
    monthlyConsumptionSelectedMonth$.next(months.value[currentIndex + 1]);
  }
};

interface DataItem {
  fecha: string;
  hora: string;
  consumo_kWh: string;
  energiaVertida_kWh: string;
  energiaGenerada_kWh: string;
  energiaAutoconsumida_kWh: string;
}

const parseNumber = (value: string | undefined): number => {
  if (!value) return 0;
  return parseFloat(value.replace(',', '.')) || 0;
};

const chartData = computed(() => {
  if (!props.data || !Array.isArray(props.data)) {
    return { labels: [], datasets: [] };
  }

  const monthData = (props.data as DataItem[]).filter((item: DataItem) => item?.fecha?.slice(0, 7) === monthlyConsumptionSelectedMonth.value);
  const groupedData = monthData.reduce((acc, item) => {
    if (!item?.fecha) return acc;
    const day = item.fecha.slice(8, 10);
    if (!acc[day]) {
      acc[day] = {
        consumo: 0,
        energiaVertida: 0,
        energiaGenerada: 0,
        energiaAutoconsumida: 0,
      };
    }
    acc[day].consumo += parseNumber(item.consumo_kWh);
    acc[day].energiaVertida += parseNumber(item.energiaVertida_kWh);
    acc[day].energiaGenerada += parseNumber(item.energiaGenerada_kWh);
    acc[day].energiaAutoconsumida += parseNumber(item.energiaAutoconsumida_kWh);
    return acc;
  }, {} as Record<string, { consumo: number; energiaVertida: number; energiaGenerada: number; energiaAutoconsumida: number }>);

  const sortedDays = Object.keys(groupedData).sort((a, b) => parseInt(a) - parseInt(b));

  const pointBackgroundColors = sortedDays.map(day => {
    const date = new Date(`${monthlyConsumptionSelectedMonth.value}-${day}`);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 6) {
      return 'blue'; // Sábado
    } else if (dayOfWeek === 0) {
      return 'red'; // Domingo
    } else {
      return chartColors.value.backgroundColor; // Otros días
    }
  });

  return {
    labels: sortedDays,
    datasets: [
      {
        label: 'Consumo (kWh)',
        backgroundColor: chartColors.value.backgroundColor,
        borderColor: chartColors.value.borderColor,
        fill: false,
        data: sortedDays.map(day => groupedData[day].consumo),
        pointBackgroundColor: pointBackgroundColors,
      },
      {
        label: 'Energía Vertida (kWh)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        fill: false,
        data: sortedDays.map(day => groupedData[day].energiaVertida),
      },
      {
        label: 'Energía Generada (kWh)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        fill: false,
        data: sortedDays.map(day => groupedData[day].energiaGenerada),
      },
      {
        label: 'Energía Autoconsumida (kWh)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
        data: sortedDays.map(day => groupedData[day].energiaAutoconsumida),
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
        text: 'Día',
      },
      ticks: {
        color: (c: { tick: { label: string } }) => {
          const day = parseInt(c.tick.label);
          const date = new Date(`${monthlyConsumptionSelectedMonth.value}-${day}`);
          const dayOfWeek = date.getDay();
          if (dayOfWeek === 6) {
            return 'blue'; // Azul para sábado
          } else if (dayOfWeek === 0) {
            return 'red'; // Rojo para domingo
          } else {
            return 'grey'; // Otros días
          }
        },
        autoSkip: false,
        maxRotation: 0,
        minRotation: 0,
      },
    },
    y: {
      title: {
        display: true,
        text: 'Energía (kWh)',
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