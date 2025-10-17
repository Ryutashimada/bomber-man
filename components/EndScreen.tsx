
import React from 'react';

interface EndScreenProps {
  result: 'victory' | 'defeat';
  onRestart: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ result, onRestart }) => {
  const isVictory = result === 'victory';

  return (
    <div className="flex flex-col items-center justify-center text-center p-10 bg-gray-800 rounded-lg" style={{width: '600px', height: '520px'}}>
      <h2 className={`text-5xl font-bold mb-4 ${isVictory ? 'text-green-400' : 'text-red-500'}`}>
        {isVictory ? 'You Passed!' : 'You Failed...'}
      </h2>
      <p className="text-gray-300 mb-8">
        {isVictory ? 'You defeated all targets. Welcome, Hunter!' : 'You were eliminated. Try again to get your license!'}
      </p>
      <button
        onClick={onRestart}
        className="px-8 py-4 bg-blue-600 text-white font-bold text-2xl rounded-lg hover:bg-blue-700 transition-colors transform hover:scale-105 shadow-lg"
      >
        Retry Exam
      </button>
    </div>
  );
};

export default EndScreen;
