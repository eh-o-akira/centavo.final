<script setup>
import { ref } from 'vue'
import { mostrarValor, formatarData } from '../utils/formatar'

const props = defineProps({
  transacao: { type: Object, required: true },
  visivel: { type: Boolean, default: true }
})
const emit = defineEmits(['remover'])

// Pede confirmação antes de excluir
const confirmando = ref(false)

function confirmarExclusao() {
  emit('remover', props.transacao.id)
  confirmando.value = false
}
</script>

<template>
  <li class="list-group-item">
    <div class="d-flex justify-content-between align-items-start gap-2">
      <div class="min-w-0">
        <RouterLink :to="{ name: 'transacao', params: { id: transacao.id } }" class="fw-semibold text-break">
          {{ transacao.descricao }}
        </RouterLink>
        <div class="small text-body-secondary">
          <span class="badge rounded-pill text-bg-secondary me-1">{{ transacao.categoria }}</span>
          {{ formatarData(transacao.data) }}
        </div>
      </div>
      <div class="text-end flex-shrink-0">
        <div class="fw-semibold numero" :class="transacao.tipo === 'receita' ? 'text-success' : 'text-danger'">
          {{ transacao.tipo === 'receita' ? '+' : '−' }} {{ mostrarValor(transacao.valor, visivel) }}
        </div>
        <div v-if="!confirmando">
          <button
            type="button"
            class="btn btn-sm btn-link text-danger p-0"
            :aria-label="'Excluir ' + transacao.descricao"
            @click="confirmando = true"
          >
            Excluir
          </button>
        </div>
        <div v-else class="d-flex gap-1 justify-content-end mt-1">
          <button type="button" class="btn btn-sm btn-danger" @click="confirmarExclusao">Excluir</button>
          <button type="button" class="btn btn-sm btn-outline-secondary" @click="confirmando = false">Cancelar</button>
        </div>
      </div>
    </div>
  </li>
</template>
