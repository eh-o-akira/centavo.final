<script setup>
import { ref, computed } from 'vue'
import { formatarQuantia } from '../utils/formatar'

// Converte entre real e outra moeda usando as cotações que vieram da API.
// Compra (bid): quanto vale 1 unidade da moeda em reais. Venda (ask): preço para comprar a moeda.
const props = defineProps({
  cotacoes: { type: Array, required: true }
})

const quantia = ref('100')
const codigo = ref('USD')
const sentido = ref('para-real') // 'para-real' (moeda → R$) ou 'de-real' (R$ → moeda)

const cotacao = computed(() => props.cotacoes.find((c) => c.codigo === codigo.value))
const numero = computed(() => Number(String(quantia.value).replace(',', '.')))
const quantiaValida = computed(() => Number.isFinite(numero.value) && numero.value >= 0 && String(quantia.value).trim() !== '')

const resultado = computed(() => {
  if (!cotacao.value || !quantiaValida.value) return null
  return sentido.value === 'para-real' ? numero.value * cotacao.value.compra : numero.value / cotacao.value.venda
})

const frase = computed(() => {
  if (resultado.value === null) return ''
  const origem = formatarQuantia(numero.value)
  const destino = formatarQuantia(resultado.value)
  return sentido.value === 'para-real'
    ? `${origem} ${codigo.value} = R$ ${destino}`
    : `R$ ${origem} = ${destino} ${codigo.value}`
})
</script>

<template>
  <div class="card shadow-sm">
    <div class="card-header fw-semibold">Conversor de moedas</div>
    <div class="card-body">
      <div class="btn-group w-100 mb-3" role="group" aria-label="Sentido da conversão">
        <input id="sentido-para-real" v-model="sentido" type="radio" class="btn-check" value="para-real" />
        <label class="btn btn-outline-primary btn-sm" for="sentido-para-real">Moeda → Real</label>
        <input id="sentido-de-real" v-model="sentido" type="radio" class="btn-check" value="de-real" />
        <label class="btn btn-outline-primary btn-sm" for="sentido-de-real">Real → Moeda</label>
      </div>

      <div class="row g-2 mb-3">
        <div class="col-7">
          <label for="conv-quantia" class="form-label small mb-1">Quantia</label>
          <input
            id="conv-quantia"
            v-model="quantia"
            type="text"
            inputmode="decimal"
            class="form-control"
            :class="{ 'is-invalid': !quantiaValida }"
          />
        </div>
        <div class="col-5">
          <label for="conv-moeda" class="form-label small mb-1">Moeda</label>
          <select id="conv-moeda" v-model="codigo" class="form-select">
            <option v-for="c in cotacoes" :key="c.codigo" :value="c.codigo">{{ c.codigo }}</option>
          </select>
        </div>
      </div>

      <p v-if="resultado !== null" class="fs-5 fw-bold mb-1 numero text-break" role="status">{{ frase }}</p>
      <p v-else class="text-danger mb-1" role="alert">Digite uma quantia válida (ex.: 100 ou 12,50).</p>
      <p class="small text-body-secondary mb-0">
        Usa a cotação de {{ sentido === 'para-real' ? 'compra' : 'venda' }} da API, sem taxas ou impostos.
      </p>
    </div>
  </div>
</template>
