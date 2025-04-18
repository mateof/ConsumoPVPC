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
          <td>Gasto Total (€)</td>
          <td>Gasto por horas. Resultado de multiplicar el consumo por el precio en esa hora</td>
        </tr>
        <tr class="row-dark">
          <td>Precio por Kwh (€)</td>
          <td>Precio obtenido de ESIOS (Red electrica española)</td>
        </tr>
        <tr class="row-light">
          <td>Consumo (kWh)</td>
          <td>Es la energía consumida en el periodo de tiempo indicado. El método de obtención del dato puede ser <b>real</b> o <b>estimado</b>, esto se indica en el tooltip.</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script lang="ts">
export default {
  name: "DailyGastoInfo",
};
</script>

<style scoped>
/* Estilo para las filas con fondo claro */
.row-light {
  background-color: #f9f9f9; /* Color de fondo claro */
}

/* Estilo para las filas con fondo oscuro */
.row-dark {
  background-color: #eaeaea; /* Color de fondo ligeramente más oscuro */
}

/* Estilo general para las filas */
tr {
  transition: background-color 0.3s ease; /* Transición suave al pasar el ratón */
}

/* Efecto hover para las filas */
tr:hover {
  background-color: #dcdcdc; /* Color de fondo al pasar el ratón */
}
</style>