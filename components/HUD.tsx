import React from 'react';

interface HUDProps {
  enemiesLeft: number;
  bombCount: number;
  blastRadius: number;
}

const HUD: React.FC<HUDProps> = ({ enemiesLeft, bombCount, blastRadius }) => {
  return (
    <div className="flex justify-between w-full p-2 bg-gray-800 rounded-t-md">
      <div className="text-yellow-400">Troupers Left: {enemiesLeft}</div>
      <div className="text-blue-400">Jajanken: {bombCount}</div>
      <div className="text-red-400">Aura: {blastRadius}</div>
    </div>
  );
};

export default HUD;
