<template>
  <!-- <TechStack :tech-list="techList" /> -->
  <JsonImporter @dataImported="handleDataImported" />
  <template v-if="consumptionData.length > 0">
    <DailyConsumptionChart :data="consumptionData" />
    <MonthlyConsumptionChart :data="consumptionData" />
    <MonthlyHourlyConsumptionChart :data="consumptionData" />
    <DateRangeSelector :data="consumptionData"
      @dateRangeSelected="handleDateRangeSelected" @startDateChanged="handleDataChanged"
      @endDateChanged="handleDataChanged" />
      <template v-if="selectedDateRange !== null">
        <TotalGasto :data="selectedDateRange" />
        <DailyGastoChart :data="selectedDateRange" />
        <MonthlyGastoChart :data="selectedDateRange" />
        <MonthlyHourlyGastoChart :data="selectedDateRange" />
      </template>
  </template>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { chartColors } from '@/config/chartColors';
import JsonImporter from '@/components/JsonImporter.vue';
import DailyConsumptionChart from '@/components/DailyConsumptionChart.vue';
import MonthlyConsumptionChart from '@/components/MonthlyConsumptionChart.vue';
import MonthlyHourlyConsumptionChart from '@/components/MonthlyHourlyConsumptionChart.vue';
import TotalGasto from '@/components/TotalGasto.vue';
import DailyGastoChart from '@/components/DailyGastoChart.vue';
import MonthlyGastoChart from '@/components/MonthlyGastoChart.vue';
import MonthlyHourlyGastoChart from '@/components/MonthlyHourlyGastoChart.vue';


const techList: Array<{
  name: string;
  path: string | null;
}> = [
    { name: 'ESLint', path: '/eslint.svg' },
    { name: 'Prettier', path: '/prettier.svg' },
    { name: 'Tailwind CSS', path: '/tailwind.svg' },
    { name: 'SASS', path: '/sass.svg' },
    { name: 'Vitest', path: '/vitest.svg' },
    { name: 'Testing Library', path: '/testing-library.svg' },
    { name: 'Pinia', path: '/pinia.svg' },
    { name: 'Vue Query', path: '/vue-query.svg' },
    { name: 'Husky 🐶', path: null },
    { name: 'Vue Router', path: null },
    { name: 'Auto imports: Components', path: null },
    {
      name: 'Auto imports: API from Vitest, Pinia, Vue and Vue Router',
      path: null,
    },
  ];

const consumptionData = ref([]);
const selectedDateRange = ref(null);
const chartRef = ref(null);

const handleDataImported = (data: any) => {
  consumptionData.value = data;
};
const handleDateRangeSelected = (dateRange: any) => {
  selectedDateRange.value = dateRange;
  // Handle the date range selection logic here
  console.log('Date range selected:', dateRange);
};

const handleDataChanged = (date: any) => {
  selectedDateRange.value = null;
};

watch(chartColors, () => {
  if (chartRef.value) {
    chartRef.value.update(); // Fuerza la actualización del gráfico
  }
});

</script>
