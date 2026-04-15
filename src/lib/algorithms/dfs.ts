// src/lib/algorithms/dfs.ts
import type { NodeType } from './bfs';

export function executarDFS(grid: NodeType[][], startNode: NodeType, endNode: NodeType) {
  const nosVisitadosEmOrdem: NodeType[] = [];
  
  // No DFS, usamos uma PILHA (Stack) em vez de uma FILA
  const pilha: NodeType[] = [startNode];
  
  const visitados = new Set<NodeType>();
  const nosAnteriores = new Map<NodeType, NodeType>();

  visitados.add(startNode);

  while (pilha.length > 0) {
    // A MÁGICA AQUI: O .pop() tira sempre o ÚLTIMO que entrou, criando o efeito de "ir até o fundo"
    const noAtual = pilha.pop()!;

    if (noAtual.isWall) continue;
    
    nosVisitadosEmOrdem.push(noAtual);

    if (noAtual === endNode) {
      return { nosVisitadosEmOrdem, nosAnteriores };
    }

    const vizinhos = pegarVizinhos(noAtual, grid);
    
    for (const vizinho of vizinhos) {
      if (!visitados.has(vizinho)) {
        visitados.add(vizinho);
        nosAnteriores.set(vizinho, noAtual);
        pilha.push(vizinho); // Adiciona no topo da pilha
      }
    }
  }

  return { nosVisitadosEmOrdem, nosAnteriores };
}

// A ordem em que pegamos os vizinhos afeta a "direção" da cobrinha no DFS
function pegarVizinhos(no: NodeType, grid: NodeType[][]) {
  const vizinhos: NodeType[] = [];
  const { row, col } = no;
  
  // Vamos buscar na ordem: Cima, Direita, Baixo, Esquerda
  if (row > 0) vizinhos.push(grid[row - 1][col]);
  if (col < grid[0].length - 1) vizinhos.push(grid[row][col + 1]);
  if (row < grid.length - 1) vizinhos.push(grid[row + 1][col]);
  if (col > 0) vizinhos.push(grid[row][col - 1]);
  
  return vizinhos;
}