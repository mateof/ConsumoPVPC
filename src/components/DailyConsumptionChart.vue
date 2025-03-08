<template>
  <v-container>
    <v-row>
      <v-col cols="12" md="4" class="d-flex align-center">
        <v-btn icon @click="decreaseDay">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-select
          v-model="selectedDay"
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

const selectedDay = ref<string>((props.data as DataItem[]).length > 0 ? (props.data as DataItem[])[0].fecha : '');
const days = computed(() => [...new Set((props.data as DataItem[]).map((item: DataItem) => item.fecha))]);

interface DataItem {
  fecha: string;
  hora: string;
  consumo_kWh: string;
  metodoObtencion: string;
}

const chartData = computed(() => {
  const dayData = (props.data as DataItem[]).filter((item: DataItem) => item.fecha === selectedDay.value);
  const sortedDayData = dayData.sort((a, b) => a.hora.localeCompare(b.hora));
  let data =  {
    labels: sortedDayData.map(item => item.hora),
    datasets: [
      {
        label: 'Consumo (kWh)',
        backgroundColor: '#f87979',
        borderColor: '#f87979',
        fill: false,
        data: sortedDayData.map(item => parseFloat(item.consumo_kWh.replace(',', '.'))),
        metodo: sortedDayData.map(item => item.metodoObtencion)
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
    tooltip: {
        callbacks: {
            label: function(tooltipItem: any) {
                const label = tooltipItem.dataset.label || '';
                const value = tooltipItem.raw;
                const metodoObtencion = tooltipItem.dataset.metodo[tooltipItem.dataIndex];
                return `${label}: ${value} kWh (Método: ${metodoObtencion})`;
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

const increaseDay = () => {
  const currentIndex = days.value.indexOf(selectedDay.value);
  if (currentIndex > 0) {
    selectedDay.value = days.value[currentIndex - 1];
  }
};

const decreaseDay = () => {
  const currentIndex = days.value.indexOf(selectedDay.value);
  if (currentIndex < days.value.length - 1) {
    selectedDay.value = days.value[currentIndex + 1];
  }
};

watch((): DataItem[] => props.data as DataItem[], (newData: DataItem[]) => {
  if (newData.length > 0) {
    selectedDay.value = newData[0].fecha;
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