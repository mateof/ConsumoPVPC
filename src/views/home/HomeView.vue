<template>
  <JsonImporter @dataImported="handleDataImported" />
  <template v-if="consumptionData.length > 0">
    <CardWithOffcanvas title="Consumo Diario" offcanvasTitle="Información sobre consumo diario"
      :bodyComponent="DailyConsumptionChart" :offcanvasComponent="DailyConsumoInfo"
      :footerComponent="DailyConsumptionSummary" :data="consumptionData" @footerAction="handleFooterAction" />
    <CardWithOffcanvas title="Consumo mensual por día" offcanvasTitle="Información sobre consumo mensual por día"
      :bodyComponent="MonthlyConsumptionChart" :offcanvasComponent="DailyConsumoInfo"
      :footerComponent="MonthlyConsumptionSummary" :data="consumptionData" @footerAction="handleFooterAction" />
    <CardWithOffcanvas title="Consumo mensual por hora" offcanvasTitle="Información sobre consumo mensual por hora"
      :bodyComponent="MonthlyHourlyConsumptionChart" :offcanvasComponent="DailyConsumoInfo"
      :footerComponent="MonthlyHourlyConsumptionSummary" :data="consumptionData" @footerAction="handleFooterAction" />
    <div class="calculo-gasto-container">
      <h2 class="calculo-gasto-title">Cálculo de Gasto</h2>
      <DateRangeSelector :data="consumptionData" @dateRangeSelected="handleDateRangeSelected"
        @startDateChanged="handleDataChanged" @endDateChanged="handleDataChanged" />

      <template v-if="selectedDateRange !== null">
        <TotalGasto :data="selectedDateRange" />
        <CardWithOffcanvas title="Gasto diario" offcanvasTitle="Gasto diario por horas" :bodyComponent="DailyGastoChart"
          :offcanvasComponent="DailyGastoInfo" :footerComponent="DailyGastoSummary" :data="selectedDateRange"
          @footerAction="handleFooterAction" customClass="vcard-gasto" />
        <CardWithOffcanvas title="Gasto mensual por día" customClass="vcard-gasto" offcanvasTitle="Gasto mensual"
          :bodyComponent="MonthlyGastoChart" :offcanvasComponent="GastoMensualInfo"
          :footerComponent="MonthlyGastoSummary" :data="selectedDateRange" @footerAction="handleFooterAction" />
        <CardWithOffcanvas title="Gasto mensual por hora" customClass="vcard-gasto" offcanvasTitle="Gasto mensual por hora"
          :bodyComponent="MonthlyHourlyGastoChart" :offcanvasComponent="GastoMensualInfo"
          :footerComponent="MonthlyHourlyGastoSummary" :data="selectedDateRange" @footerAction="handleFooterAction" />
      </template>
    </div>
  </template>
</template>

<script lang="ts" setup>
import { ref, watch } from 'vue';
import type { Ref } from 'vue';
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
import DailyConsumoInfo from '@/components/info/DailyConsumoInfo.vue';
import DailyGastoInfo from '@/components/info/DailyGastoInfo.vue';
import GastoMensualInfo from '@/components/info/GastoMensualInfo.vue';
import DateRangeSelector from '@/components/DateRangeSelector.vue';

const consumptionData = ref([]);
const selectedDateRange = ref(null);


const chartRef: Ref<{ update: () => void } | null> = ref(null);

const handleDataImported = (data: any) => {
  consumptionData.value = data;
};
const handleDateRangeSelected = (dateRange: any) => {
  selectedDateRange.value = dateRange;
  console.log('Date range selected:', dateRange);
};

const handleDataChanged = (date: any) => {
  selectedDateRange.value = null;
};

watch(chartColors, () => {
  if (chartRef.value) {
    chartRef.value.update();
  }
});

const handleFooterAction = () => {
  console.log('Footer action triggered');
};
</script>

<style scoped>
.calculo-gasto-container {
  margin-top: 2rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid rgba(37, 99, 235, 0.1);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(37, 99, 235, 0.08);
  position: relative;
  overflow: hidden;
}

.calculo-gasto-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #2563eb 0%, #10b981 100%);
}

.calculo-gasto-title {
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  letter-spacing: -0.5px;
}

.calculo-gasto-title::before {
  content: '\F0175';
  font-family: 'Material Design Icons';
  color: #2563eb;
  font-size: 1.75rem;
}

@media (min-width: 600px) {
  .calculo-gasto-container {
    margin-left: 2%;
    margin-right: 2%;
    padding: 2rem;
  }
}

@media (min-width: 1024px) {
  .calculo-gasto-container {
    margin-left: 4%;
    margin-right: 4%;
  }
}

:deep(.vcard-gasto) {
  margin-left: 2%;
  margin-right: 2%;
}

@media (min-width: 768px) {
  :deep(.vcard-gasto) {
    margin-left: 4%;
    margin-right: 4%;
  }
}
</style>
