<script setup>
import { ref, watch } from 'vue'
import { categorias } from '../data/categorias'

const emit = defineEmits(['adicionar'])

function hojeISO() {
  const agora = new Date()
  const local = new Date(agora.getTime() - agora.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 10)
}

// ref() = variável reativa; v-model liga cada campo a uma delas
const tipo = ref('despesa')
const descricao = ref('')
const valor = ref('')
const data = ref(hojeISO())
const categoria = ref(categorias.despesa[0])
const erros = ref({})
const sucesso = ref(false)
let relogioSucesso = null

// Ao trocar receita/despesa, as categorias mudam
watch(tipo, (novo) => {
  categoria.value = categorias[novo][0]
})

function validar() {
  const novosErros = {}
  if (descricao.value.trim().length < 2) novosErros.descricao = 'Escreva uma descrição com pelo menos 2 letras.'
  const numero = Number(String(valor.value).replace(',', '.'))
  if (!Number.isFinite(numero) || numero <= 0) novosErros.valor = 'Informe um valor maior que zero.'
  if (!data.value) novosErros.data = 'Escolha a data.'
  erros.value = novosErros
  return Object.keys(novosErros).length === 0
}

function enviar() {
  if (!validar()) return
  emit('adicionar', {
    tipo: tipo.value,
    descricao: descricao.value.trim(),
    valor: Math.round(Number(String(valor.value).replace(',', '.')) * 100) / 100,
    data: data.value,
    categoria: categoria.value
  })
  descricao.value = ''
  valor.value = ''
  sucesso.value = true
  clearTimeout(relogioSucesso)
  relogioSucesso = setTimeout(() => (sucesso.value = false), 3000)
}
</script>

<template>
  <div class="card shadow-sm">
    <div class="card-header fw-semibold">Nova transação</div>
    <form class="card-body" novalidate @submit.prevent="enviar">
      <div class="btn-group w-100 mb-3" role="group" aria-label="Tipo da transação">
        <input id="tipo-despesa" v-model="tipo" type="radio" class="btn-check" value="despesa" />
        <label class="btn btn-outline-danger" for="tipo-despesa">Despesa</label>
        <input id="tipo-receita" v-model="tipo" type="radio" class="btn-check" value="receita" />
        <label class="btn btn-outline-success" for="tipo-receita">Receita</label>
      </div>

      <div class="mb-3">
        <label for="descricao" class="form-label">Descrição</label>
        <input
          id="descricao"
          v-model="descricao"
          type="text"
          class="form-control"
          :class="{ 'is-invalid': erros.descricao }"
          placeholder="Ex.: Lanche"
          maxlength="60"
        />
        <div v-if="erros.descricao" class="invalid-feedback">{{ erros.descricao }}</div>
      </div>

      <div class="row g-3 mb-3">
        <div class="col-12 col-sm-6">
          <label for="valor" class="form-label">Valor</label>
          <div class="input-group has-validation">
            <span class="input-group-text">R$</span>
            <input
              id="valor"
              v-model="valor"
              type="text"
              inputmode="decimal"
              class="form-control"
              :class="{ 'is-invalid': erros.valor }"
              placeholder="0,00"
            />
            <div v-if="erros.valor" class="invalid-feedback">{{ erros.valor }}</div>
          </div>
        </div>
        <div class="col-12 col-sm-6">
          <label for="data" class="form-label">Data</label>
          <input id="data" v-model="data" type="date" class="form-control" :class="{ 'is-invalid': erros.data }" />
          <div v-if="erros.data" class="invalid-feedback">{{ erros.data }}</div>
        </div>
      </div>

      <div class="mb-3">
        <label for="categoria" class="form-label">Categoria</label>
        <select id="categoria" v-model="categoria" class="form-select">
          <option v-for="nome in categorias[tipo]" :key="nome" :value="nome">{{ nome }}</option>
        </select>
      </div>

      <button type="submit" class="btn btn-primary w-100">Adicionar</button>
      <p v-show="sucesso" class="text-success small mt-2 mb-0" role="status">Transação adicionada!</p>
    </form>
  </div>
</template>
