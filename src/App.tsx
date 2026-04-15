// src/App.tsx
import { useState } from 'react';
import { Grid } from './components/Grid';

function App() {
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    if (!isDark) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  };

  return (
    <main className="min-h-screen bg-slate-100 dark:bg-slate-900 flex flex-col items-center py-10 font-sans transition-colors duration-300">
      <div className="w-full max-w-5xl flex justify-between items-center px-4 mb-6">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-slate-100 mb-2 transition-colors">
            Visualizador de Algoritmos (React)
          </h1>
          <p className="text-slate-500 dark:text-slate-400 transition-colors">
            Abstração de UI e Virtual DOM
          </p>
        </div>
        <button 
          onClick={toggleDarkMode} 
          className="px-4 py-2 rounded-full font-medium shadow-sm transition-colors bg-white text-slate-800 hover:bg-slate-200 dark:bg-slate-800 dark:text-yellow-400 dark:hover:bg-slate-700"
        >
          {isDark ? '☀️ Modo Claro' : '🌙 Modo Escuro'}
        </button>
      </div>

      <Grid />
    </main>
  );
}

export default App;