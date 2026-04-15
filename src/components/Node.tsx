// src/components/Node.tsx
import React from 'react';

type NodeProps = {
  row: number;
  col: number;
  isStart: boolean;
  isEnd: boolean;
  isWall: boolean;
  isVisited: boolean;
  isPath: boolean;
  onMouseDown: (row: number, col: number) => void;
  onMouseEnter: (row: number, col: number) => void;
  onMouseUp: () => void;
};

export const Node: React.FC<NodeProps> = ({
  row,
  col,
  isStart,
  isEnd,
  isWall,
  isVisited,
  isPath,
  onMouseDown,
  onMouseEnter,
  onMouseUp,
}) => {
  let bgClass = 'bg-white dark:bg-slate-800'; // Padrão
  
  if (isStart) bgClass = 'bg-green-500 border-green-600';
  else if (isEnd) bgClass = 'bg-red-500 border-red-600';
  else if (isWall) bgClass = 'bg-slate-800 dark:bg-slate-300 scale-110 transition-transform';
  else if (isPath) bgClass = 'bg-yellow-400 border-yellow-500';
  else if (isVisited) bgClass = 'bg-blue-300 border-blue-400';

  return (
    <div
      id={`node-${row}-${col}`}
      className={`w-6 h-6 border border-blue-100 dark:border-slate-700 cursor-pointer ${bgClass}`}
      onMouseDown={() => onMouseDown(row, col)}
      onMouseEnter={() => onMouseEnter(row, col)}
      onMouseUp={onMouseUp}
      draggable={false}
    />
  );
};