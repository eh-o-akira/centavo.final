<script setup>
import { routes } from '../router'
import { carregadoEm } from '../store/app'
import { formatarHora } from '../utils/formatar'
import { API_COTACOES, API_TESTE } from '../services/cotacoesApi'

// Tabela de rotas: gerada a partir da própria lista de rotas do router
const rotas = routes.map((r) => ({
  endereco: r.path === '/:pathMatch(.*)*' ? 'qualquer outro' : r.path,
  nome: r.name,
  pagina: r.meta.titulo
}))

// APIs usadas pelo app (os mesmos endereços do código em services/cotacoesApi.js)
const apis = [
  { metodo: 'GET', endereco: `${API_COTACOES}/json/last/USD-BRL,EUR-BRL,…`, uso: 'Cotações do dia (página Cotações e Início)' },
  { metodo: 'GET', endereco: `${API_COTACOES}/json/daily/USD-BRL/15`, uso: 'Histórico de 15 dias (detalhe da moeda)' },
  { metodo: 'POST', endereco: `${API_TESTE}/posts`, uso: 'Envio do alerta de cotação (API de teste)' }
]
</script>

<template>
  <div class="container py-4">
    <h1 class="h3 mb-3">Sobre o Centavo</h1>

    <div class="row g-3">
      <div class="col-12 col-lg-6">
        <div class="card shadow-sm h-100">
          <div class="card-header fw-semibold">O projeto</div>
          <div class="card-body">
            <p>
              O <strong>Centavo</strong> é um sistema de finanças pessoais feito para a disciplina
              <strong>Front-End Frameworks</strong> (ADS · UNAMA). Ele registra receitas e despesas, acompanha uma meta de
              economia e mostra as cotações do dia de 10 moedas.
            </p>
            <p class="mb-0">
              Feito com <strong>Vue.js 3</strong>, <strong>Vue Router 4</strong> e <strong>Bootstrap 5.3</strong>. Os dados
              externos chegam por <code>fetch()</code> em formato JSON.
            </p>
          </div>
        </div>
      </div>

      <div class="col-12 col-lg-6">
        <div class="card shadow-sm h-100">
          <div class="card-header fw-semibold">Demonstração de SPA</div>
          <div class="card-body">
            <p>
              O app foi carregado às <strong class="numero">{{ formatarHora(carregadoEm.getTime()) }}</strong>.
            </p>
            <p class="mb-0">
              Navegue por outras páginas e volte: este horário <strong>não muda</strong>, porque a página não recarrega.
              Só muda se apertar F5.
            </p>
          </div>
        </div>
      </div>

      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header fw-semibold">APIs utilizadas</div>
          <div class="table-responsive">
            <table class="table mb-0 align-middle">
              <thead>
                <tr>
                  <th scope="col">Método</th>
                  <th scope="col">Endereço</th>
                  <th scope="col">Para que serve</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="api in apis" :key="api.metodo + api.endereco">
                  <td><span class="badge" :class="api.metodo === 'GET' ? 'text-bg-primary' : 'text-bg-warning'">{{ api.metodo }}</span></td>
                  <td><code class="text-break">{{ api.endereco }}</code></td>
                  <td>{{ api.uso }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header fw-semibold">Mapa de rotas</div>
          <div class="table-responsive">
            <table class="table mb-0 align-middle">
              <thead>
                <tr>
                  <th scope="col">Endereço</th>
                  <th scope="col">Nome</th>
                  <th scope="col">Página</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="rota in rotas" :key="rota.nome">
                  <td><code>{{ rota.endereco }}</code></td>
                  <td>{{ rota.nome }}</td>
                  <td>{{ rota.pagina }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="col-12">
        <div class="card shadow-sm">
          <div class="card-header fw-semibold">SPA × aplicação tradicional</div>
          <div class="table-responsive">
            <table class="table mb-0">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th scope="col">Tradicional (várias páginas HTML)</th>
                  <th scope="col">SPA (Vue Router)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <th scope="row">Cada clique</th>
                  <td>Pede um HTML novo ao servidor</td>
                  <td>Só troca o componente da página</td>
                </tr>
                <tr>
                  <th scope="row">Recarrega a tela?</th>
                  <td>Sim, inteira</td>
                  <td>Não</td>
                </tr>
                <tr>
                  <th scope="row">Estado do app</th>
                  <td>Perdido a cada página</td>
                  <td>Preservado (valores ocultos, cotações em cache)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
