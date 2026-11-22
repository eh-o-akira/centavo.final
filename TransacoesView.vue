<script setup>
import TransacaoForm from '../components/TransacaoForm.vue'
import TransacaoLista from '../components/TransacaoLista.vue'
import { transacoes, valoresVisiveis, adicionarTransacao, removerTransacao } from '../store/financas'
</script>

<template>
  <div class="container py-4">
    <h1 class="h3 mb-3">Transações</h1>
    <div class="row g-3">
      <div class="col-12 col-lg-5">
        <TransacaoForm @adicionar="adicionarTransacao" />
      </div>
      <div class="col-12 col-lg-7">
        <!-- a mesma TransacaoLista da página inicial, agora completa e com filtros -->
        <TransacaoLista
          :transacoes="transacoes"
          :visivel="valoresVisiveis"
          titulo="Todas as transações"
          @remover="removerTransacao"
        />
      </div>
    </div>
  </div>
</template>
