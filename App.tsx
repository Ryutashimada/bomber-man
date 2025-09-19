
import React, { useState, useCallback } from 'react';
import Game from './components/Game';
import StartScreen from './components/StartScreen';
import EndScreen from './components/EndScreen';
import { GameStatus } from './types';

const App: React.FC = () => {
  const [gameStatus, setGameStatus] = useState<GameStatus>(GameStatus.START);
  const [lastGameResult, setLastGameResult] = useState<'victory' | 'defeat' | null>(null);

  const handleStartGame = useCallback(() => {
    setGameStatus(GameStatus.PLAYING);
  }, []);

  const handleEndGame = useCallback((result: 'victory' | 'defeat') => {
    setLastGameResult(result);
    setGameStatus(GameStatus.END);
  }, []);

  const renderContent = () => {
    switch (gameStatus) {
      case GameStatus.START:
        return <StartScreen onStart={handleStartGame} />;
      case GameStatus.PLAYING:
        return <Game onEndGame={handleEndGame} />;
      case GameStatus.END:
        return <EndScreen result={lastGameResult!} onRestart={handleStartGame} />;
      default:
        return <StartScreen onStart={handleStartGame} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center p-4 font-mono">
      <header className="mb-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 tracking-wider" style={{ textShadow: '2px 2px 0px #000' }}>
          Nen Blaster!
        </h1>
        <p className="text-gray-400">A Hunter x Hunter Tribute</p>
      </header>
      <main className="w-full max-w-fit bg-black p-2 rounded-lg shadow-2xl border-4 border-gray-700">
        {renderContent()}
      </main>
      <footer className="mt-4 text-sm text-gray-500">
        <p>Use Arrow Keys to Move, Spacebar to use Jajanken.</p>
      </footer>
    </div>
  );
};

export default App;
