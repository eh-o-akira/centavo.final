<script setup>
import { computed } from 'vue'
import { formatarCotacao, formatarDiaMes } from '../utils/formatar'

// Gráfico de linha feito com SVG puro (sem biblioteca de gráficos).
// pontos: [{ data (ms), valor }] em ordem cronológica.
const props = defineProps({
  pontos: { type: Array, required: true },
  descricao: { type: String, default: 'Histórico de cotação' }
})

const LARGURA = 600
const ALTURA = 260
const MARGEM = 16

const minimo = computed(() => Math.min(...props.pontos.map((p) => p.valor)))
const maximo = computed(() => Math.max(...props.pontos.map((p) => p.valor)))

// converte cada ponto (data, valor) em posição (x, y) dentro do desenho
const posicoes = computed(() => {
  const intervalo = maximo.value - minimo.value || 1
  const passo = props.pontos.length > 1 ? (LARGURA - 2 * MARGEM) / (props.pontos.length - 1) : 0
  return props.pontos.map((p, i) => ({
    x: MARGEM + i * passo,
    y: ALTURA - MARGEM - ((p.valor - minimo.value) / intervalo) * (ALTURA - 2 * MARGEM),
    ...p
  }))
})

const linha = computed(() => posicoes.value.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' '))
const area = computed(() => {
  if (posicoes.value.length === 0) return ''
  const primeiro = posicoes.value[0]
  const ultimo = posicoes.value[posicoes.value.length - 1]
  return `${primeiro.x},${ALTURA - MARGEM} ${linha.value} ${ultimo.x},${ALTURA - MARGEM}`
})

const variacaoPeriodo = computed(() => {
  const primeiro = props.pontos[0].valor
  const ultimo = props.pontos[props.pontos.length - 1].valor
  return ((ultimo - primeiro) / primeiro) * 100
})
</script>

<template>
  <figure class="mb-0">
    <div class="d-flex flex-wrap justify-content-between gap-2 small mb-2">
      <span>Mínima: <strong class="numero">{{ formatarCotacao(minimo) }}</strong></span>
      <span>Máxima: <strong class="numero">{{ formatarCotacao(maximo) }}</strong></span>
    </div>

    <svg
      :viewBox="`0 0 ${LARGURA} ${ALTURA}`"
      class="w-100 d-block"
      role="img"
      :aria-label="`${descricao}: de ${formatarCotacao(pontos[0].valor)} a ${formatarCotacao(pontos[pontos.length - 1].valor)} em ${pontos.length} dias`"
    >
      <!-- linhas de grade -->
      <line
        v-for="n in 4"
        :key="n"
        :x1="MARGEM"
        :x2="LARGURA - MARGEM"
        :y1="MARGEM + ((n - 1) * (ALTURA - 2 * MARGEM)) / 3"
        :y2="MARGEM + ((n - 1) * (ALTURA - 2 * MARGEM)) / 3"
        stroke="var(--bs-border-color)"
        stroke-width="1"
      />
      <polygon :points="area" fill="var(--bs-primary)" fill-opacity="0.15" />
      <polyline
        :points="linha"
        fill="none"
        stroke="var(--bs-primary)"
        stroke-width="3"
        stroke-linejoin="round"
        stroke-linecap="round"
      />
      <circle v-for="p in posicoes" :key="p.data" :cx="p.x" :cy="p.y" r="4.5" fill="var(--bs-primary)">
        <title>{{ formatarDiaMes(p.data) }}: {{ formatarCotacao(p.valor) }}</title>
      </circle>
    </svg>

    <figcaption class="d-flex justify-content-between small text-body-secondary mt-1">
      <span>{{ formatarDiaMes(pontos[0].data) }}</span>
      <span>
        {{ pontos.length }} dias ·
        <strong class="numero" :class="variacaoPeriodo >= 0 ? 'text-success' : 'text-danger'">
          {{ variacaoPeriodo >= 0 ? '▲ +' : '▼ ' }}{{ variacaoPeriodo.toFixed(2).replace('.', ',') }}%
        </strong>
        no período
      </span>
      <span>{{ formatarDiaMes(pontos[pontos.length - 1].data) }}</span>
    </figcaption>
  </figure>
</template>
