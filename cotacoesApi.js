// Comunicação com as APIs (HTTP + JSON) usando fetch().
//
// API 1 — AwesomeAPI (cotações):      https://economia.awesomeapi.com.br
//   GET /json/last/USD-BRL,EUR-BRL,...   cotações do dia (vários pares de uma vez)
//   GET /json/daily/USD-BRL/15           histórico dos últimos 15 dias de uma moeda
//
// API 2 — JSONPlaceholder (API de teste): https://jsonplaceholder.typicode.com
//   POST /posts                          recebe o alerta e responde 201 Created (não grava de verdade)
import { acharMoeda, parComReal } from '../data/moedas'

export const API_COTACOES = 'https://economia.awesomeapi.com.br'
export const API_TESTE = 'https://jsonplaceholder.typicode.com'

const TEMPO_LIMITE_MS = 10_000
// Chave opcional da AwesomeAPI (veja .env.example). Sem chave, tudo funciona normalmente.
const CHAVE_OPCIONAL = import.meta.env.VITE_AWESOMEAPI_KEY

// Erro com mensagem pronta para mostrar ao usuário
export class ErroApi extends Error {
  constructor(mensagem, tipo, status = 0) {
    super(mensagem)
    this.name = 'ErroApi'
    this.tipo = tipo // 'tempo' | 'rede' | 'http' | 'json' | 'vazio'
    this.status = status
  }
}

function mensagemPorStatus(status) {
  if (status === 404) return 'A API não encontrou essa cotação (erro 404).'
  if (status === 429) return 'Muitas requisições em pouco tempo (erro 429). Aguarde um instante e tente de novo.'
  if (status >= 500) return `A API está com problemas no momento (erro ${status}). Tente novamente em instantes.`
  return `A API respondeu com erro ${status}.`
}

function comChave(url) {
  if (!CHAVE_OPCIONAL) return url
  return `${url}${url.includes('?') ? '&' : '?'}token=${encodeURIComponent(CHAVE_OPCIONAL)}`
}

// Faz o fetch com limite de tempo (AbortController) e converte qualquer falha em ErroApi.
async function requisitar(url, opcoes = {}) {
  const controle = new AbortController()
  const relogio = setTimeout(() => controle.abort(), TEMPO_LIMITE_MS)
  try {
    const resposta = await fetch(url, { ...opcoes, signal: controle.signal })
    if (!resposta.ok) throw new ErroApi(mensagemPorStatus(resposta.status), 'http', resposta.status)
    try {
      return await resposta.json()
    } catch (e) {
      if (e.name === 'AbortError') throw e
      throw new ErroApi('A API respondeu em um formato inesperado (JSON inválido).', 'json')
    }
  } catch (e) {
    if (e instanceof ErroApi) throw e
    if (e.name === 'AbortError') {
      throw new ErroApi('A API demorou mais de 10 segundos para responder. Tente novamente.', 'tempo')
    }
    throw new ErroApi('Não foi possível conectar à API. Verifique sua internet e tente novamente.', 'rede')
  } finally {
    clearTimeout(relogio)
  }
}

// A API entrega os números como TEXTO ("5.7276"). Aqui viram número e ganham nomes em português.
function normalizarCotacao(item) {
  const moeda = acharMoeda(item.code)
  return {
    codigo: item.code,
    nome: moeda ? moeda.nome : item.name,
    compra: Number(item.bid),
    venda: Number(item.ask),
    maxima: Number(item.high),
    minima: Number(item.low),
    variacao: Number(item.varBid),
    variacaoPct: Number(item.pctChange),
    atualizadoEm: Number(item.timestamp) * 1000 // a API manda em segundos
  }
}

// GET /json/last/USD-BRL,EUR-BRL,... -> lista de cotações
export async function buscarCotacoes(codigos) {
  const pares = codigos.map(parComReal).join(',')
  const dados = await requisitar(comChave(`${API_COTACOES}/json/last/${pares}`))
  // a resposta é um objeto cujas chaves são os pares sem o hífen: { USDBRL: {...}, EURBRL: {...} }
  const lista = codigos.map((c) => dados[`${c}BRL`]).filter(Boolean).map(normalizarCotacao)
  if (lista.length === 0) throw new ErroApi('A API não devolveu nenhuma cotação.', 'vazio')
  return lista
}

// GET /json/last/USD-BRL -> uma cotação (página de detalhe)
export async function buscarCotacao(codigo) {
  const lista = await buscarCotacoes([codigo])
  return lista[0]
}

// GET /json/daily/USD-BRL/15 -> histórico, do dia mais antigo para o mais recente
export async function buscarHistorico(codigo, dias = 15) {
  const dados = await requisitar(comChave(`${API_COTACOES}/json/daily/${parComReal(codigo)}/${dias}`))
  if (!Array.isArray(dados) || dados.length === 0) {
    throw new ErroApi('A API não devolveu o histórico dessa moeda.', 'vazio')
  }
  return dados
    .map((d) => ({ data: Number(d.timestamp) * 1000, valor: Number(d.bid), maxima: Number(d.high), minima: Number(d.low) }))
    .reverse() // a API manda do mais novo para o mais antigo
}

// POST /posts -> envia o alerta (a API de teste responde 201 Created com um id, mas não grava)
export async function enviarAlerta({ codigo, condicao, valorAlvo }) {
  const corpo = {
    title: `Alerta ${codigo}-BRL`,
    body: `Avisar quando ${codigo} ficar ${condicao} de R$ ${valorAlvo}`,
    userId: 1
  }
  return requisitar(`${API_TESTE}/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=UTF-8' },
    body: JSON.stringify(corpo)
  })
}
