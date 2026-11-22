<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import EstadoRequisicao from '../components/EstadoRequisicao.vue'
import SimboloMoeda from '../components/SimboloMoeda.vue'
import VariacaoBadge from '../components/VariacaoBadge.vue'
import HistoricoGrafico from '../components/HistoricoGrafico.vue'
import AlertaCotacaoForm from '../components/AlertaCotacaoForm.vue'
import { buscarCotacao, buscarHistorico } from '../services/cotacoesApi'
import { acharMoeda } from '../data/moedas'
import { formatarCotacao, formatarDataHora } from '../utils/formatar'

const DIAS_HISTORICO = 15

const route = useRoute()
// :codigo vem da URL (/cotacoes/usd); deixamos em maiúsculas e conferimos se é uma moeda do app
const codigo = computed(() => String(route.params.codigo).toUpperCase())
const moeda = computed(() => acharMoeda(codigo.value))

// Duas chamadas independentes (GET /last e GET /daily): cada uma com seu estado de carregando/erro
const cotacao = ref(null)
const carregandoCotacao = ref(false)
const erroCotacao = ref('')

const historico = ref([])
const carregandoHistorico = ref(false)
const erroHistorico = ref('')

let pedidoCotacao = 0
let pedidoHistorico = 0

async function carregarCotacao() {
  const meu = ++pedidoCotacao
  carregandoCotacao.value = true
  erroCotacao.value = ''
  try {
    const dados = await buscarCotacao(codigo.value)
    if (meu === pedidoCotacao) cotacao.value = dados
  } catch (e) {
    if (meu === pedidoCotacao) erroCotacao.value = e.message
  } finally {
    if (meu === pedidoCotacao) carregandoCotacao.value = false
  }
}

async function carregarHistorico() {
  const meu = ++pedidoHistorico
  carregandoHistorico.value = true
  erroHistorico.value = ''
  try {
    const dados = await buscarHistorico(codigo.value, DIAS_HISTORICO)
    if (meu === pedidoHistorico) historico.value = dados
  } catch (e) {
    if (meu === pedidoHistorico) erroHistorico.value = e.message
  } finally {
    if (meu === pedidoHistorico) carregandoHistorico.value = false
  }
}

// Roda ao abrir a página e também quando o código da URL muda (ex.: de /cotacoes/USD para /cotacoes/EUR)
watch(
  codigo,
  () => {
    cotacao.value = null
    historico.value = []
    if (moeda.value) {
      carregarCotacao()
      carregarHistorico()
    }
  },
  { immediate: true }
)
</script>

<template>
  <div class="container py-4">
    <RouterLink to="/cotacoes" class="d-inline-block mb-3">← Voltar para cotações</RouterLink>

    <div v-if="!moeda" class="alert alert-warning" role="alert">
      O Centavo não acompanha a moeda <strong>{{ route.params.codigo }}</strong>.
      <RouterLink to="/cotacoes">Veja as moedas disponíveis.</RouterLink>
    </div>

    <template v-else>
      <div class="d-flex align-items-center gap-3 mb-3">
        <SimboloMoeda :codigo="moeda.codigo" />
        <div>
          <h1 class="h3 mb-0">{{ moeda.nome }}</h1>
          <p class="small text-body-secondary mb-0">{{ moeda.codigo }}/BRL</p>
        </div>
      </div>

      <div class="row g-3">
        <div class="col-12 col-lg-7">
          <div class="card shadow-sm mb-3">
            <div class="card-header fw-semibold">Cotação do dia</div>
            <div class="card-body">
              <EstadoRequisicao
                :carregando="carregandoCotacao"
                :erro="erroCotacao"
                :tem-dados="cotacao !== null"
                @tentar-novamente="carregarCotacao"
              >
                <p class="display-6 fw-bold numero mb-1 text-break">{{ formatarCotacao(cotacao.compra) }}</p>
                <p class="mb-3"><VariacaoBadge :valor="cotacao.variacaoPct" /></p>
                <dl class="row mb-0 small">
                  <dt class="col-6 col-sm-3">Compra</dt>
                  <dd class="col-6 col-sm-3 numero">{{ formatarCotacao(cotacao.compra) }}</dd>
                  <dt class="col-6 col-sm-3">Venda</dt>
                  <dd class="col-6 col-sm-3 numero">{{ formatarCotacao(cotacao.venda) }}</dd>
                  <dt class="col-6 col-sm-3">Máxima do dia</dt>
                  <dd class="col-6 col-sm-3 numero">{{ formatarCotacao(cotacao.maxima) }}</dd>
                  <dt class="col-6 col-sm-3">Mínima do dia</dt>
                  <dd class="col-6 col-sm-3 numero">{{ formatarCotacao(cotacao.minima) }}</dd>
                  <dt class="col-12 col-sm-3">Atualizado em</dt>
                  <dd class="col-12 col-sm-9 mb-0">{{ formatarDataHora(cotacao.atualizadoEm) }}</dd>
                </dl>
              </EstadoRequisicao>
            </div>
          </div>

          <div class="card shadow-sm">
            <div class="card-header fw-semibold">Histórico dos últimos {{ DIAS_HISTORICO }} dias</div>
            <div class="card-body">
              <EstadoRequisicao
                :carregando="carregandoHistorico"
                :erro="erroHistorico"
                :tem-dados="historico.length > 0"
                texto-carregando="Carregando o histórico…"
                @tentar-novamente="carregarHistorico"
              >
                <HistoricoGrafico :pontos="historico" :descricao="`Histórico de ${moeda.nome}`" />
              </EstadoRequisicao>
            </div>
          </div>
        </div>

        <div class="col-12 col-lg-5">
          <AlertaCotacaoForm :codigo="moeda.codigo" :valor-atual="cotacao ? cotacao.compra : 0" />
        </div>
      </div>
    </template>
  </div>
</template>
