<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <!-- Botón para eliminar todos los datos -->
                <v-btn color="red" @click="clearAllData" class="mb-4">
                    Eliminar Todos los Datos
                </v-btn>

                <!-- Tabla de datos -->
                <v-data-table :group-by="groupBy" :headers="headers" :items="pvpcData" item-value="date"
                    class="elevation-1" dense>
                    <template #top>
                        <v-toolbar flat>
                            <v-toolbar-title>Datos PVPC</v-toolbar-title>
                            <v-spacer></v-spacer>
                            <v-btn color="primary" @click="fetchAllData">
                                Recargar Datos
                            </v-btn>
                        </v-toolbar>
                    </template>

                    <template v-slot:group-header="{ item, columns, toggleGroup, isGroupOpen }">
                        <tr>
                            <td :colspan="columns.length">
                                <div class="d-flex align-center justify-space-between">
                                    <div class="d-flex align-center">
                                        <v-btn :icon="isGroupOpen(item) ? '$expand' : '$next'" color="medium-emphasis"
                                            density="comfortable" size="small" variant="outlined"
                                            @click="toggleGroup(item)"></v-btn>

                                        <span class="ms-4">Fecha: {{ item.value }}</span>
                                    </div>
                                    <!-- Botón de acción para el grupo -->
                                    <v-btn color="red" icon @click="deleteRow(item.value)">
                                        <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                </div>
                            </td>
                        </tr>
                    </template>

                    <!-- Acciones -->
                    <!-- <template #item.actions="{ item }">
                        <v-btn icon color="red" @click="deleteRow(item.value)">
                            <v-icon>mdi-delete</v-icon>
                        </v-btn>
                    </template> -->
                </v-data-table>
            </v-col>
        </v-row>
    </v-container>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { VBtn, VIcon, VContainer, VRow, VCol, VToolbar, VToolbarTitle, VSpacer, VDataTable } from 'vuetify/components';
import { getAllPvpcData, clearPvpcData, deletePvpcDataByDate } from '@/services/DatabaseService';
import type { PvpcData } from '@/services/DatabaseService';

const pvpcData = ref<PvpcData[]>([]);

const groupBy = [{ key: 'date', order: 'desc' as const }]

const headers = [
    { title: 'Fecha', text: 'Fecha', key: 'date' },
    { title: 'Hora', text: 'Hora', key: 'Hora' },
    { title: 'Peninsula, Canarias y Baleares (€)', text: 'PCB', key: 'PCB' },
    { title: 'Ceuta y Melilla (€)', text: 'CYM', key: 'CYM' },
    { title: 'Acciones', text: 'Acciones', key: 'actions', sortable: false },
];

const transformData = (data: { date: string; data: { PVPC: any[] } }): any[] => {
    return data.data.PVPC.map((item) => ({
        ...item, // Copia todas las propiedades del objeto original
        date: data.date, // Agrega la propiedad date externa
    }));
};

// Función para obtener todos los datos
const fetchAllData = async () => {
    try {
        let data = await getAllPvpcData();
        // Transformar los datos para que sean más fáciles de manejar
        pvpcData.value = data.flatMap((item) => transformData(item));
    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
};

// Función para eliminar todos los datos
const clearAllData = async () => {
    try {
        await clearPvpcData();
        pvpcData.value = [];
        console.log('Todos los datos han sido eliminados.');
    } catch (error) {
        console.error('Error al eliminar todos los datos:', error);
    }
};

// Función para eliminar una fila específica
const deleteRow = async (date: string) => {
    try {
        await deletePvpcDataByDate(date);
        pvpcData.value = pvpcData.value.filter((item) => item.date !== date);
        console.log(`El dato con la fecha ${date} ha sido eliminado.`);
    } catch (error) {
        console.error(`Error al eliminar el dato con la fecha ${date}:`, error);
    }
};

// Cargar los datos al montar el componente
onMounted(fetchAllData);
</script>

<style scoped>
.v-btn {
    margin-bottom: 16px;
}
</style>