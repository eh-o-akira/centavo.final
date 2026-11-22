import { createRouter, createWebHashHistory } from 'vue-router'
import InicioView from '../views/InicioView.vue'
import TransacoesView from '../views/TransacoesView.vue'
import DetalheTransacaoView from '../views/DetalheTransacaoView.vue'
import CotacoesView from '../views/CotacoesView.vue'
import DetalheCotacaoView from '../views/DetalheCotacaoView.vue'
import SobreView from '../views/SobreView.vue'
import NaoEncontradoView from '../views/NaoEncontradoView.vue'

// Tabela de rotas: para cada endereço, qual página (componente) mostrar.
export const routes = [
  { path: '/', name: 'inicio', component: InicioView, meta: { titulo: 'Início' } },
  { path: '/transacoes', name: 'transacoes', component: TransacoesView, meta: { titulo: 'Transações' } },
  // rota dinâmica: :id muda a cada transação (/transacoes/3)
  { path: '/transacoes/:id', name: 'transacao', component: DetalheTransacaoView, meta: { titulo: 'Detalhe da transação' } },
  { path: '/cotacoes', name: 'cotacoes', component: CotacoesView, meta: { titulo: 'Cotações' } },
  // rota dinâmica: :codigo é a moeda (/cotacoes/USD)
  { path: '/cotacoes/:codigo', name: 'cotacao', component: DetalheCotacaoView, meta: { titulo: 'Detalhe da cotação' } },
  { path: '/sobre', name: 'sobre', component: SobreView, meta: { titulo: 'Sobre' } },
  // rota coringa (404): precisa ser SEMPRE a última, porque casa com qualquer endereço
  { path: '/:pathMatch(.*)*', name: 'nao-encontrada', component: NaoEncontradoView, meta: { titulo: 'Página não encontrada' } }
]

const router = createRouter({
  // modo hash (/#/cotacoes): funciona no GitHub Pages sem configurar o servidor
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

// Atualiza o título da aba do navegador a cada página
router.afterEach((to) => {
  document.title = `Centavo — ${to.meta.titulo ?? ''}`
})

export default router
