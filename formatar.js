// Funções de formatação (valores em reais, datas, cotações e porcentagens).

const real = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })
const numero = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
const percentual = new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export function formatarMoeda(valor) {
  return real.format(valor)
}

// Mostra o valor ou pontinhos, conforme o botão "Ocultar valores"
export function mostrarValor(valor, visivel) {
  return visivel ? real.format(valor) : 'R$ ••••'
}

// "2026-11-05" -> "05/11/2026" (sem usar Date, para não mudar o dia por causa do fuso)
export function formatarData(iso) {
  const [ano, mes, dia] = String(iso).split('-')
  return `${dia}/${mes}/${ano}`
}

// Cotações pequenas (ex.: dólar, iene) precisam de mais casas decimais que os valores grandes (ex.: bitcoin)
export function formatarCotacao(valor) {
  if (!Number.isFinite(valor)) return '—'
  const casas = valor < 100 ? 4 : 2
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: casas,
    maximumFractionDigits: casas
  }).format(valor)
}

// Número simples com 2 casas (ex.: resultado do conversor)
export function formatarQuantia(valor) {
  return Number.isFinite(valor) ? numero.format(valor) : '—'
}

// +0,45% / -1,20% (o sinal aparece também no texto, não só na cor)
export function formatarPorcentagem(valor) {
  if (!Number.isFinite(valor)) return '—'
  const sinal = valor > 0 ? '+' : ''
  return `${sinal}${percentual.format(valor)}%`
}

const doisDigitos = (n) => String(n).padStart(2, '0')

// timestamp em milissegundos -> "21/11/2026 14:35"
export function formatarDataHora(ms) {
  if (!ms) return '—'
  const d = new Date(ms)
  return `${doisDigitos(d.getDate())}/${doisDigitos(d.getMonth() + 1)}/${d.getFullYear()} ${doisDigitos(d.getHours())}:${doisDigitos(d.getMinutes())}`
}

// timestamp em milissegundos -> "21/11"
export function formatarDiaMes(ms) {
  const d = new Date(ms)
  return `${doisDigitos(d.getDate())}/${doisDigitos(d.getMonth() + 1)}`
}

// timestamp em milissegundos -> "14:35:09"
export function formatarHora(ms) {
  const d = new Date(ms)
  return `${doisDigitos(d.getHours())}:${doisDigitos(d.getMinutes())}:${doisDigitos(d.getSeconds())}`
}

// Tira acentos e deixa minúsculo, para a busca achar "dolar" ao digitar "Dólar"
export function normalizarTexto(texto) {
  return String(texto)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
}
