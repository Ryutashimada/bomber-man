
import React from 'react';

interface StartScreenProps {
  onStart: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-10 bg-gray-800 rounded-lg" style={{width: '600px', height: '520px'}}>
      <h2 className="text-4xl font-bold mb-4 text-yellow-400">Welcome to Nen Blaster!</h2>
      <p className="text-gray-300 mb-8 max-w-md">
        Pass the secret Hunter Exam phase! Defeat the Phantom Troupe with your Jajanken. Break blocks to find Nen enhancements and clear your path.
      </p>
      <button
        onClick={onStart}
        className="px-8 py-4 bg-green-600 text-white font-bold text-2xl rounded-lg hover:bg-green-700 transition-colors transform hover:scale-105 shadow-lg"
      >
        Start Exam
      </button>
       <div className="mt-8 text-left text-gray-400 text-sm">
          <h3 className="font-bold text-lg mb-2 text-white">Controls:</h3>
          <p><span className="font-bold text-yellow-400">Arrow Keys:</span> Move your character</p>
          <p><span className="font-bold text-yellow-400">Spacebar:</span> Use Jajanken (place bomb)</p>
      </div>
    </div>
  );
};

export default StartScreen;
