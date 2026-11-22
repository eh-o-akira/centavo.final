// As 10 moedas que o Centavo acompanha. Todas são cotadas em real (BRL).
// "codigo" é o código da moeda; a API usa o par "USD-BRL" (moeda-real).
export const MOEDAS = [
  { codigo: 'USD', nome: 'Dólar americano', simbolo: '$' },
  { codigo: 'EUR', nome: 'Euro', simbolo: '€' },
  { codigo: 'GBP', nome: 'Libra esterlina', simbolo: '£' },
  { codigo: 'ARS', nome: 'Peso argentino', simbolo: 'AR$' },
  { codigo: 'CAD', nome: 'Dólar canadense', simbolo: 'C$' },
  { codigo: 'AUD', nome: 'Dólar australiano', simbolo: 'A$' },
  { codigo: 'JPY', nome: 'Iene japonês', simbolo: '¥' },
  { codigo: 'CHF', nome: 'Franco suíço', simbolo: 'Fr' },
  { codigo: 'CNY', nome: 'Yuan chinês', simbolo: 'CN¥' },
  { codigo: 'BTC', nome: 'Bitcoin', simbolo: '₿' }
]

export const CODIGOS = MOEDAS.map((m) => m.codigo)

// Moedas que aparecem nos cards da página inicial
export const MOEDAS_DESTAQUE = ['USD', 'EUR', 'GBP', 'BTC']

export function acharMoeda(codigo) {
  return MOEDAS.find((m) => m.codigo === codigo)
}

// 'USD' -> 'USD-BRL' (formato que a AwesomeAPI usa no endereço)
export function parComReal(codigo) {
  return `${codigo}-BRL`
}
