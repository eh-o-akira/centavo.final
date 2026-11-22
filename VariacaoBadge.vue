<script setup>
import { computed } from 'vue'
import { formatarPorcentagem } from '../utils/formatar'

// Mostra a variação do dia. A seta e o sinal (+/−) dizem o mesmo que a cor.
const props = defineProps({
  valor: { type: Number, required: true } // porcentagem, ex.: -0.09
})

const classe = computed(() => {
  if (props.valor > 0) return 'text-bg-success'
  if (props.valor < 0) return 'text-bg-danger'
  return 'text-bg-secondary'
})
const seta = computed(() => (props.valor > 0 ? '▲' : props.valor < 0 ? '▼' : '■'))
const descricao = computed(() =>
  props.valor > 0 ? 'em alta' : props.valor < 0 ? 'em queda' : 'estável'
)
</script>

<template>
  <span class="badge numero" :class="classe">
    <span aria-hidden="true">{{ seta }}</span>
    {{ formatarPorcentagem(valor) }}
    <span class="visually-hidden">({{ descricao }})</span>
  </span>
</template>
