// src/components/Grid.tsx
import React, { useState, useRef } from 'react';
import { Node } from '././Node';
import { type NodeType, executarBFS, pegarCaminhoMaisCurto } from "../lib/algorithms/bfs";
import { executarAStar } from '../lib/algorithms/astar';
import { executarDFS } from '../lib/algorithms/dfs';

const NUM_ROWS = 20;
const NUM_COLS = 40;
const START_NODE_ROW = 10;
const START_NODE_COL = 5;
const END_NODE_ROW = 10;
const END_NODE_COL = 34;

const createNode = (col: number, row: number): NodeType => {
    return {
        col,
        row,
        isStart: row === START_NODE_ROW && col === START_NODE_COL,
        isEnd: row === END_NODE_ROW && col === END_NODE_COL,
        isWall: false,
        isVisited: false,
        isPath: false,
    };
};

const createInitialGrid = () => {
    const grid: NodeType[][] = [];
    for (let row = 0; row < NUM_ROWS; row++) {
        const currentRow: NodeType[] = [];
        for (let col = 0; col < NUM_COLS; col++) {
            currentRow.push(createNode(col, row));
        }
        grid.push(currentRow);
    }
    return grid;
};

// Função auxiliar obrigatória no React para clonar o tabuleiro (Imutabilidade)
const getNewGridWithWallToggled = (grid: NodeType[][], row: number, col: number) => {
    const newGrid = grid.map(rowArr => [...rowArr]); // Clona as linhas
    const node = newGrid[row][col];
    const newNode = { ...node, isWall: !node.isWall }; // Clona e altera o nó
    newGrid[row][col] = newNode;
    return newGrid;
};

export const Grid: React.FC = () => {
    const [grid, setGrid] = useState<NodeType[][]>(createInitialGrid());
    const [mouseIsPressed, setMouseIsPressed] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [hasResults, setHasResults] = useState(false);
    const [algoritmoSelecionado, setAlgoritmoSelecionado] = useState('BFS');

    // Controle de paredes
    const handleMouseDown = (row: number, col: number) => {
        if (isAnimating) return;
        if (hasResults) limparCaminho();

        setMouseIsPressed(true);
        setGrid(prev => getNewGridWithWallToggled(prev, row, col));
    };

    const handleMouseEnter = (row: number, col: number) => {
        if (!mouseIsPressed || isAnimating) return;
        setGrid(prev => getNewGridWithWallToggled(prev, row, col));
    };

    const handleMouseUp = () => {
        setMouseIsPressed(false);
    };

    // Limpezas
    const limparCaminho = () => {
        if (isAnimating) return;
        setGrid(prev => prev.map(row => row.map(node => ({ ...node, isVisited: false, isPath: false }))));
        setHasResults(false);
    };

    const limparTabuleiro = () => {
        if (isAnimating) return;
        setGrid(createInitialGrid());
        setHasResults(false);
    };

    // Animação (O gargalo do React)
    const animarCaminho = (caminho: NodeType[]) => {
        for (let i = 0; i < caminho.length; i++) {
            setTimeout(() => {
                setGrid(prev => {
                    const newGrid = [...prev];
                    const node = caminho[i];
                    if (!node.isStart && !node.isEnd) {
                        newGrid[node.row] = [...newGrid[node.row]];
                        newGrid[node.row][node.col] = { ...newGrid[node.row][node.col], isPath: true };
                    }
                    return newGrid;
                });

                if (i === caminho.length - 1) {
                    setIsAnimating(false);
                    setHasResults(true);
                }
            }, 30 * i);
        }
    };

    const animarAlgoritmo = (visitados: NodeType[], caminho: NodeType[]) => {
        for (let i = 0; i <= visitados.length; i++) {
            if (i === visitados.length) {
                setTimeout(() => {
                    animarCaminho(caminho);
                }, 10 * i);
                return;
            }
            setTimeout(() => {
                setGrid(prev => {
                    const newGrid = [...prev];
                    const node = visitados[i];
                    if (!node.isStart && !node.isEnd) {
                        newGrid[node.row] = [...newGrid[node.row]];
                        newGrid[node.row][node.col] = { ...newGrid[node.row][node.col], isVisited: true };
                    }
                    return newGrid;
                });
            }, 10 * i);
        }
    };

    const iniciarAlgoritmo = () => {
        if (isAnimating) return;
        if (hasResults) limparCaminho();
        setIsAnimating(true);

        const startNode = grid[START_NODE_ROW][START_NODE_COL];
        const endNode = grid[END_NODE_ROW][END_NODE_COL];

        let resultado;
        if (algoritmoSelecionado === 'BFS') resultado = executarBFS(grid, startNode, endNode);
        else if (algoritmoSelecionado === 'ASTAR') resultado = executarAStar(grid, startNode, endNode);
        else resultado = executarDFS(grid, startNode, endNode);

        const { nosVisitadosEmOrdem, nosAnteriores } = resultado;
        const caminhoMaisCurto = pegarCaminhoMaisCurto(endNode, nosAnteriores);

        animarAlgoritmo(nosVisitadosEmOrdem, caminhoMaisCurto);
    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            {/* CONTROLES */}
            <div className="flex gap-4 mb-6 items-center">
                <select
                    className="px-4 py-2 border border-slate-300 dark:border-slate-700 rounded shadow-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-medium focus:outline-none focus:border-blue-500 cursor-pointer disabled:opacity-50 transition-colors"
                    value={algoritmoSelecionado}
                    onChange={(e) => setAlgoritmoSelecionado(e.target.value)}
                    disabled={isAnimating}
                >
                    <option value="BFS">Busca em Largura (BFS)</option>
                    <option value="ASTAR">Algoritmo A* (A-Star)</option>
                    <option value="DFS">Busca em Profundidade (DFS)</option>
                </select>
                <button
                    className="px-6 py-2 bg-blue-600 text-white font-semibold rounded shadow-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={iniciarAlgoritmo} disabled={isAnimating}
                > Iniciar Busca </button>
                <button
                    className="px-6 py-2 bg-yellow-500 text-white font-semibold rounded shadow-md hover:bg-yellow-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={limparCaminho} disabled={isAnimating}
                > Limpar Caminho </button>
                <button
                    className="px-6 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded shadow-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    onClick={limparTabuleiro} disabled={isAnimating}
                > Limpar Tabuleiro Completo </button>
            </div>

            {/* TABULEIRO */}
            <div
                className="grid gap-0 border border-slate-300 dark:border-slate-700 shadow-xl bg-slate-50 dark:bg-slate-900 transition-colors"
                style={{ gridTemplateColumns: `repeat(${NUM_COLS}, minmax(0, 1fr))` }}
                onMouseLeave={handleMouseUp}
            >
                {grid.map((row, rowIdx) => (
                    row.map((node, nodeIdx) => (
                        <Node
                            key={`${rowIdx}-${nodeIdx}`}
                            row={node.row}
                            col={node.col}
                            isStart={node.isStart}
                            isEnd={node.isEnd}
                            isWall={node.isWall}
                            isVisited={node.isVisited}
                            isPath={node.isPath}
                            onMouseDown={handleMouseDown}
                            onMouseEnter={handleMouseEnter}
                            onMouseUp={handleMouseUp}
                        />
                    ))
                ))}
            </div>
            {/* LEGENDA AQUI! */}
            <div className="mt-8 flex flex-wrap justify-center gap-6 p-4 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 transition-colors">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-green-500 border border-slate-200 dark:border-slate-700"></div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors">Início</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-red-500 border border-slate-200 dark:border-slate-700"></div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors">Objetivo</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-slate-800 dark:bg-slate-300 border border-slate-200 dark:border-slate-700 transition-colors"></div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors">Parede</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-blue-300 border border-slate-200 dark:border-slate-700"></div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors">Visitado</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-yellow-400 border border-slate-200 dark:border-slate-700"></div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors">Caminho Final</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"></div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-300 transition-colors">Não Visitado</span>
                </div>
            </div>
        </div>
    );
};