<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>Gasto Total</v-card-title>
          <v-card-text>
            <span>{{ totalGasto }} €</span>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

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

const totalGasto = computed(() => {
  return props.data.reduce((total, item) => {
    return total + (item.gasto_total || 0);
  }, 0).toFixed(2);
});
</script>

<style scoped>
.v-card {
  margin-top: 24px;
}
</style>