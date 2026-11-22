<script setup>
import { computed, onMounted } from 'vue'
import ResumoCard from '../components/ResumoCard.vue'
import TransacaoLista from '../components/TransacaoLista.vue'
import MetaEconomia from '../components/MetaEconomia.vue'
import EstadoRequisicao from '../components/EstadoRequisicao.vue'
import CotacaoCard from '../components/CotacaoCard.vue'
import {
  transacoes, meta, valoresVisiveis, saldo, totalReceitas, totalDespesas, removerTransacao, atualizarMeta
} from '../store/financas'
import { cotacoes, carregando, erro, carregarCotacoes } from '../store/cotacoes'
import { MOEDAS_DESTAQUE } from '../data/moedas'

// só as moedas em destaque aparecem aqui; as outras estão na página Cotações
const destaques = computed(() => cotacoes.value.filter((c) => MOEDAS_DESTAQUE.includes(c.codigo)))

// ao abrir a página, busca as cotações (se o cache de 1 minuto ainda valer, não chama a API de novo)
onMounted(() => carregarCotacoes())
</script>

<template>
  <div class="container py-4">
    <h1 class="h3 mb-3">Seu resumo financeiro</h1>

    <div class="row g-3 mb-4">
      <div class="col-12 col-md-4">
        <ResumoCard titulo="Saldo atual" :valor="saldo" tipo="saldo" icone="💰" :visivel="valoresVisiveis" />
      </div>
      <div class="col-12 col-md-4">
        <ResumoCard titulo="Receitas" :valor="totalReceitas" tipo="receita" icone="⬆️" :visivel="valoresVisiveis" />
      </div>
      <div class="col-12 col-md-4">
        <ResumoCard titulo="Despesas" :valor="totalDespesas" tipo="despesa" icone="⬇️" :visivel="valoresVisiveis" />
      </div>
    </div>

    <section class="mb-4" aria-labelledby="titulo-cotacoes">
      <div class="d-flex justify-content-between align-items-baseline mb-2">
        <h2 id="titulo-cotacoes" class="h5 mb-0">Cotações do dia</h2>
        <RouterLink to="/cotacoes" class="small">Ver todas as cotações</RouterLink>
      </div>
      <EstadoRequisicao
        :carregando="carregando"
        :erro="erro"
        :tem-dados="destaques.length > 0"
        @tentar-novamente="carregarCotacoes({ forcar: true })"
      >
        <div class="row g-3">
          <div v-for="cotacao in destaques" :key="cotacao.codigo" class="col-6 col-lg-3">
            <CotacaoCard :cotacao="cotacao" />
          </div>
        </div>
      </EstadoRequisicao>
    </section>

    <div class="row g-3">
      <div class="col-12 col-lg-7">
        <TransacaoLista
          :transacoes="transacoes"
          :visivel="valoresVisiveis"
          titulo="Últimas transações"
          :limite="5"
          :mostrar-filtros="false"
          @remover="removerTransacao"
        />
        <div class="mt-2 d-flex flex-wrap gap-2">
          <RouterLink to="/transacoes" class="btn btn-primary btn-sm">+ Nova transação</RouterLink>
          <RouterLink to="/transacoes" class="btn btn-outline-primary btn-sm">Ver todas as transações</RouterLink>
        </div>
      </div>
      <div class="col-12 col-lg-5">
        <MetaEconomia :meta="meta" :saldo="saldo" :visivel="valoresVisiveis" @atualizar-meta="atualizarMeta" />
      </div>
    </div>
  </div>
</template>
