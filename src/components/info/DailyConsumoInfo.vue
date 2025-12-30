<template>
  <div>
    <v-table fixed-header>
      <thead>
        <tr>
          <th>Tipo de dato</th>
          <th>Descripción</th>
        </tr>
      </thead>
      <tbody>
        <tr class="row-light">
          <td>Consumo (kWh)</td>
          <td>Es la energía consumida en el periodo de tiempo indicado. El método de obtención del dato puede ser <b>real</b> o <b>estimado</b>, esto se indica en el tooltip.</td>
        </tr>
        <tr class="row-dark">
          <td>Energía vertida (kWh)</td>
          <td>Es la energía que se inyecta a la red eléctrica desde una instalación de generación propia</td>
        </tr>
        <tr class="row-light">
          <td>Energía generada (kWh)</td>
          <td>Es la energía total producida por una instalación de generación propia, como paneles solares o generadores eólicos</td>
        </tr>
        <tr class="row-dark">
          <td>Energía autoconsumida (kWh)</td>
          <td>Es la energía generada y consumida directamente por una instalación propia, sin pasar por la red eléctrica</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script lang="ts">
export default {
  name: "DailyConsumoInfo",
};
</script>

<style scoped>
.row-light {
  background: rgba(var(--v-theme-surface-variant), 0.3);
}

.row-dark {
  background: rgba(var(--v-theme-surface-variant), 0.6);
}

tr {
  transition: background-color 0.3s ease;
}

tr:hover {
  background: rgba(var(--v-theme-primary), 0.1);
}
</style>