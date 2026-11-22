<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { buscarTransacao, removerTransacao, valoresVisiveis } from '../store/financas'
import { mostrarValor, formatarData } from '../utils/formatar'

const route = useRoute()
const router = useRouter()

// :id chega da URL como TEXTO, então convertemos para número antes de buscar
const transacao = computed(() => buscarTransacao(Number(route.params.id)))

function excluir() {
  const id = transacao.value.id
  // primeiro volta para a lista e só depois remove, para a tela não piscar "não encontrada"
  router.push('/transacoes').then(() => removerTransacao(id))
}
</script>

<template>
  <div class="container py-4">
    <RouterLink to="/transacoes" class="d-inline-block mb-3">← Voltar para transações</RouterLink>

    <div v-if="transacao" class="card shadow-sm">
      <div class="card-header fw-semibold">Detalhe da transação #{{ transacao.id }}</div>
      <div class="card-body">
        <dl class="row mb-0">
          <dt class="col-sm-3">Descrição</dt>
          <dd class="col-sm-9 text-break">{{ transacao.descricao }}</dd>
          <dt class="col-sm-3">Tipo</dt>
          <dd class="col-sm-9">
            <span class="badge" :class="transacao.tipo === 'receita' ? 'text-bg-success' : 'text-bg-danger'">
              {{ transacao.tipo === 'receita' ? 'Receita' : 'Despesa' }}
            </span>
          </dd>
          <dt class="col-sm-3">Valor</dt>
          <dd class="col-sm-9 numero fw-semibold">{{ mostrarValor(transacao.valor, valoresVisiveis) }}</dd>
          <dt class="col-sm-3">Data</dt>
          <dd class="col-sm-9">{{ formatarData(transacao.data) }}</dd>
          <dt class="col-sm-3">Categoria</dt>
          <dd class="col-sm-9 mb-0">{{ transacao.categoria }}</dd>
        </dl>
      </div>
      <div class="card-footer">
        <button type="button" class="btn btn-danger btn-sm" @click="excluir">Excluir transação</button>
      </div>
    </div>

    <div v-else class="alert alert-warning" role="alert">
      Não encontramos a transação <strong>{{ route.params.id }}</strong>. Ela pode ter sido excluída.
    </div>
  </div>
</template>
