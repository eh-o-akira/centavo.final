<script setup>
import { ref, computed, onMounted } from 'vue'
import EstadoRequisicao from '../components/EstadoRequisicao.vue'
import CotacaoLinha from '../components/CotacaoLinha.vue'
import ConversorMoeda from '../components/ConversorMoeda.vue'
import { cotacoes, carregando, erro, atualizadoEm, carregarCotacoes } from '../store/cotacoes'
import { formatarDataHora, normalizarTexto } from '../utils/formatar'

// texto digitado na busca (v-model)
const busca = ref('')

// Filtra pelo nome ou pelo código, sem se importar com acentos ou maiúsculas ("dolar" acha "Dólar")
const filtradas = computed(() => {
  const termo = normalizarTexto(busca.value)
  if (!termo) return cotacoes.value
  return cotacoes.value.filter(
    (c) => normalizarTexto(c.nome).includes(termo) || normalizarTexto(c.codigo).includes(termo)
  )
})

onMounted(() => carregarCotacoes())
</script>

<template>
  <div class="container py-4">
    <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2 mb-3">
      <div>
        <h1 class="h3 mb-0">Cotações</h1>
        <p class="small text-body-secondary mb-0">
          Valores em real, da AwesomeAPI.
          <span v-if="atualizadoEm">Atualizado em {{ formatarDataHora(atualizadoEm) }}.</span>
        </p>
      </div>
      <button
        type="button"
        class="btn btn-outline-primary btn-sm align-self-start"
        :disabled="carregando"
        @click="carregarCotacoes({ forcar: true })"
      >
        {{ carregando ? 'Atualizando…' : 'Atualizar' }}
      </button>
    </div>

    <EstadoRequisicao
      :carregando="carregando"
      :erro="erro"
      :tem-dados="cotacoes.length > 0"
      @tentar-novamente="carregarCotacoes({ forcar: true })"
    >
      <div class="row g-3">
        <div class="col-12 col-lg-7">
          <label for="busca" class="form-label visually-hidden">Buscar moeda</label>
          <input
            id="busca"
            v-model="busca"
            type="search"
            class="form-control mb-3"
            placeholder="Buscar moeda (ex.: dólar, EUR, bitcoin)"
            autocomplete="off"
          />
          <div v-if="filtradas.length > 0" class="list-group shadow-sm">
            <CotacaoLinha v-for="cotacao in filtradas" :key="cotacao.codigo" :cotacao="cotacao" />
          </div>
          <div v-else class="alert alert-secondary" role="status">
            Nenhuma moeda encontrada para “{{ busca }}”.
          </div>
        </div>
        <div class="col-12 col-lg-5">
          <ConversorMoeda :cotacoes="cotacoes" />
        </div>
      </div>
    </EstadoRequisicao>
  </div>
</template>
