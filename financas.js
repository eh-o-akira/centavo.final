// Dados compartilhados entre as páginas.
// Sem Pinia/Vuex: os ref() ficam FORA de qualquer componente e são exportados.
// Quem importar estes ref() enxerga os mesmos dados, e a reatividade do Vue atualiza tudo.
import { ref, computed, watch } from 'vue'
import { lerJSON, salvarJSON } from '../utils/armazenamento'
import { transacoesIniciais, metaInicial } from '../data/transacoesIniciais'

const CHAVE_TRANSACOES = 'centavo:transacoes'
const CHAVE_META = 'centavo:meta'
const CHAVE_VISIVEL = 'centavo:valores-visiveis'

export const transacoes = ref(lerJSON(CHAVE_TRANSACOES, structuredClone(transacoesIniciais)))
export const meta = ref(lerJSON(CHAVE_META, metaInicial))
export const valoresVisiveis = ref(lerJSON(CHAVE_VISIVEL, true))

// Totais calculados a partir da lista (recalculam sozinhos quando a lista muda)
export const totalReceitas = computed(() =>
  transacoes.value.filter((t) => t.tipo === 'receita').reduce((soma, t) => soma + t.valor, 0)
)
export const totalDespesas = computed(() =>
  transacoes.value.filter((t) => t.tipo === 'despesa').reduce((soma, t) => soma + t.valor, 0)
)
export const saldo = computed(() => totalReceitas.value - totalDespesas.value)

// Salva no navegador sempre que algo mudar
watch(transacoes, (valor) => salvarJSON(CHAVE_TRANSACOES, valor), { deep: true })
watch(meta, (valor) => salvarJSON(CHAVE_META, valor))
watch(valoresVisiveis, (valor) => salvarJSON(CHAVE_VISIVEL, valor))

export function adicionarTransacao(dados) {
  const proximoId = transacoes.value.reduce((maior, t) => Math.max(maior, t.id), 0) + 1
  transacoes.value.push({ id: proximoId, ...dados })
}

export function removerTransacao(id) {
  transacoes.value = transacoes.value.filter((t) => t.id !== id)
}

export function buscarTransacao(id) {
  return transacoes.value.find((t) => t.id === id)
}

export function atualizarMeta(novaMeta) {
  meta.value = novaMeta
}

export function alternarValores() {
  valoresVisiveis.value = !valoresVisiveis.value
}

export function restaurarExemplos() {
  transacoes.value = structuredClone(transacoesIniciais)
  meta.value = metaInicial
}
