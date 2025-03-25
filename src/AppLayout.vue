<template>
    <div>
        <v-layout>
            <BaseNavbar />
            <v-main>
                <!-- Floating Action Button -->
                <v-container class="fab-container">
                    <v-btn
                        color="primary"
                        fab
                        @click="showColorPicker = !showColorPicker"
                    >
                        <v-icon>mdi-palette</v-icon>
                    </v-btn>
                    <v-dialog v-model="showColorPicker" persistent max-width="290">
                        <template #activator="{ on, attrs }">
                            <!-- FAB triggers the dialog -->
                        </template>
                        <v-card>
                            <v-card-title class="headline">Select a Color</v-card-title>
                            <v-card-text>
                                <ColorPicker v-model="selectedColor" />
                            </v-card-text>
                            <v-card-actions>
                                <v-btn text color="primary" @click="showColorPicker = false">
                                    Close
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-dialog>
                </v-container>
                <router-view />
            </v-main>
        </v-layout>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import ColorPicker from './components/ColorPicker.vue';

const showColorPicker = ref(false);
const selectedColor = ref('#ffffff'); // Default color
</script>

<style scoped>
.fab-container {
    position: fixed;
    bottom: 80px;
    right: 20px;
    z-index: 1000;
}
</style>
