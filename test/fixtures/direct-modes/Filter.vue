<script setup>
import { onMounted } from 'vue';
const props=defineProps({modelValue:{type:String,default:''},disabled:Boolean});
const emit=defineEmits(['update:modelValue']);
const onKey=e=>{if(e.key==='Escape')emit('update:modelValue','')};
onMounted(()=>window.addEventListener('keydown',onKey));
const change=e=>emit('update:modelValue',e.target.value);
</script>
<template><input :value="modelValue" :disabled="disabled" aria-label="Filtro" @input="change" /></template>
<style scoped>.fixture-filter {max-width:100%}</style>
