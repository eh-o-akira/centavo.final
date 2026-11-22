<script setup>
import SimboloMoeda from './SimboloMoeda.vue'
import VariacaoBadge from './VariacaoBadge.vue'
import { formatarCotacao } from '../utils/formatar'

// Card de uma moeda (usado na página inicial, um para cada moeda em destaque)
defineProps({
  cotacao: { type: Object, required: true }
})
</script>

<template>
  <RouterLink :to="{ name: 'cotacao', params: { codigo: cotacao.codigo } }" class="card-link-cheio d-block h-100">
    <div class="card shadow-sm h-100">
      <div class="card-body">
        <div class="d-flex align-items-center gap-2 mb-2">
          <SimboloMoeda :codigo="cotacao.codigo" />
          <div class="min-w-0">
            <div class="fw-semibold">{{ cotacao.codigo }}</div>
            <div class="small text-body-secondary text-truncate">{{ cotacao.nome }}</div>
          </div>
        </div>
        <p class="fs-5 fw-bold mb-1 numero text-break">{{ formatarCotacao(cotacao.compra) }}</p>
        <VariacaoBadge :valor="cotacao.variacaoPct" />
      </div>
    </div>
  </RouterLink>
</template>
