<script setup>
import { ref, computed } from 'vue'
import { mostrarValor } from '../utils/formatar'

const props = defineProps({
  meta: { type: Number, required: true },
  saldo: { type: Number, required: true },
  visivel: { type: Boolean, default: true }
})
const emit = defineEmits(['atualizar-meta'])

const editando = ref(false)
const novaMeta = ref('')
const erro = ref('')

// porcentagem da meta já alcançada (entre 0 e 100)
const porcentagem = computed(() => {
  if (props.meta <= 0) return 0
  return Math.min(100, Math.max(0, Math.round((props.saldo / props.meta) * 100)))
})

function abrirEdicao() {
  novaMeta.value = String(props.meta).replace('.', ',')
  erro.value = ''
  editando.value = true
}

function salvar() {
  const numero = Number(String(novaMeta.value).replace(',', '.'))
  if (!Number.isFinite(numero) || numero <= 0) {
    erro.value = 'Informe uma meta maior que zero.'
    return
  }
  emit('atualizar-meta', Math.round(numero * 100) / 100)
  editando.value = false
}
</script>

<template>
  <div class="card shadow-sm">
    <div class="card-header d-flex justify-content-between align-items-center">
      <span class="fw-semibold">Meta de economia</span>
      <button v-if="!editando" type="button" class="btn btn-sm btn-outline-primary" @click="abrirEdicao">
        Editar meta
      </button>
    </div>
    <div class="card-body">
      <p class="mb-2">
        <span class="numero fw-semibold">{{ mostrarValor(Math.max(saldo, 0), visivel) }}</span>
        <span class="text-body-secondary"> de {{ mostrarValor(meta, visivel) }}</span>
      </p>
      <div
        class="progress"
        role="progressbar"
        :aria-valuenow="porcentagem"
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label="Progresso da meta de economia"
      >
        <div class="progress-bar progress-bar-striped" :style="{ width: porcentagem + '%' }">{{ porcentagem }}%</div>
      </div>
      <p class="small text-body-secondary mt-2 mb-0">
        <span v-if="porcentagem >= 100">Meta alcançada! 🎉</span>
        <span v-else>Faltam {{ mostrarValor(Math.max(meta - saldo, 0), visivel) }} para a meta.</span>
      </p>

      <!-- v-show: o formulário continua na página e só é escondido/mostrado -->
      <form v-show="editando" class="mt-3" novalidate @submit.prevent="salvar">
        <label for="nova-meta" class="form-label">Nova meta</label>
        <div class="input-group has-validation">
          <span class="input-group-text">R$</span>
          <input
            id="nova-meta"
            v-model="novaMeta"
            type="text"
            inputmode="decimal"
            class="form-control"
            :class="{ 'is-invalid': erro }"
          />
          <button type="submit" class="btn btn-primary">Salvar</button>
          <button type="button" class="btn btn-outline-secondary" @click="editando = false">Cancelar</button>
          <div v-if="erro" class="invalid-feedback">{{ erro }}</div>
        </div>
      </form>
    </div>
  </div>
</template>
