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
  consumo_kWh: string;
}

const chartData = computed(() => {
  const monthData = (props.data as DataItem[]).filter((item: DataItem) => item.fecha.slice(0, 7) === selectedMonth.value);
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
        backgroundColor: '#f87979',
        borderColor: '#f87979',
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
  background-color: white;
}
</style>