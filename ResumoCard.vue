<script setup>
import { computed } from 'vue'
import { mostrarValor } from '../utils/formatar'

// Props: dados que o componente pai (a página) passa para este card
const props = defineProps({
  titulo: { type: String, required: true },
  valor: { type: Number, required: true },
  tipo: { type: String, default: 'saldo' }, // 'saldo' | 'receita' | 'despesa'
  icone: { type: String, default: '' },
  visivel: { type: Boolean, default: true }
})

const classeBorda = computed(() => ({
  receita: 'border-success',
  despesa: 'border-danger',
  saldo: 'border-primary'
})[props.tipo])

const classeValor = computed(() => ({
  receita: 'text-success',
  despesa: 'text-danger',
  saldo: props.valor < 0 ? 'text-danger' : ''
})[props.tipo])
</script>

<template>
  <div class="card shadow-sm h-100 border-start border-4" :class="classeBorda">
    <div class="card-body">
      <p class="text-body-secondary mb-1 small">
        <span aria-hidden="true">{{ icone }}</span> {{ titulo }}
      </p>
      <p class="fs-4 fw-bold mb-0 numero text-break" :class="classeValor">
        <span v-if="visivel">{{ mostrarValor(valor, true) }}</span>
        <span v-else aria-label="valor oculto">R$ ••••</span>
      </p>
    </div>
  </div>
</template>
