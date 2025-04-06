<template>
  <!-- <TechStack :tech-list="techList" /> -->
  <JsonImporter @dataImported="handleDataImported" />
  <template v-if="consumptionData.length > 0">
    <CardWithOffcanvas
    title="Consumo Diario"
    offcanvasTitle="Monthly Consumption"
    :bodyComponent="DailyConsumptionChart"
    :offcanvasComponent="DailyConsumptionSummary"
    :footerComponent="DailyConsumptionSummary"
    :data="consumptionData"
    @footerAction="handleFooterAction"
    />
    <CardWithOffcanvas
    title="Consumo mensual por día"
    offcanvasTitle="Monthly Consumption"
    :bodyComponent="MonthlyConsumptionChart"
    :offcanvasComponent="DailyConsumptionSummary"
    :footerComponent="MonthlyConsumptionSummary"
    :data="consumptionData"
    @footerAction="handleFooterAction"
    />
    <CardWithOffcanvas
    title="Consumo mensual por hora"
    offcanvasTitle="Monthly Consumption"
    :bodyComponent="MonthlyHourlyConsumptionChart"
    :offcanvasComponent="DailyConsumptionSummary"
    :footerComponent="MonthlyHourlyConsumptionSummary"
    :data="consumptionData"
    @footerAction="handleFooterAction"
    />
    <DateRangeSelector :data="consumptionData"
      @dateRangeSelected="handleDateRangeSelected" @startDateChanged="handleDataChanged"
      @endDateChanged="handleDataChanged" />
      <template v-if="selectedDateRange !== null">
        <TotalGasto :data="selectedDateRange" />
        <CardWithOffcanvas
          title="Gasto diario"
          offcanvasTitle="Monthly Consumption"
          :bodyComponent="DailyGastoChart"
          :offcanvasComponent="DailyConsumptionSummary"
          :footerComponent="DailyGastoSummary"
          :data="selectedDateRange"
          @footerAction="handleFooterAction"
        />
        <CardWithOffcanvas
          title="Gasto mensual por día"
          offcanvasTitle="Monthly Consumption"
          :bodyComponent="MonthlyGastoChart"
          :offcanvasComponent="DailyConsumptionSummary"
          :footerComponent="MonthlyGastoSummary"
          :data="selectedDateRange"
          @footerAction="handleFooterAction"
        />
        <CardWithOffcanvas
          title="Gasto mensual por hora"
          offcanvasTitle="Monthly Consumption"
          :bodyComponent="MonthlyHourlyGastoChart"
          :offcanvasComponent="DailyConsumptionSummary"
          :footerComponent="MonthlyHourlyGastoSummary"
          :data="selectedDateRange"
          @footerAction="handleFooterAction"
        />
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
import DailyConsumptionSummary from '@/components/summaries/DailyConsumptionSummary.vue';
import MonthlyConsumptionSummary from '@/components/summaries/MonthlyConsumptionSummary.vue';
import DailyGastoSummary from '@/components/summaries/DailyGastoSummary.vue';
import MonthlyHourlyConsumptionSummary from '@/components/summaries/MonthlyHourlyConsumptionSummary.vue';
import MonthlyGastoSummary from '@/components/summaries/MonthlyGastoSummary.vue';
import MonthlyHourlyGastoSummary from '@/components/summaries/MonthlyHourlyGastoSummary.vue';


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

const handleFooterAction = () => {
  console.log('Footer action triggered');
};

</script>
