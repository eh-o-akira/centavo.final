<script setup>
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="container py-5 text-center">
    <p class="display-1 fw-bold text-body-secondary mb-0">404</p>
    <h1 class="h3">Página não encontrada</h1>
    <p class="text-body-secondary">
      O endereço <code class="text-break">{{ route.fullPath }}</code> não existe no Centavo.
    </p>
    <div class="d-flex flex-wrap justify-content-center gap-2">
      <RouterLink to="/" class="btn btn-primary">Ir para o início</RouterLink>
      <RouterLink to="/cotacoes" class="btn btn-outline-primary">Ver cotações</RouterLink>
    </div>
  </div>
</template>
