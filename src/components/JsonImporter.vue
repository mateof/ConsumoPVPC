<template>
  <v-container>
    <v-file-input
      v-model="file"
      label="Import DataDis JSON File"
      accept=".json"
      @change="importJson"
    ></v-file-input>
    <!-- <v-card v-if="jsonData">
      <v-card-title>Imported Datadis JSON Data</v-card-title>
      <v-card-text>
        <pre>{{ jsonData }}</pre>
      </v-card-text>
    </v-card> -->
  </v-container>
</template>

<script lang="ts" setup>
import { ref, watch, defineEmits } from 'vue';

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
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>