<template>
  <v-container>
    <v-row>
      <!-- Selector de región -->
      <v-col cols="12" md="4">
        <v-select
          v-model="region"
          :items="regionOptions"
          :item-props="itemProps"
          item-text="text"
          item-value="value"
          label="Región"
          @update:model-value="updateRegion"
        ></v-select>
      </v-col>
    </v-row>
    <v-row>
      <v-col cols="12" md="4">
        <v-select
          v-model="startDate"
          :items="availableDates"
          label="Fecha Desde"
          @update:model-value="updateStartDate"
        ></v-select>
      </v-col>
      <v-col cols="12" md="4">
        <v-select
          v-model="endDate"
          :items="availableEndDates"
          label="Fecha Hasta"
          :disabled="!startDate"
          @update:model-value="updateEndDate"
        ></v-select>
      </v-col>
      <v-col cols="12" md="4" v-if="startDate && endDate">
        <v-btn @click="fetchAndEmitData" color="primary">
          Mostrar Datos
        </v-btn>
      </v-col>
    </v-row>
    <v-overlay :value="loading" style="z-index: 1001;">
      <v-progress-circular
        :size="70"
        :width="7"
        color="purple"
        indeterminate
      ></v-progress-circular>
    </v-overlay>
  </v-container>
  <div ref="gastoTotal"></div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { fetchPVPCData } from '../services/Esios';
import { PvpcDataHelper } from '../models/PvpcData';
import { getPvpcData } from '../services/DatabaseService';
import { showSpinner$, startDate$, endDate$, region$ } from '@/state/SharedState.ts';


interface DataItem {
  fecha: string;
  hora: string;
  consumo_kWh: string;
  metodoObtencion: string;
  metodoObtencionPrecio: string;
  precio_kwh?: number;
  gasto_total?: number;
}

const props = defineProps({
  data: {
    type: Array as () => DataItem[],
    required: true,
  },
});


const emit = defineEmits(['dateRangeSelected', 'startDateChanged', 'endDateChanged', 'regionChanged']);

// Opciones de región
const regionOptions = [
  { text: 'Península, Baleares y Canarias', value: 'PBC' },
  { text: 'Ceuta y Melilla', value: 'CYM' },
];

function itemProps (item: Record<string, any>) {
    return {
      title: item.value,
      subtitle: item.text,
    }
  }
const region = ref<string>('PBC'); // Valor por defecto

onMounted(() => {
  region$.next(region.value);
});

// Fechas disponibles
const availableDates = computed(() =>
  [...new Set(props.data.map((item: DataItem) => item.fecha))]
    .sort((a, b) => b.localeCompare(a))
);

const startDate = ref<string | null>(null);
const endDate = ref<string | null>(null);
const loading = ref(false);
const gastoTotal = ref<HTMLElement | null>(null);

const availableEndDates = computed(() => {
  if (!startDate.value) return [];
  return availableDates.value.filter(date => startDate.value && date >= startDate.value)
    .sort((a, b) => b.localeCompare(a));
});

// Actualiza la región seleccionada
const updateRegion = () => {
  emit('regionChanged', region.value);
  region$.next(region.value);
};

// Actualiza la fecha de inicio
const updateStartDate = () => {
  if (endDate.value && startDate.value && endDate.value < startDate.value) {
    endDate.value = null;
  }
  emit('startDateChanged', startDate.value);
  startDate$.next(startDate.value);
};

// Actualiza la fecha de fin
const updateEndDate = () => {
  emit('endDateChanged', endDate.value);
  endDate$.next(endDate.value);
};

const parseFecha = (fecha: string): string => {
  const [dia, mes, anio] = fecha.split('/');
  return `${anio}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;
};

const toUTC = (datetime: any) => {
  const myDate = (typeof datetime === 'number')
    ? new Date(datetime)
    : datetime;

  if (!myDate || (typeof myDate.getTime !== 'function')) {
    return 0;
  }

  const getUTC = myDate.getTime();
  const offset = myDate.getTimezoneOffset() * 60000; // It's en minutos, así que se convierte a ms
  return getUTC - offset; // UTC - OFFSET
};

const fetchAndEmitData = async () => {
  
  if (startDate.value && endDate.value) {
    showSpinner$.next(true);
    loading.value = true;
    const start = new Date(startDate.value);
    const end = new Date(endDate.value);
    const dates = [];

    for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(toUTC(d)).toISOString().split('T')[0]);
    }

    const updatedData = [...props.data.filter((item: DataItem) => item.fecha >= startDate.value! && item.fecha <= endDate.value!).map((item: DataItem) => ({ ...item }))];

    for (const date of dates) {
      try {
        const pvpcData = await getPvpcData(date);
        const hourlyData = pvpcData.PVPC;
        let previousValue = 0;
        updatedData.forEach((item: DataItem) => {
          if (item.fecha.replace(/\//g, '-') === date) {
            const hour = parseInt(item.hora.split(':')[0]);
            let pvpcHourData = 
              hourlyData.find((d: any) => parseFecha(d.Dia).includes(date) && parseInt(d.Hora.split('-')[1]) === hour)
              ??  hourlyData.find((d: any) => parseFecha(d.Dia).includes(date) && parseInt(d.Hora.split('-')[0]) === hour);
            item.metodoObtencionPrecio = pvpcHourData ? 'Real' : 'Ponderado';
            if (!pvpcHourData) {
              pvpcHourData = previousValue;
              // pvpcHourData.Hora = `${(hour - 1).toString().padStart(2, '0')}-${hour.toString().padStart(2, '0')}`;
            }
            previousValue = pvpcHourData;
            if (pvpcHourData) {
              item.precio_kwh = region.value === "PBC" ? PvpcDataHelper.getPriceFromPvpcDataKwH(pvpcHourData) : PvpcDataHelper.getPriceFromPvpcDataKwHCeutaYMelilla(pvpcHourData);
              item.gasto_total = parseFloat((parseFloat(item.consumo_kWh.replace(',', '.')) * item.precio_kwh).toFixed(4));
            }
          }
        });
      } catch (error) {
        console.error(`Error fetching PVPC data for ${date}:`, error);
      }
    }

    emit('dateRangeSelected', updatedData);
    loading.value = false;
    showSpinner$.next(false);
    if (gastoTotal.value) {
      setTimeout(() => {
        gastoTotal.value!.scrollIntoView({ behavior: 'smooth' });
      }, 500);
    }
  }
};
</script>

<style scoped>
.v-btn {
  margin-top: 24px;
}
</style>