// src/lib/algorithms/bfs.ts

export type NodeType = {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isVisited: boolean;
  isPath: boolean;
};

export function executarBFS(grid: NodeType[][], startNode: NodeType, endNode: NodeType) {
  const nosVisitadosEmOrdem: NodeType[] = [];
  const fila: NodeType[] = [startNode];
  
  // Usamos um Set e um Map para a matemática sem alterar a tela ainda
  const visitados = new Set<NodeType>();
  visitados.add(startNode);
  
  const nosAnteriores = new Map<NodeType, NodeType>();

  while (fila.length > 0) {
    // Pega o primeiro da fila
    const noAtual = fila.shift()!;

    // Pula se for parede
    if (noAtual.isWall) continue;

    // Guarda na lista de animação
    nosVisitadosEmOrdem.push(noAtual);

    // Chegamos no final?
    if (noAtual === endNode) {
      return { nosVisitadosEmOrdem, nosAnteriores };
    }

    // Pega os vizinhos em formato de cruz (Cima, Baixo, Esquerda, Direita)
    const vizinhos = pegarVizinhos(noAtual, grid);
    for (const vizinho of vizinhos) {
      if (!visitados.has(vizinho)) {
        visitados.add(vizinho);
        nosAnteriores.set(vizinho, noAtual); // Lembra de onde viemos (rastro de migalhas)
        fila.push(vizinho);
      }
    }
  }

  // Retorna o que conseguiu caso não tenha saída
  return { nosVisitadosEmOrdem, nosAnteriores };
}

// Função auxiliar para achar os vizinhos sem sair dos limites da matriz
function pegarVizinhos(no: NodeType, grid: NodeType[][]) {
  const vizinhos: NodeType[] = [];
  const { row, col } = no;
  
  if (row > 0) vizinhos.push(grid[row - 1][col]); // Cima
  if (row < grid.length - 1) vizinhos.push(grid[row + 1][col]); // Baixo
  if (col > 0) vizinhos.push(grid[row][col - 1]); // Esquerda
  if (col < grid[0].length - 1) vizinhos.push(grid[row][col + 1]); // Direita

  return vizinhos;
}

// Função para traçar o caminho de volta depois que acha o fim
export function pegarCaminhoMaisCurto(endNode: NodeType, nosAnteriores: Map<NodeType, NodeType>) {
  const caminho: NodeType[] = [];
  let noAtual: NodeType | undefined = endNode;
  
  // Volta de trás pra frente seguindo o rastro de migalhas
  while (noAtual !== undefined) {
    caminho.unshift(noAtual);
    noAtual = nosAnteriores.get(noAtual);
  }
  return caminho;
}