<template>
    <div class="app-layout">
        <v-layout>
            <BaseNavbar />
            <v-main class="main-content">
                <v-container class="page-container" fluid>
                    <router-view />
                </v-container>

                <!-- Floating Action Button para Color Picker -->
                <v-btn
                    class="color-fab"
                    icon
                    size="large"
                    @click="showColorPicker = !showColorPicker"
                >
                    <v-icon>mdi-palette</v-icon>
                </v-btn>

                <v-dialog v-model="showColorPicker" max-width="320">
                    <v-card class="color-dialog">
                        <v-card-title class="dialog-title">
                            <v-icon class="mr-2">mdi-palette</v-icon>
                            Personalizar Colores
                        </v-card-title>
                        <v-card-text class="dialog-content">
                            <ColorPicker v-model="selectedColor" />
                        </v-card-text>
                        <v-card-actions class="dialog-actions">
                            <v-spacer></v-spacer>
                            <v-btn
                                variant="text"
                                color="primary"
                                @click="showColorPicker = false"
                            >
                                Cerrar
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-main>
        </v-layout>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import ColorPicker from './components/ColorPicker.vue';

const showColorPicker = ref(false);
const selectedColor = ref('#ffffff');
</script>

<style scoped>
.app-layout {
    min-height: 100vh;
}

.main-content {
    padding-top: 64px;
}

.page-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 1.5rem;
}

.color-fab {
    position: fixed;
    bottom: 100px;
    left: 24px;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%);
    color: white;
    box-shadow: 0 4px 14px rgba(139, 92, 246, 0.4);
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1000;
}

.color-fab:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 20px rgba(139, 92, 246, 0.5);
}

.color-dialog {
    border-radius: 16px !important;
    overflow: hidden;
}

.dialog-title {
    display: flex;
    align-items: center;
    font-weight: 600;
    color: #1e293b;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-bottom: 1px solid rgba(0, 0, 0, 0.06);
}

.dialog-content {
    padding: 1.5rem;
}

.dialog-actions {
    padding: 0.75rem 1rem;
    background: #fafbfc;
    border-top: 1px solid rgba(0, 0, 0, 0.04);
}

@media (max-width: 600px) {
    .page-container {
        padding: 1rem;
    }

    .color-fab {
        bottom: 80px;
        left: 16px;
    }
}
</style>
