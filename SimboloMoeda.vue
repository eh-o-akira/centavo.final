<script setup>
import { computed } from 'vue'
import { acharMoeda } from '../data/moedas'

// Círculo com o símbolo da moeda ($, €, £, ₿...)
const props = defineProps({
  codigo: { type: String, required: true }
})

const simbolo = computed(() => acharMoeda(props.codigo)?.simbolo ?? props.codigo.slice(0, 1))
</script>

<template>
  <span class="simbolo-moeda" aria-hidden="true">{{ simbolo }}</span>
</template>
