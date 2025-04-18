<template>
    <div>
        <input type="color" v-model="color" />
    </div>
</template>

<script lang="ts" setup>
import { chartColors } from '@/config/chartColors';

const props = defineProps({
    modelValue: {
        type: String,
        required: true,
    },
});

const emit = defineEmits(['update:modelValue']);

const color = ref(props.modelValue);

watch(color, (newColor) => {
    chartColors.value.backgroundColor = newColor;
    chartColors.value.borderColor = newColor;
    emit('update:modelValue', newColor);
});
</script>