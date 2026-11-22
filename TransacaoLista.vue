<script setup>
import { ref, computed } from 'vue'
import TransacaoItem from './TransacaoItem.vue'

const props = defineProps({
  transacoes: { type: Array, required: true },
  visivel: { type: Boolean, default: true },
  titulo: { type: String, default: 'Transações' },
  limite: { type: Number, default: 0 }, // 0 = mostra todas
  mostrarFiltros: { type: Boolean, default: true }
})
const emit = defineEmits(['remover'])

const filtros = [
  { valor: 'todas', texto: 'Todas' },
  { valor: 'receita', texto: 'Receitas' },
  { valor: 'despesa', texto: 'Despesas' }
]

// ref() reativo: quando muda, a lista na tela se atualiza sozinha
const filtroAtivo = ref('todas')

function escolherFiltro(valor) {
  filtroAtivo.value = valor
}

// da mais recente para a mais antiga
const exibidas = computed(() => {
  const ordenadas = [...props.transacoes].sort((a, b) => b.data.localeCompare(a.data) || b.id - a.id)
  const filtradas = filtroAtivo.value === 'todas' ? ordenadas : ordenadas.filter((t) => t.tipo === filtroAtivo.value)
  return props.limite > 0 ? filtradas.slice(0, props.limite) : filtradas
})
</script>

<template>
  <div class="card shadow-sm">
    <div class="card-header d-flex flex-column flex-sm-row justify-content-between gap-2">
      <span class="fw-semibold">{{ titulo }}</span>
      <div v-if="mostrarFiltros" class="btn-group btn-group-sm" role="group" aria-label="Filtrar transações">
        <button
          v-for="filtro in filtros"
          :key="filtro.valor"
          type="button"
          class="btn"
          :class="filtroAtivo === filtro.valor ? 'btn-primary' : 'btn-outline-primary'"
          :aria-pressed="filtroAtivo === filtro.valor"
          @click="escolherFiltro(filtro.valor)"
        >
          {{ filtro.texto }}
        </button>
      </div>
    </div>

    <ul v-if="exibidas.length > 0" class="list-group list-group-flush">
      <TransacaoItem
        v-for="transacao in exibidas"
        :key="transacao.id"
        :transacao="transacao"
        :visivel="visivel"
        @remover="emit('remover', $event)"
      />
    </ul>
    <div v-else class="card-body text-center text-body-secondary">Nenhuma transação por aqui ainda.</div>
  </div>
</template>
