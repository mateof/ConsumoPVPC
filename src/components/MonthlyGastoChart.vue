<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4" class="d-flex align-center">
        <v-btn icon @click="decreaseMonth">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-select
          v-model="selectedMonth"
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
import { ref, computed, watch } from 'vue';
import { Line } from 'vue-chartjs';
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

const selectedMonth = ref<string>((props.data as DataItem[]).length > 0 ? (props.data as DataItem[])[0].fecha.slice(0, 7) : '');
const months = computed(() => [...new Set((props.data as DataItem[]).map((item: DataItem) => item.fecha.slice(0, 7)))]);

interface DataItem {
  fecha: string;
  hora: string;
  gasto_total: number;
  metodoObtencion: string;
}

const chartData = computed(() => {
  const monthData = (props.data as DataItem[]).filter((item: DataItem) => item.fecha.slice(0, 7) === selectedMonth.value);
  const dailyGasto = monthData.reduce((acc: { [key: string]: number }, item: DataItem) => {
    const day = item.fecha.slice(8, 10);
    if (!acc[day]) {
      acc[day] = 0;
    }
    acc[day] += item.gasto_total;
    return acc;
  }, {});

//   const sortedDailyGasto = Object.keys(dailyGasto).sort().map(date => ({
//     fecha: date,
//     gasto_total: dailyGasto[date],
//   }));
  const sortedDailyGasto = Object.keys(dailyGasto).sort((a, b) => parseInt(a) - parseInt(b));

  const pointBackgroundColors = sortedDailyGasto.map(day => {
    const date = new Date(`${selectedMonth.value}-${day}`);
    const dayOfWeek = date.getDay();
    if (dayOfWeek === 6) {
      return 'blue'; // Sábado
    } else if (dayOfWeek === 0) {
      return 'red'; // Domingo
    } else {
      return '#f87979'; // Otros días
    }
  });
  let data =  {
    labels: sortedDailyGasto,
    datasets: [
      {
        label: 'Gasto Total (€)',
        backgroundColor: chartColors.value.backgroundColor,
        borderColor: chartColors.value.borderColor,
        fill: false,
        data: sortedDailyGasto.map(day => dailyGasto[day]),
      },
    ],
  };
  return data;
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
      ticks: {
        color: (c: { tick: { label: string } }) => {
          const day = parseInt(c.tick.label);
          const date = new Date(`${selectedMonth.value}-${day}`);
          const dayOfWeek = date.getDay();
          if (dayOfWeek === 6) {
            return "blue"; // Azul para sábado
          } else if (dayOfWeek === 0) {
            return "red"; // Rojo para domingo
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
        text: 'Gasto Total (€)',
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
        label: function(tooltipItem: any) {
          const label = tooltipItem.dataset.label || '';
          const value = tooltipItem.raw;
          return `${label}: ${value} €`;
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

const increaseMonth = () => {
  const currentIndex = months.value.indexOf(selectedMonth.value);
  if (currentIndex > 0) {
    selectedMonth.value = months.value[currentIndex - 1];
  }
};

const decreaseMonth = () => {
  const currentIndex = months.value.indexOf(selectedMonth.value);
  if (currentIndex < months.value.length - 1) {
    selectedMonth.value = months.value[currentIndex + 1];
  }
};

watch((): DataItem[] => props.data as DataItem[], (newData: DataItem[]) => {
  if (newData.length > 0) {
    selectedMonth.value = newData[0].fecha.slice(0, 7);
  }
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