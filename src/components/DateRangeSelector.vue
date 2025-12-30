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
        <v-menu
          v-model="startDateMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ props: menuProps }">
            <v-text-field
              v-bind="menuProps"
              :model-value="startDateDisplay"
              label="Fecha Desde"
              prepend-icon="mdi-calendar"
              readonly
              variant="outlined"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="startDateISO"
            v-model:month="startPickerMonth"
            v-model:year="startPickerYear"
            :allowed-dates="allowedStartDates"
            @update:model-value="onStartDateSelected"
            color="primary"
            show-adjacent-months
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="4">
        <v-menu
          v-model="endDateMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          offset-y
          min-width="auto"
        >
          <template v-slot:activator="{ props: menuProps }">
            <v-text-field
              v-bind="menuProps"
              :model-value="endDateDisplay"
              label="Fecha Hasta"
              prepend-icon="mdi-calendar"
              readonly
              :disabled="!startDate"
              variant="outlined"
            ></v-text-field>
          </template>
          <v-date-picker
            v-model="endDateISO"
            v-model:month="endPickerMonth"
            v-model:year="endPickerYear"
            :allowed-dates="allowedEndDates"
            @update:model-value="onEndDateSelected"
            color="primary"
            show-adjacent-months
          ></v-date-picker>
        </v-menu>
      </v-col>
      <v-col cols="12" md="4" v-if="startDate && endDate">
        <v-btn @click="fetchAndEmitData" color="primary">
          Mostrar Datos
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
  <div ref="gastoTotal"></div>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, watch } from 'vue';
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

// Conversión de formato: YYYY/MM/DD -> YYYY-MM-DD (para VDatePicker)
const toISOFormat = (fecha: string): string => {
  return fecha.replace(/\//g, '-');
};

// Conversión de formato: YYYY-MM-DD -> YYYY/MM/DD (formato interno)
const fromISOFormat = (isoDate: string): string => {
  return isoDate.replace(/-/g, '/');
};

// Formato de visualización: YYYY/MM/DD -> DD/MM/YYYY
const toDisplayFormat = (fecha: string | null): string => {
  if (!fecha) return '';
  const [year, month, day] = fecha.split('/');
  return `${day}/${month}/${year}`;
};

// Fechas disponibles en formato original (YYYY/MM/DD)
const availableDates = computed(() =>
  [...new Set(props.data.map((item: DataItem) => item.fecha))]
    .sort((a, b) => b.localeCompare(a))
);

// Fechas disponibles en formato ISO para VDatePicker
const availableDatesISO = computed(() =>
  availableDates.value.map(fecha => toISOFormat(fecha))
);

const startDate = ref<string | null>(null);
const endDate = ref<string | null>(null);
const startDateISO = ref<Date | null>(null);
const endDateISO = ref<Date | null>(null);
const startDateMenu = ref(false);
const endDateMenu = ref(false);
const loading = ref(false);
const gastoTotal = ref<HTMLElement | null>(null);

// Mes y año para controlar la vista inicial del calendario
const startPickerMonth = ref<number>(new Date().getMonth());
const startPickerYear = ref<number>(new Date().getFullYear());
const endPickerMonth = ref<number>(new Date().getMonth());
const endPickerYear = ref<number>(new Date().getFullYear());

// Última fecha disponible (más reciente)
const lastAvailableDate = computed(() => {
  if (availableDates.value.length === 0) return null;
  // availableDates está ordenado en orden descendente, el primero es el más reciente
  return availableDates.value[0];
});

// Cuando se abra el menú de fecha inicio, posicionar en el mes de la última fecha disponible
watch(startDateMenu, (isOpen) => {
  if (isOpen && lastAvailableDate.value) {
    const [year, month] = lastAvailableDate.value.split('/');
    startPickerYear.value = parseInt(year);
    startPickerMonth.value = parseInt(month) - 1; // Los meses en JS son 0-indexed
  }
});

// Cuando se abra el menú de fecha fin, posicionar en el mes de la fecha inicio seleccionada
watch(endDateMenu, (isOpen) => {
  if (isOpen && startDate.value) {
    const [year, month] = startDate.value.split('/');
    endPickerYear.value = parseInt(year);
    endPickerMonth.value = parseInt(month) - 1;
  }
});

// Display values for text fields
const startDateDisplay = computed(() => toDisplayFormat(startDate.value));
const endDateDisplay = computed(() => toDisplayFormat(endDate.value));

// Convierte Date a string YYYY-MM-DD
const dateToISOString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Filtro de fechas permitidas para fecha inicio
const allowedStartDates = (date: unknown): boolean => {
  if (date instanceof Date) {
    const isoString = dateToISOString(date);
    return availableDatesISO.value.includes(isoString);
  }
  return availableDatesISO.value.includes(date as string);
};

// Filtro de fechas permitidas para fecha fin (solo >= fecha inicio)
const allowedEndDates = (date: unknown): boolean => {
  if (!startDateISO.value) return false;
  let isoDate: string;
  if (date instanceof Date) {
    isoDate = dateToISOString(date);
  } else {
    isoDate = date as string;
  }
  const startIsoString = dateToISOString(startDateISO.value);
  return availableDatesISO.value.includes(isoDate) && isoDate >= startIsoString;
};

// Actualiza la región seleccionada
const updateRegion = () => {
  emit('regionChanged', region.value);
  region$.next(region.value);
};

// Handler cuando se selecciona fecha de inicio
const onStartDateSelected = (dateValue: Date | null) => {
  if (!dateValue) return;

  const isoString = dateToISOString(dateValue);
  startDateISO.value = dateValue;
  startDate.value = fromISOFormat(isoString);
  startDateMenu.value = false;

  // Resetear fecha fin si es menor que la nueva fecha inicio
  if (endDateISO.value && dateToISOString(endDateISO.value) < isoString) {
    endDate.value = null;
    endDateISO.value = null;
  }

  emit('startDateChanged', startDate.value);
  startDate$.next(startDate.value);
};

// Handler cuando se selecciona fecha de fin
const onEndDateSelected = (dateValue: Date | null) => {
  if (!dateValue) return;

  const isoString = dateToISOString(dateValue);
  endDateISO.value = dateValue;
  endDate.value = fromISOFormat(isoString);
  endDateMenu.value = false;

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