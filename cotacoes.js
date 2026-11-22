// Estado compartilhado das cotações (mesma ideia do store/financas.js: ref() fora dos componentes).
// A Página Inicial e a página Cotações usam os mesmos dados, então a API é chamada uma vez só.
import { ref } from 'vue'
import { buscarCotacoes } from '../services/cotacoesApi'
import { CODIGOS } from '../data/moedas'

export const cotacoes = ref([])
export const carregando = ref(false)
export const erro = ref('')
export const atualizadoEm = ref(0) // momento (ms) da última resposta bem-sucedida

const VALIDADE_CACHE_MS = 60_000 // 1 minuto (a API também guarda cache de 1 minuto)
let numeroDoPedido = 0

// forcar = true ignora o cache (botão "Atualizar" e "Tentar novamente")
export async function carregarCotacoes({ forcar = false } = {}) {
  const cacheValido = cotacoes.value.length > 0 && Date.now() - atualizadoEm.value < VALIDADE_CACHE_MS
  if (!forcar && (cacheValido || carregando.value)) return

  const meuPedido = ++numeroDoPedido
  carregando.value = true
  erro.value = ''
  try {
    const dados = await buscarCotacoes(CODIGOS)
    if (meuPedido !== numeroDoPedido) return // chegou um pedido mais novo: ignora este
    cotacoes.value = dados
    atualizadoEm.value = Date.now()
  } catch (e) {
    if (meuPedido === numeroDoPedido) erro.value = e.message
  } finally {
    if (meuPedido === numeroDoPedido) carregando.value = false
  }
}
