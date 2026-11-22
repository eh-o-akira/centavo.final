// Leitura e gravação no localStorage, sempre com try/catch:
// o navegador pode bloquear o armazenamento (aba anônima, por exemplo).

export function lerJSON(chave, padrao) {
  try {
    const texto = localStorage.getItem(chave)
    return texto === null ? padrao : JSON.parse(texto)
  } catch {
    return padrao
  }
}

export function salvarJSON(chave, valor) {
  try {
    localStorage.setItem(chave, JSON.stringify(valor))
  } catch {
    // sem espaço ou sem permissão: o app continua funcionando, só não guarda
  }
}
