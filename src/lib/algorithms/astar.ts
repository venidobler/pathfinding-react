// src/lib/algorithms/astar.ts
import type { NodeType } from './bfs';

export function executarAStar(grid: NodeType[][], startNode: NodeType, endNode: NodeType) {
  const nosVisitadosEmOrdem: NodeType[] = [];
  const openSet: NodeType[] = [startNode];
  const closedSet = new Set<NodeType>();
  const nosAnteriores = new Map<NodeType, NodeType>();

  const gScore = new Map<NodeType, number>();
  const fScore = new Map<NodeType, number>();

  gScore.set(startNode, 0);
  fScore.set(startNode, calcularHeuristica(startNode, endNode));

  while (openSet.length > 0) {
    // CORREÇÃO: Usando ?? em vez de ||
    openSet.sort((a, b) => (fScore.get(a) ?? Infinity) - (fScore.get(b) ?? Infinity));
    const noAtual = openSet.shift()!;

    if (noAtual.isWall) continue;
    nosVisitadosEmOrdem.push(noAtual);

    if (noAtual === endNode) {
      return { nosVisitadosEmOrdem, nosAnteriores };
    }

    closedSet.add(noAtual);

    const vizinhos = pegarVizinhos(noAtual, grid);
    
    for (const vizinho of vizinhos) {
      if (closedSet.has(vizinho) || vizinho.isWall) continue;

      // CORREÇÃO: Usando ?? em vez de ||
      const gScoreTentativa = (gScore.get(noAtual) ?? Infinity) + 1;

      // CORREÇÃO: Usando ?? em vez de ||
      if (gScoreTentativa < (gScore.get(vizinho) ?? Infinity)) {
        nosAnteriores.set(vizinho, noAtual);
        gScore.set(vizinho, gScoreTentativa);
        fScore.set(vizinho, gScoreTentativa + calcularHeuristica(vizinho, endNode));

        if (!openSet.includes(vizinho)) {
          openSet.push(vizinho);
        }
      }
    }
  }

  return { nosVisitadosEmOrdem, nosAnteriores };
}

function pegarVizinhos(no: NodeType, grid: NodeType[][]) {
  const vizinhos: NodeType[] = [];
  const { row, col } = no;
  if (row > 0) vizinhos.push(grid[row - 1][col]);
  if (row < grid.length - 1) vizinhos.push(grid[row + 1][col]);
  if (col > 0) vizinhos.push(grid[row][col - 1]);
  if (col < grid[0].length - 1) vizinhos.push(grid[row][col + 1]);
  return vizinhos;
}

function calcularHeuristica(noA: NodeType, noB: NodeType) {
  return Math.abs(noA.row - noB.row) + Math.abs(noA.col - noB.col);
}