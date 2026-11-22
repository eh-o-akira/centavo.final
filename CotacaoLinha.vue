<script setup>
import SimboloMoeda from './SimboloMoeda.vue'
import VariacaoBadge from './VariacaoBadge.vue'
import { formatarCotacao } from '../utils/formatar'

// Uma linha da lista de cotações (página Cotações), reutilizada com v-for
defineProps({
  cotacao: { type: Object, required: true }
})
</script>

<template>
  <RouterLink
    :to="{ name: 'cotacao', params: { codigo: cotacao.codigo } }"
    class="list-group-item list-group-item-action d-flex align-items-center gap-3"
  >
    <SimboloMoeda :codigo="cotacao.codigo" />
    <div class="flex-grow-1 min-w-0">
      <div class="fw-semibold">{{ cotacao.nome }}</div>
      <div class="small text-body-secondary">{{ cotacao.codigo }}/BRL</div>
    </div>
    <div class="text-end flex-shrink-0">
      <div class="fw-semibold numero">{{ formatarCotacao(cotacao.compra) }}</div>
      <VariacaoBadge :valor="cotacao.variacaoPct" />
    </div>
  </RouterLink>
</template>
