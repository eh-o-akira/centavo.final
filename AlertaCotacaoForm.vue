<script setup>
import { ref } from 'vue'
import { enviarAlerta } from '../services/cotacoesApi'
import { formatarCotacao } from '../utils/formatar'

// Formulário que envia um alerta de cotação com POST (JSON) para a API de teste.
const props = defineProps({
  codigo: { type: String, required: true },
  valorAtual: { type: Number, default: 0 }
})

const condicao = ref('acima')
const alvo = ref('')
const erroCampo = ref('')
const enviando = ref(false)
const erroEnvio = ref('')
const resposta = ref(null) // o que a API devolveu (inclui o id criado)

async function enviar() {
  erroCampo.value = ''
  erroEnvio.value = ''
  const valorAlvo = Number(String(alvo.value).replace(',', '.'))
  if (!Number.isFinite(valorAlvo) || valorAlvo <= 0) {
    erroCampo.value = 'Informe um valor maior que zero. Ex.: 5,50'
    return
  }
  enviando.value = true
  resposta.value = null
  try {
    resposta.value = await enviarAlerta({ codigo: props.codigo, condicao: condicao.value, valorAlvo })
  } catch (e) {
    erroEnvio.value = e.message
  } finally {
    enviando.value = false
  }
}
</script>

<template>
  <div class="card shadow-sm">
    <div class="card-header fw-semibold">Criar alerta de cotação</div>
    <form class="card-body" novalidate @submit.prevent="enviar">
      <p class="small text-body-secondary">
        Cotação atual: <strong class="numero">{{ formatarCotacao(valorAtual) }}</strong>. Os dados são enviados para a
        API de teste (JSONPlaceholder) com <code>POST</code>.
      </p>

      <div class="row g-2 mb-3">
        <div class="col-12 col-sm-5">
          <label for="alerta-condicao" class="form-label small mb-1">Avisar quando ficar</label>
          <select id="alerta-condicao" v-model="condicao" class="form-select">
            <option value="acima">acima de</option>
            <option value="abaixo">abaixo de</option>
          </select>
        </div>
        <div class="col-12 col-sm-7">
          <label for="alerta-valor" class="form-label small mb-1">Valor (R$)</label>
          <input
            id="alerta-valor"
            v-model="alvo"
            type="text"
            inputmode="decimal"
            class="form-control"
            :class="{ 'is-invalid': erroCampo }"
            placeholder="0,00"
          />
          <div v-if="erroCampo" class="invalid-feedback">{{ erroCampo }}</div>
        </div>
      </div>

      <button type="submit" class="btn btn-primary w-100" :disabled="enviando">
        <span v-if="enviando" class="spinner-border spinner-border-sm me-2" aria-hidden="true"></span>
        {{ enviando ? 'Enviando…' : 'Enviar alerta' }}
      </button>

      <div v-if="resposta" class="alert alert-success mt-3 mb-0" role="status">
        <strong>Alerta enviado!</strong> A API respondeu <code>201 Created</code> com o id
        <strong>{{ resposta.id }}</strong>.
        <span class="d-block small">É uma API de teste: ela confirma o envio, mas não guarda o alerta.</span>
      </div>
      <div v-if="erroEnvio" class="alert alert-danger mt-3 mb-0" role="alert">{{ erroEnvio }}</div>
    </form>
  </div>
</template>
