<template>
  <div class="importer-card">
    <div class="importer-header">
      <div class="header-info">
        <v-icon size="28" class="header-icon">mdi-file-upload-outline</v-icon>
        <div>
          <h3 class="header-title">Importar Datos de Consumo</h3>
          <p class="header-subtitle">Sube tu archivo JSON de DataDis</p>
        </div>
      </div>
    </div>

    <div class="importer-content">
      <v-row align="center">
        <v-col cols="12" md="8">
          <v-file-input
            v-model="file"
            label="Seleccionar archivo JSON"
            accept=".json"
            prepend-icon="mdi-paperclip"
            variant="outlined"
            hide-details
            class="file-input-modern"
            @change="importJson"
          ></v-file-input>
        </v-col>

        <v-col cols="12" md="4" class="d-flex justify-end">
          <v-btn
            color="primary"
            variant="tonal"
            href="https://datadis.es/login"
            target="_blank"
            class="datadis-btn"
          >
            <v-icon start>mdi-open-in-new</v-icon>
            Ir a DataDis
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineEmits } from 'vue';

const file = ref<File[] | undefined>(undefined);
const jsonData = ref<any>(null);
const emit = defineEmits(['dataImported']);

const importJson = ($event: Event) => {
  if ($event.target) {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        jsonData.value = JSON.parse(event.target?.result as string);
        emit('dataImported', jsonData.value.reverse());
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    };
    reader.readAsText(($event.target as HTMLInputElement).files![0]);
  }
};
</script>

<style scoped>
.importer-card {
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 12px rgba(0, 0, 0, 0.03);
  margin-bottom: 1.5rem;
  overflow: hidden;
}

.importer-header {
  padding: 1.25rem 1.5rem;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.header-info {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.header-icon {
  color: #2563eb;
}

.header-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  letter-spacing: -0.25px;
}

.header-subtitle {
  font-size: 0.875rem;
  color: #64748b;
  margin: 0.25rem 0 0 0;
}

.importer-content {
  padding: 1.25rem 1.5rem;
}

.file-input-modern {
  background: #f8fafc;
  border-radius: 10px;
}

.datadis-btn {
  font-weight: 500;
}

@media (max-width: 960px) {
  .importer-content .v-col:last-child {
    justify-content: flex-start !important;
    padding-top: 0;
  }
}
</style>