<template>
  <v-container>
    <v-row align="center" justify="space-between">
      <!-- File Input -->
      <v-col cols="8">
        <v-file-input
          v-model="file"
          label="Import DataDis JSON File"
          accept=".json"
          @change="importJson"
        ></v-file-input>
      </v-col>

      <!-- Button with Link -->
      <v-col cols="4" class="text-right">
        <v-btn
          color="primary"
          outlined
          href="https://datadis.es/login"
          target="_blank"
        >
          Ir a DataDis
          <v-icon right>mdi-open-in-new</v-icon>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
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
pre {
  white-space: pre-wrap;
  word-wrap: break-word;
}
.text-right {
  text-align: right;
}
</style>