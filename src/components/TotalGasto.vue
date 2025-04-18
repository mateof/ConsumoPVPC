<template>
  
      <v-card class="vcard">
        <v-card-title class="header">Resumen de la región 🗺 {{ region$.value }} desde <v-chip variant="outlined"> 🗓 {{ PvpcDataHelper.englishToSpanishDate(startDate$.value) }} </v-chip> hasta <v-chip variant="outlined"> 🗓 {{ PvpcDataHelper.englishToSpanishDate(endDate$.value) }}</v-chip></v-card-title>
        <v-card-text class="card-body">
          <v-container>
          <v-row>
          <!-- Gasto Total -->
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title class="header">Gasto Total</v-card-title>
              <v-card-text class="card-body">
                <span>{{ totalGasto }} €</span>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Consumo Total -->
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title class="header">Consumo Total</v-card-title>
              <v-card-text class="card-body">
                <span>{{ totalConsumo }} kWh</span>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Precio Medio -->
          <v-col cols="12" md="4">
            <v-card>
              <v-card-title class="header">Precio Medio</v-card-title>
              <v-card-text class="card-body">
                <span>{{ precioMedio }} €/kWh</span>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Precio Máximo -->
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="header">Precio Máximo</v-card-title>
              <v-card-text class="card-body">
                <span>{{ precioMaximo.valor }} €/kWh</span>
                <br />
                <small>Fecha: {{ precioMaximo.fecha }}</small>
                <br />
                <small>Hora: {{ precioMaximo.hora }}</small>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Precio Mínimo -->
          <v-col cols="12" md="6">
            <v-card>
              <v-card-title class="header">Precio Mínimo</v-card-title>
              <v-card-text class="card-body">
                <span>{{ precioMinimo.valor }} €/kWh</span>
                <br />
                <small>Fecha: {{ precioMinimo.fecha }}</small>
                <br />
                <small>Hora: {{ precioMinimo.hora }}</small>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
        </v-card-text>
      </v-card>
    

</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { startDate$, endDate$, region$ } from '@/state/SharedState.ts';
import { PvpcDataHelper } from '../models/PvpcData';


interface DataItem {
  fecha: string;
  hora: string;
  consumo_kWh: string;
  metodoObtencion: string;
  precio_kwh?: number;
  gasto_total?: number;
}

const props = defineProps({
  data: {
    type: Array as () => DataItem[],
    required: true,
  },
});

// Cálculo del gasto total
const totalGasto = computed(() => {
  return props.data.reduce((total, item) => {
    return total + (item.gasto_total || 0);
  }, 0).toFixed(2);
});

// Cálculo del consumo total
const totalConsumo = computed(() => {
  return props.data.reduce((total, item) => {
    return total + parseFloat(item.consumo_kWh.replace(',', '.'));
  }, 0).toFixed(2);
});

// Cálculo del precio medio
const precioMedio = computed(() => {
  const precios = props.data.map((item) => item.precio_kwh || 0);
  const totalPrecios = precios.reduce((total, precio) => total + precio, 0);
  return (totalPrecios / precios.length).toFixed(4);
});

// Cálculo del precio máximo
const precioMaximo = computed(() => {
  const maxItem = props.data.reduce((max, item) => {
    return item.precio_kwh && item.precio_kwh > (max.precio_kwh || 0) ? item : max;
  }, {} as DataItem);
  return {
    valor: maxItem.precio_kwh?.toFixed(4) || 'N/A',
    fecha: maxItem.fecha || 'N/A',
    hora: maxItem.hora || 'N/A',
  };
});

// Cálculo del precio mínimo
const precioMinimo = computed(() => {
  const minItem = props.data.reduce((min, item) => {
    return item.precio_kwh && item.precio_kwh < (min.precio_kwh || Infinity) ? item : min;
  }, {} as DataItem);
  return {
    valor: minItem.precio_kwh?.toFixed(4) || 'N/A',
    fecha: minItem.fecha || 'N/A',
    hora: minItem.hora || 'N/A',
  };
});
</script>

<style scoped>
.v-card {
  margin-bottom: 16px;
  position: relative;
}

/* .vcard {
  width: 100%;
} */

.header {
  background-color: #f5f5f5;
  /* Fondo gris claro */
}

.card-body {
  margin-top: 2%;
}
</style>