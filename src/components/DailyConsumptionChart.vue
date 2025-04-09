<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4" class="d-flex align-center">
        <v-btn icon @click="decreaseDay">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-select
          v-model="consumptionSelectedDay"
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
import { consumptionSelectedDay$ } from '@/state/SharedState.ts'; // Importa el Subject
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

const consumptionSelectedDay = ref<string | null>(null);
const days = computed(() => [...new Set((props.data as DataItem[]).map((item: DataItem) => item.fecha))]);

// Suscríbete a los cambios en consumptionSelectedDay$
let subscription: Subscription | null = null;
onMounted(() => {
  subscription = consumptionSelectedDay$.subscribe((day) => {
    consumptionSelectedDay.value = day;
  });

  // Inicializa el valor si no está definido
  if (!consumptionSelectedDay$.value && days.value.length > 0) {
    consumptionSelectedDay$.next(days.value[0]);
  }
});

onUnmounted(() => {
  subscription?.unsubscribe();
});

// Actualiza el Subject cuando cambie consumptionSelectedDay
watch(consumptionSelectedDay, (newDay) => {
  consumptionSelectedDay$.next(newDay);
});

const increaseDay = () => {
  const currentIndex = days.value.indexOf(consumptionSelectedDay.value!);
  if (currentIndex > 0) {
    consumptionSelectedDay$.next(days.value[currentIndex - 1]);
  }
};

const decreaseDay = () => {
  const currentIndex = days.value.indexOf(consumptionSelectedDay.value!);
  if (currentIndex < days.value.length - 1) {
    consumptionSelectedDay$.next(days.value[currentIndex + 1]);
  }
};

interface DataItem {
  fecha: string;
  hora: string;
  consumo_kWh: string;
  energiaVertida_kWh: string;
  energiaGenerada_kWh: string;
  energiaAutoconsumida_kWh: string;
  metodoObtencion: string;
}

const chartData = computed(() => {
  const dayData = (props.data as DataItem[]).filter((item: DataItem) => item.fecha === consumptionSelectedDay.value);
  const sortedDayData = dayData.sort((a, b) => a.hora.localeCompare(b.hora));

  const pointBackgroundColors = sortedDayData.map(item =>
    item.metodoObtencion === 'Real' ? chartColors.value.backgroundColor : 'blue'
  );

  return {
    labels: sortedDayData.map(item => item.hora),
    datasets: [
      {
        label: 'Consumo (kWh)',
        backgroundColor: pointBackgroundColors,
        borderColor: chartColors.value.borderColor,
        fill: false,
        data: sortedDayData.map(item => parseFloat(item.consumo_kWh.replace(',', '.'))),
        metodo: sortedDayData.map(item => item.metodoObtencion),
        pointBackgroundColor: pointBackgroundColors,
      },
      {
        label: 'Energía Vertida (kWh)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        fill: false,
        data: sortedDayData.map(item => parseFloat(item.energiaVertida_kWh.replace(',', '.'))),
      },
      {
        label: 'Energía Generada (kWh)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        fill: false,
        data: sortedDayData.map(item => parseFloat(item.energiaGenerada_kWh.replace(',', '.'))),
      },
      {
        label: 'Energía Autoconsumida (kWh)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
        data: sortedDayData.map(item => parseFloat(item.energiaAutoconsumida_kWh.replace(',', '.'))),
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
        text: 'Energía (kWh)',
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
          return metodoObtencion
            ? `${label}: ${value} kWh (Método: ${metodoObtencion})`
            : `${label}: ${value} kWh`;
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