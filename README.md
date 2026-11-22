# 💰 Centavo — controle financeiro pessoal

**Centavo** é um sistema de finanças pessoais feito com **Vue.js 3**, **Vue Router 4** e **Bootstrap 5** para a disciplina **Front-End Frameworks (UNAMA)**. O tema sorteado para a equipe foi **Sistema de Finanças**.

Com o Centavo, a pessoa registra receitas e despesas, acompanha o saldo e uma meta de economia, e vê as **cotações do dia de 10 moedas**, que chegam de uma **API pública**.

> **Etapa 4 (entrega final):** o projeto passou a consumir **APIs** com `fetch()` e JSON: cotações (GET), histórico (GET) e envio de alertas (POST). A proposta e as funcionalidades das etapas anteriores foram mantidas. Veja [APIs e integração](#-apis-e-integração-etapa-4).

| Etapa | O que foi feito |
| --- | --- |
| 1 | App One Page com Vue.js (componentes, props, `ref()`, eventos, diretivas), sem Router |
| 2 | Integração do Bootstrap (grid, componentes, utilitários e tema escuro) |
| 3 | Integração do Vue Router: menu com `RouterLink`, páginas com `RouterView`, rota dinâmica e 404 |
| **4** | **Integração com APIs: `fetch()` + JSON, carregamento, tratamento de erros, busca, detalhe, gráfico, conversor e POST** |

## 🔌 Endereço da API

| Método | Endereço | Para que serve |
| --- | --- | --- |
| `GET` | `https://economia.awesomeapi.com.br/json/last/USD-BRL,EUR-BRL,...` | Cotações do dia (10 moedas em uma única chamada) |
| `GET` | `https://economia.awesomeapi.com.br/json/daily/USD-BRL/15` | Histórico dos últimos 15 dias de uma moeda |
| `POST` | `https://jsonplaceholder.typicode.com/posts` | Envio do alerta de cotação (API de teste: responde `201 Created`, mas não grava) |

- **AwesomeAPI** (cotações): documentação em <https://docs.awesomeapi.com.br/api-de-moedas>. Pública, gratuita e sem chave obrigatória.
- **JSONPlaceholder** (API de teste): <https://jsonplaceholder.typicode.com>.

## ✨ Funcionalidades

- **Resumo financeiro:** saldo atual, total de receitas e total de despesas.
- **Nova transação:** formulário com tipo (receita ou despesa), descrição, valor, data e categoria, com validação dos campos.
- **Lista de transações:** da mais recente para a mais antiga, com filtro (Todas, Receitas, Despesas) e exclusão com confirmação.
- **Detalhe da transação:** página própria de cada transação, acessada por um endereço com o código dela (`/transacoes/3`).
- **Meta de economia:** barra de progresso baseada no saldo atual, com meta editável.
- **Cotações do dia (API):** 10 moedas (USD, EUR, GBP, ARS, CAD, AUD, JPY, CHF, CNY e BTC) na página inicial e na página **Cotações**, com **busca** por nome ou código.
- **Detalhe da moeda (API):** cotação de compra e venda, máxima e mínima do dia e **gráfico do histórico dos últimos 15 dias**.
- **Conversor de moedas:** converte de moeda para real e de real para moeda com as cotações da API.
- **Alerta de cotação (POST):** formulário que envia o alerta em JSON para a API de teste.
- **Carregamento e erros:** spinner enquanto a API responde; se falhar, mensagem clara e botão **Tentar novamente**.
- **Ocultar valores:** botão no menu que esconde todos os valores, em todas as páginas.
- **Dados salvos no navegador** (`localStorage`): ao recarregar, as transações e a meta continuam lá.
- **Responsivo** (celular, tablet e computador) e com **tema escuro automático**.

## 🚀 Como executar

Pré-requisito: [Node.js](https://nodejs.org/) versão **20.19 ou superior** (ou 22.12+) e conexão com a internet (para as cotações).

```bash
# 1. Instalar as dependências (Vue, Vue Router e Bootstrap)
npm install

# 2. Rodar em modo de desenvolvimento
npm run dev
```

Depois, abra o endereço mostrado no terminal (normalmente `http://localhost:5173`). Não abra o `index.html` com dois cliques: projeto Vue precisa do servidor do Vite.

Para gerar a versão final e testá-la:

```bash
npm run build
npm run preview
```

**Chave da API (opcional).** O Centavo funciona sem chave. A AwesomeAPI oferece uma chave gratuita para cotações sem o cache de 1 minuto. Se quiser usar, copie `.env.example` para `.env` e preencha `VITE_AWESOMEAPI_KEY`. Atenção: o que começa com `VITE_` fica visível no navegador, então **não publique a chave** no repositório nem no GitHub Pages.

## 🔌 APIs e integração (etapa 4)

### Como uma chamada funciona

```
Usuário abre "Cotações"
   → a página chama carregarCotacoes()               (store/cotacoes.js)
   → o service faz fetch() com GET e limite de 10 s   (services/cotacoesApi.js)
   → a API responde em JSON
   → convertemos os textos em números e guardamos em um ref()
   → o template mostra com v-for, v-if e {{ interpolação }}
```

A AwesomeAPI devolve os números como **texto** (`"bid": "5.4321"`) e usa um objeto cujas chaves são os pares sem hífen (`USDBRL`). O service converte tudo para número e para nomes em português (`compra`, `venda`, `maxima`, `minima`, `variacaoPct`) antes de entregar para as páginas. O histórico chega do dia mais novo para o mais antigo e é invertido para o gráfico.

### Onde está cada requisito da atividade

| Requisito | Onde ver no código |
| --- | --- |
| **GET com `fetch()`** | `src/services/cotacoesApi.js` → `requisitar()`, `buscarCotacoes()`, `buscarCotacao()`, `buscarHistorico()` |
| **Dados com `ref()`** | `src/store/cotacoes.js` (`cotacoes`, `carregando`, `erro`) e `DetalheCotacaoView.vue` (`cotacao`, `historico`) |
| **`v-for`** | `CotacoesView.vue` (lista de `CotacaoLinha`), `InicioView.vue` (cards de moedas), `HistoricoGrafico.vue` (pontos do gráfico) |
| **`v-if` / `v-else`** | `EstadoRequisicao.vue` (spinner, erro e conteúdo), `CotacoesView.vue` (lista vazia) |
| **Interpolação `{{ }}`** | `CotacaoCard.vue`, `CotacaoLinha.vue`, `DetalheCotacaoView.vue` |
| **Interação: pesquisar/filtrar** | `CotacoesView.vue`: campo de busca com `v-model` e `computed` que filtra por nome ou código (sem diferenciar acentos) |
| **Interação: ver detalhes** | rota dinâmica `/cotacoes/:codigo` → `DetalheCotacaoView.vue` (duas chamadas GET) |
| **Desafio: POST** | `AlertaCotacaoForm.vue` → `enviarAlerta()` envia JSON com `method: 'POST'` |
| **Tratamento básico de erros** | `ErroApi` e `requisitar()` no service; `EstadoRequisicao.vue` mostra a mensagem e o botão "Tentar novamente" |

### Carregamento, erros e boa experiência

| Situação | O que o usuário vê |
| --- | --- |
| Esperando a resposta | Spinner e o texto "Carregando dados da API…" |
| API demora mais de **10 segundos** | "A API demorou mais de 10 segundos para responder." (usa `AbortController`) |
| Sem internet / bloqueio | "Não foi possível conectar à API. Verifique sua internet…" |
| HTTP 404, 429 ou 5xx | Mensagem específica para cada caso, com o número do erro |
| Resposta que não é JSON | "A API respondeu em um formato inesperado (JSON inválido)." |
| Qualquer erro | Botão **Tentar novamente**; se já havia dados antigos, eles continuam na tela com o aviso |
| Moeda que o app não conhece (`/cotacoes/XYZ`) | Aviso com link para a lista de moedas |

**Cache de 1 minuto:** a Página Inicial e a página Cotações usam os mesmos dados (`store/cotacoes.js`). Ao trocar de página dentro de 1 minuto, o app **não chama a API de novo**. O botão **Atualizar** ignora o cache. Isso combina com a própria API, que também guarda as cotações por 1 minuto.

### Limitações (para ser transparente na apresentação)

- O **POST** vai para o **JSONPlaceholder**, uma API de teste: ela responde `201 Created` com um `id`, mas **não guarda o alerta**. É só a demonstração do envio em JSON.
- A AwesomeAPI não exige chave para o uso básico, mas pode mudar regras ou ficar fora do ar. Por isso o app trata os erros.
- As cotações são valores de referência, sem taxas, impostos ou spread de casas de câmbio.

## 🧭 Vue Router e SPA (etapa 3)

### O que é uma SPA e como ela difere de um app tradicional

| | Aplicação tradicional (várias páginas HTML) | SPA (Vue Router) |
| --- | --- | --- |
| Como a página é obtida | Cada clique pede um HTML novo ao servidor | O app é carregado **uma vez**; depois só trocamos componentes |
| Recarregamento | A tela inteira recarrega | **Não recarrega**: só a área do `RouterView` muda |
| Estado da aplicação | Perdido a cada página | Preservado (valores ocultos, dados da store, cotações em cache) |
| Velocidade | Mais lenta | Mais rápida, nada é baixado de novo |

No Centavo isso pode ser visto na página **Sobre**: ela mostra o horário em que o app foi carregado. Navegue pelas outras páginas e volte: o horário **não muda**, porque a página não recarregou. Só muda se apertar F5.

### Configuração do router (`src/router/index.js`)

```js
const routes = [
  { path: '/',                 name: 'inicio',         component: InicioView },
  { path: '/transacoes',       name: 'transacoes',     component: TransacoesView },
  { path: '/transacoes/:id',   name: 'transacao',      component: DetalheTransacaoView },  // rota dinâmica
  { path: '/cotacoes',         name: 'cotacoes',       component: CotacoesView },
  { path: '/cotacoes/:codigo', name: 'cotacao',        component: DetalheCotacaoView },    // rota dinâmica
  { path: '/sobre',            name: 'sobre',          component: SobreView },
  { path: '/:pathMatch(.*)*',  name: 'nao-encontrada', component: NaoEncontradoView }      // 404 (sempre por último)
]

const router = createRouter({ history: createWebHashHistory(), routes })
```

| Parte | O que faz |
| --- | --- |
| `createWebHashHistory()` | Modo de histórico com `#` no endereço (`/#/cotacoes`). Funciona em qualquer hospedagem estática, como o GitHub Pages, sem configurar o servidor |
| `:id` e `:codigo` | **Parâmetros dinâmicos**: `/transacoes/3` e `/cotacoes/USD`. O valor é lido com `useRoute().params` |
| `/:pathMatch(.*)*` | **Rota coringa**: pega qualquer endereço que não existe e mostra a página 404. Precisa ficar por último |
| `meta.titulo` + `router.afterEach` | Atualiza o título da aba do navegador a cada página |

### Rotas implementadas

| Endereço | Nome | Página | O que mostra |
| --- | --- | --- | --- |
| `/` | `inicio` | `InicioView.vue` | Resumo (3 cards), cotações do dia, 5 últimas transações e meta de economia |
| `/transacoes` | `transacoes` | `TransacoesView.vue` | Formulário de nova transação e lista completa com filtros |
| `/transacoes/:id` | `transacao` | `DetalheTransacaoView.vue` | Detalhes de uma transação, com opção de excluir |
| `/cotacoes` | `cotacoes` | `CotacoesView.vue` | Busca, lista das 10 moedas e conversor |
| `/cotacoes/:codigo` | `cotacao` | `DetalheCotacaoView.vue` | Detalhe da moeda, gráfico de 15 dias e alerta (POST) |
| `/sobre` | `sobre` | `SobreView.vue` | O projeto, APIs usadas, mapa de rotas e SPA × tradicional |
| qualquer outro | `nao-encontrada` | `NaoEncontradoView.vue` | Página 404 |

O menu (`AppHeader.vue`) usa `RouterLink` e destaca o link da página atual, inclusive nas páginas de detalhe. No celular vira um menu "hambúrguer" controlado pelo Vue, que fecha sozinho ao escolher uma página.

## 🎨 Bootstrap (etapa 2, mantido)

Usamos o **Bootstrap 5.3** pelo **npm** (somente o CSS, sem o JavaScript dele, porque o Vue já controla o HTML). O `src/assets/global.css` só troca as cores padrão pelas do Centavo, sobrescrevendo as variáveis CSS do framework, e garante contraste adequado nos dois temas.

| Classe / recurso | Onde | O que faz |
| --- | --- | --- |
| `container`, `row`, `col-12 col-md-4`, `col-lg-5`, `col-lg-7` | Páginas (`views/`) | Grid responsivo: 1 coluna no celular, 3 cards lado a lado no tablet, 2 colunas no desktop |
| `navbar`, `navbar-expand-md`, `navbar-toggler`, `nav-link` | `AppHeader.vue` | Menu de navegação |
| `card`, `card-header`, `card-body`, `shadow-sm` | Componentes e páginas | Caixas com cabeçalho e sombra |
| `btn btn-primary`, `btn-outline-*`, `btn-danger`, `btn-sm` | Vários | Botões (inclusive em `RouterLink`) |
| `form-control`, `form-select`, `input-group`, `btn-check` | Formulários | Campos estilizados |
| `progress` + `progress-bar-striped` | `MetaEconomia.vue` | Barra da meta |
| `list-group`, `badge`, `table`, `table-responsive`, `dl row` | Listas, Sobre e Detalhes | Listas, tabelas e pares rótulo/valor |
| `spinner-border`, `alert alert-danger` | `EstadoRequisicao.vue` | Carregando e erro da API |
| `text-success`, `text-danger`, `text-body-secondary`, `text-bg-*` | Vários | Cores de receita, despesa, alta e queda |
| `d-flex`, `gap-*`, `mb-*`, `py-*`, `text-break`, `flex-column flex-sm-row` | Vários | Alinhamento, espaçamento e responsividade |

**Atenção com `v-show` e `d-flex`:** as classes `d-*` do Bootstrap usam `!important` e ganham do `display: none` do Vue, por isso o `v-show` fica em elementos sem essas classes.

## 🧩 Tecnologias

- Vue.js 3 com `<script setup>` e Vite.
- **Vue Router 4** (`RouterLink`, `RouterView`, rotas dinâmicas e rota 404).
- Bootstrap 5.3 (somente CSS), instalado via npm.
- `fetch()` nativo do navegador (sem Axios) e JSON.
- Gráfico em **SVG puro** (sem biblioteca de gráficos).
- **Sem** bibliotecas externas de componentes e **sem** bibliotecas de estado (nada de Pinia ou Vuex).

## 📁 Estrutura de arquivos

```
centavo/
├── index.html                     # inclui o script do tema claro/escuro
├── package.json
├── vite.config.js
├── .env.example                   # chave opcional da AwesomeAPI
├── .github/workflows/deploy.yml   # publicação no GitHub Pages
└── src/
    ├── main.js                    # cria o app, registra o router e importa o Bootstrap
    ├── App.vue                    # cabeçalho + <RouterView /> + rodapé
    ├── router/
    │   └── index.js               # tabela de rotas
    ├── services/
    │   └── cotacoesApi.js         # fetch() das APIs, timeout e erros (ETAPA 4)
    ├── store/
    │   ├── financas.js            # transações, meta e valores ocultos
    │   ├── cotacoes.js            # cotações, carregando, erro e cache de 1 min (ETAPA 4)
    │   └── app.js                 # horário de carga (demonstração de SPA)
    ├── views/                     # uma página (componente) por rota
    │   ├── InicioView.vue
    │   ├── TransacoesView.vue
    │   ├── DetalheTransacaoView.vue
    │   ├── CotacoesView.vue       # (ETAPA 4)
    │   ├── DetalheCotacaoView.vue # (ETAPA 4)
    │   ├── SobreView.vue
    │   └── NaoEncontradoView.vue
    ├── components/
    │   ├── AppHeader.vue          ├── ResumoCard.vue
    │   ├── TransacaoForm.vue      ├── MetaEconomia.vue
    │   ├── TransacaoLista.vue     ├── TransacaoItem.vue
    │   ├── EstadoRequisicao.vue   # spinner, erro e "Tentar novamente" (ETAPA 4)
    │   ├── CotacaoCard.vue        ├── CotacaoLinha.vue
    │   ├── SimboloMoeda.vue       ├── VariacaoBadge.vue
    │   ├── ConversorMoeda.vue     ├── HistoricoGrafico.vue
    │   └── AlertaCotacaoForm.vue  # POST (ETAPA 4)
    ├── assets/global.css          # cores do Centavo sobre o Bootstrap
    ├── data/                      # categorias, dados de exemplo e as 10 moedas
    └── utils/                     # formatação e localStorage
```

## 🧱 Componentes

A componentização e a reatividade foram **mantidas e ampliadas**. As **páginas** (`views/`) juntam os componentes, e o `App.vue` ficou só com a estrutura fixa.

| Componente | Para que serve | Props | Eventos |
| --- | --- | --- | --- |
| `AppHeader` | Logo, menu com `RouterLink` e botão de ocultar valores | `valoresVisiveis` | `alternar-valores` |
| `ResumoCard` | Mostra um valor (saldo, receitas ou despesas) | `titulo`, `valor`, `tipo`, `icone`, `visivel` | — |
| `TransacaoForm` | Cadastra uma nova receita ou despesa | — | `adicionar` |
| `MetaEconomia` | Mostra e edita a meta de economia | `meta`, `saldo`, `visivel` | `atualizar-meta` |
| `TransacaoLista` | Lista as transações e aplica o filtro | `transacoes`, `visivel`, `titulo`, `limite`, `mostrarFiltros` | `remover` |
| `TransacaoItem` | Uma transação da lista | `transacao`, `visivel` | `remover` |
| `EstadoRequisicao` | Spinner, erro e conteúdo de qualquer chamada à API | `carregando`, `erro`, `temDados`, `textoCarregando` | `tentar-novamente` |
| `CotacaoCard` | Card de uma moeda (página inicial) | `cotacao` | — |
| `CotacaoLinha` | Linha de uma moeda (página Cotações) | `cotacao` | — |
| `SimboloMoeda` | Círculo com o símbolo da moeda | `codigo` | — |
| `VariacaoBadge` | Variação do dia, com seta e sinal | `valor` | — |
| `ConversorMoeda` | Converte entre real e outra moeda | `cotacoes` | — |
| `HistoricoGrafico` | Gráfico de linha em SVG | `pontos`, `descricao` | — |
| `AlertaCotacaoForm` | Formulário que envia o alerta com POST | `codigo`, `valorAtual` | — |

## 📚 Conceitos de Vue aplicados (e onde ver no código)

| Conceito | Onde |
| --- | --- |
| **Componentes `.vue` com `<script setup>`** | `src/components/`, `src/views/` e `App.vue` |
| **Vue Router: `createRouter` e tabela de rotas** | `src/router/index.js` |
| **`RouterLink` / `RouterView`** | `AppHeader.vue`, `CotacaoCard.vue`, `TransacaoItem.vue` / `App.vue` |
| **Rotas dinâmicas e `useRoute()`** | `router/index.js`, `DetalheTransacaoView.vue`, `DetalheCotacaoView.vue` |
| **Navegação por código (`useRouter().push`)** | `DetalheTransacaoView.vue` |
| **Props e eventos (`defineProps`, `defineEmits`)** | Todos os componentes da tabela acima |
| **`ref()` (reatividade)** | `store/` (dados compartilhados), `TransacaoForm.vue`, `CotacoesView.vue` (`busca`), `AlertaCotacaoForm.vue` |
| **`computed`** | `store/financas.js` (totais), `CotacoesView.vue` (busca), `HistoricoGrafico.vue` |
| **`watch`** | `DetalheCotacaoView.vue` (recarrega quando o código da URL muda), `store/financas.js` (salva no navegador) |
| **`v-model`** | `TransacaoForm.vue`, `MetaEconomia.vue`, `CotacoesView.vue`, `ConversorMoeda.vue`, `AlertaCotacaoForm.vue` |
| **`v-if` / `v-else`** | `EstadoRequisicao.vue`, listas vazias, "não encontrada" |
| **`v-show`** | Formulário de edição da meta e mensagem de sucesso |
| **`v-for`** | Listas de transações, cotações, filtros, categorias, pontos do gráfico, tabelas da página Sobre |
| **`fetch()`, `async/await`, `AbortController`** | `services/cotacoesApi.js` |

## 🧗 Dificuldades e aprendizados

- **API pode falhar:** demora, internet fora do ar, erro do servidor ou resposta inesperada. Criamos o `ErroApi`, um limite de 10 segundos (`AbortController`) e o `EstadoRequisicao`, que mostra spinner, erro e o botão "Tentar novamente".
- **Números chegam como texto:** a AwesomeAPI devolve `"5.4321"`. Convertemos com `Number()` no service e formatamos com `Intl.NumberFormat` (4 casas para cotações pequenas, 2 para as grandes).
- **Muitas chamadas repetidas:** a Página Inicial e a página Cotações pedem os mesmos dados. Um estado compartilhado com cache de 1 minuto evita chamadas desnecessárias.
- **Duas chamadas na mesma página:** o detalhe da moeda faz `GET /last` e `GET /daily`, cada uma com seu carregando e seu erro, para uma não derrubar a outra.
- **Respostas fora de ordem:** se o usuário troca de moeda rápido, uma resposta antiga pode chegar depois. Um contador de pedidos descarta as respostas antigas.
- **Parâmetro da URL:** `:codigo` chega em qualquer caixa (`usd`); convertemos para maiúsculas e conferimos se a moeda existe.
- **Estado entre páginas:** o que era `ref()` dentro do `App.vue` foi para arquivos compartilhados em `store/`.
- **Menu no celular sem JavaScript do Bootstrap:** o Vue controla a classe `show` do menu.

## 🌐 Publicação (GitHub Pages)

O projeto já traz o arquivo `.github/workflows/deploy.yml`. Para publicar:

1. Envie o projeto para um repositório no GitHub (branch `main`).
2. No repositório, vá em **Settings → Pages → Build and deployment → Source** e escolha **GitHub Actions**.
3. A cada `git push` na `main`, o app é construído e publicado. O endereço fica em `https://SEU-USUARIO.github.io/NOME-DO-REPOSITORIO/` (aparece também na aba **Actions**).

```bash
git add .
git commit -m "Etapa 4: integração com APIs"
git push
```

## 🤖 Uso de Inteligência Artificial

A IA foi utilizada como ferramenta de apoio no desenvolvimento, sempre respeitando o conteúdo estudado e as limitações de cada etapa. Todo o código foi revisado, testado e é compreendido pela equipe, inclusive a configuração das rotas e as chamadas às APIs.

### Etapa 1 — Projeto em Vue

| Etapa | Prompt |
| --- | --- |
| **1. Planejamento e divisão em componentes** | "Tenho uma aplicação Vue sobre um sistema de finanças chamado Centavo. Sugira uma divisão em componentes simples e reutilizáveis. Utilize apenas Vue com `<script setup>`, sem bibliotecas externas e sem Vue Router. A aplicação deve ser One Page, ter pelo menos 4 componentes `.vue`, usar props, `ref()`, eventos, `v-if`, `v-show`, `v-for`, `v-model` e CSS próprio." |
| **2. Componente com props e reúso** | "Crie um componente Vue simples que receba título, valor e tipo através de props. Utilize `<script setup>` e CSS próprio, sem bibliotecas externas." |
| **3. Reutilização com props** | "Como posso reutilizar este componente para apresentar diferentes informações usando props?" |
| **4. Reatividade e eventos** | "Sugira uma interação simples utilizando `ref()` e `@click` para adicionar reatividade a este componente." |
| **5. Formulário** | "Como utilizar `v-model` neste formulário Vue? Explique o funcionamento do código." |
| **6. Lista com componente reutilizável** | "Como utilizar `v-for` para apresentar esta lista utilizando um componente reutilizável?" |
| **7. Estilização** | "Crie o CSS do aplicativo usando apenas CSS puro, com variáveis, layout responsivo para celular e tema escuro, sem Bootstrap, Tailwind ou outras bibliotecas." |
| **8. Revisão final** | "Revise este código utilizando somente os conceitos básicos de Vue: componentes, props, `ref`, eventos, `v-if`, `v-for` e `v-model`." |

### Etapa 2 — Evolução com Bootstrap

A IA apoiou a integração do Bootstrap e a troca do CSS próprio pelas classes do framework, mantendo os componentes, as props, os eventos e a reatividade como estavam.

### Etapa 3 — Vue Router

| Etapa | Prompt |
| --- | --- |
| **1. Planejamento das rotas** | "Tenho um projeto Vue de finanças chamado Centavo, com Bootstrap. Quero integrar o Vue Router mantendo a proposta e as funcionalidades. Sugira pelo menos 3 rotas e como organizar as páginas como componentes." |
| **2. Configuração** | "Como instalar e configurar o Vue Router em um projeto Vite com `<script setup>`? Explique `createRouter`, a lista de rotas e o `app.use(router)`." |
| **3. Navegação** | "Como criar um menu de navegação usando `RouterLink` e `RouterView`, com o Bootstrap, destacando a página atual?" |
| **4. Desafio** | "Como criar uma rota dinâmica `/transacoes/:id` e uma página 404? Explique `useRoute` e a rota coringa." |
| **5. Entendimento** | "Explique, em palavras simples, a diferença entre uma SPA e uma aplicação tradicional de várias páginas." |

### Etapa 4 — Integração com APIs

| Etapa | Prompt |
| --- | --- |
| **1. Escolha da API** | "O Centavo é um sistema de finanças em Vue com Bootstrap e Vue Router. Sugira uma API pública e gratuita, sem chave obrigatória, que combine com o tema e que eu possa chamar com `fetch()` direto do navegador." |
| **2. GET com `fetch()`** | "Como fazer uma requisição GET com `fetch()` e `async/await` em um projeto Vue com `<script setup>` e mostrar os dados com `ref()` e `v-for`?" |
| **3. Carregamento e erros** | "Como mostrar um spinner enquanto a API responde e uma mensagem de erro com botão 'Tentar novamente' se der errado? Como colocar um limite de tempo no `fetch()`?" |
| **4. Interação com os dados** | "Como filtrar a lista de cotações enquanto o usuário digita, ignorando acentos e maiúsculas, usando `v-model` e `computed`?" |
| **5. Rota com dados da API** | "Como carregar os dados de uma moeda a partir do parâmetro `:codigo` da rota e recarregar quando o código muda?" |
| **6. Desafio: POST** | "Como enviar um formulário com `fetch()` usando `POST` e JSON e mostrar a resposta da API para o usuário?" |
| **7. Revisão** | "Revise as chamadas à API do meu projeto: tratamento de erros, respostas fora de ordem e números que chegam como texto." |

## 👥 Equipe

| Integrante | Matrícula | Contribuição |
| --- | --- | --- |
| Enzo Ricardo Santos Vida | 04207511 | Vídeo e apresentação |
| Samuel Teixeira | 04204648 | Programação e código |
| Assem Arthur Farias César | 04215431 | _(a equipe preenche)_ |
| João Victor Bacelar Nascimento | 04213115 | _(a equipe preenche)_ |
| Heitor Botelho Freire da Silva | 04215617 | _(a equipe preenche)_ |

Projeto desenvolvido para a disciplina **Front-End Frameworks** — Análise e Desenvolvimento de Sistemas, UNAMA.
