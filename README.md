# Visualizador de Algoritmos de Pathfinding (React Edition) ⚛️

Este projeto é uma das frentes de um **estudo comparativo de performance** entre frameworks front-end. O objetivo é visualizar o funcionamento de algoritmos de busca (BFS, A*) em uma malha interativa de 800 nós.

## 🧪 O Experimento
Esta versão foi construída utilizando **React 19** para testar como o motor de **Virtual DOM** lida com atualizações de estado de alta frequência. Em uma grid de pathfinding, cada movimento do mouse para "pintar" paredes ou cada passo do algoritmo exige que a interface reaja instantaneamente.

### Observações Técnicas (React):
- **Gerenciamento de Estado:** Utiliza `useState` para a malha complexa.
- **Renderização:** O desafio aqui é a "reconciliação". Como o React trabalha com uma cópia da árvore de componentes, atualizar 800 nós simultaneamente permite observar o custo computacional do Virtual DOM em comparação com abordagens nativas.
- **Tailwind v4:** Implementação de estilos moderna e ultra-leve sem arquivos de configuração externos.

## 🛠️ Tecnologias
- **Framework:** React 19 (Vite)
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS v4
- **Algoritmos:** BFS (Busca em Largura), A* (A-Star) e DFS (Busca em Profundidade).

## 🏁 Como rodar
1. Clone o repositório
2. Instale as dependências: `npm install`
3. Inicie o servidor: `npm run dev`

---
> **Nota de Estudo:** Confira a versão deste mesmo projeto feita em [Svelte 5](https://github.com/venidobler/pathfinding-visualizer) para comparar a fluidez da reatividade nativa vs Virtual DOM.