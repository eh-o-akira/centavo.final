<script setup>
import AppHeader from './components/AppHeader.vue'
import { valoresVisiveis, alternarValores, restaurarExemplos } from './store/financas'
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <!-- cabeçalho e rodapé ficam fixos; só o <RouterView /> troca de página -->
    <AppHeader :valores-visiveis="valoresVisiveis" @alternar-valores="alternarValores" />

    <main class="flex-grow-1">
      <RouterView />
    </main>

    <footer class="border-top py-3 mt-4">
      <div class="container d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-2">
        <small class="text-body-secondary">
          Centavo · feito com Vue.js, Vue Router, Bootstrap e APIs públicas
        </small>
        <button type="button" class="btn btn-sm btn-outline-secondary" @click="restaurarExemplos">
          Restaurar dados de exemplo
        </button>
      </div>
    </footer>
  </div>
</template>
