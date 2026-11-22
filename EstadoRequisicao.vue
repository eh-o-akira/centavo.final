<script setup>
// Mostra o estado de uma chamada à API, para toda página que usa dados externos:
//   - carregando e ainda sem dados -> spinner
//   - erro -> mensagem clara + botão "Tentar novamente"
//   - com dados -> o conteúdo da página (slot)
defineProps({
  carregando: { type: Boolean, default: false },
  erro: { type: String, default: '' },
  temDados: { type: Boolean, default: false },
  textoCarregando: { type: String, default: 'Carregando dados da API…' }
})
const emit = defineEmits(['tentar-novamente'])
</script>

<template>
  <div>
    <div v-if="carregando && !temDados && !erro" class="text-center py-5" role="status">
      <div class="spinner-border text-primary" aria-hidden="true"></div>
      <p class="mt-3 mb-0 text-body-secondary">{{ textoCarregando }}</p>
    </div>

    <div v-if="erro" class="alert alert-danger" role="alert">
      <div class="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
        <div>
          <strong>Não deu certo.</strong> {{ erro }}
          <span v-if="temDados" class="d-block small">Os dados abaixo são da última vez que a API respondeu.</span>
        </div>
        <button
          type="button"
          class="btn btn-sm btn-outline-danger flex-shrink-0"
          :disabled="carregando"
          @click="emit('tentar-novamente')"
        >
          {{ carregando ? 'Tentando…' : 'Tentar novamente' }}
        </button>
      </div>
    </div>

    <slot v-if="temDados" />
  </div>
</template>
