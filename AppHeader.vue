<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'

defineProps({
  valoresVisiveis: { type: Boolean, default: true }
})
const emit = defineEmits(['alternar-valores'])

// Sem o JavaScript do Bootstrap: o Vue controla se o menu do celular está aberto
const menuAberto = ref(false)
function fecharMenu() {
  menuAberto.value = false
}

const links = [
  { para: '/', texto: 'Início' },
  { para: '/transacoes', texto: 'Transações' },
  { para: '/cotacoes', texto: 'Cotações' },
  { para: '/sobre', texto: 'Sobre' }
]

// O link fica destacado na página dele e também nas páginas de detalhe
// (ex.: "Cotações" continua ativo em /cotacoes/USD)
const route = useRoute()
function estaAtivo(para) {
  return para === '/' ? route.path === '/' : route.path === para || route.path.startsWith(para + '/')
}
</script>

<template>
  <!-- data-bs-theme="dark": texto claro sobre o fundo escuro, nos dois temas -->
  <nav class="navbar navbar-expand-md centavo-navbar" data-bs-theme="dark">
    <div class="container">
      <RouterLink to="/" class="navbar-brand d-flex align-items-center gap-2" @click="fecharMenu">
        <span class="centavo-logo" aria-hidden="true">C</span>
        <span class="fw-semibold">Centavo</span>
      </RouterLink>

      <button
        type="button"
        class="navbar-toggler"
        aria-controls="menu-principal"
        :aria-expanded="menuAberto"
        aria-label="Abrir ou fechar o menu"
        @click="menuAberto = !menuAberto"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <div id="menu-principal" class="collapse navbar-collapse" :class="{ show: menuAberto }">
        <ul class="navbar-nav me-auto mb-2 mb-md-0">
          <li v-for="link in links" :key="link.para" class="nav-item">
            <RouterLink
              :to="link.para"
              class="nav-link"
              :class="{ active: estaAtivo(link.para) }"
              :aria-current="estaAtivo(link.para) ? 'page' : null"
              @click="fecharMenu"
            >
              {{ link.texto }}
            </RouterLink>
          </li>
        </ul>

        <button
          type="button"
          class="btn btn-sm btn-outline-light"
          :aria-pressed="!valoresVisiveis"
          @click="emit('alternar-valores')"
        >
          {{ valoresVisiveis ? 'Ocultar valores' : 'Mostrar valores' }}
        </button>
      </div>
    </div>
  </nav>
</template>
