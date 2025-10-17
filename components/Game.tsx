import React, { useEffect, useCallback } from 'react';
import { useGameState } from '../hooks/useGameState';
import { TILE_COLORS } from '../constants';
import { TileType, PowerUpType, AllyName, EnemyName } from '../types';
import HUD from './HUD';

interface GameProps {
  onEndGame: (result: 'victory' | 'defeat') => void;
}

const characterEmojis: { [key in AllyName | EnemyName]: string } = {
    // Allies
    'Killua': '👦🏼',
    'Kurapika': '⛓️',
    'Senritsu': '🎵',
    // Enemies
    'Hisoka': '🃏',
    'Chrollo': '🕷️',
    'Machi': '🪡',
    'Feitan': '💀',
    'Phinks': '💪',
};

const Game: React.FC<GameProps> = ({ onEndGame }) => {
    const {
        level,
        player,
        enemies,
        allies,
        bombs,
        explosions,
        powerUps,
        handlePlayerMove,
        placeBomb,
    } = useGameState(onEndGame);

    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowUp': handlePlayerMove(0, -1); break;
            case 'ArrowDown': handlePlayerMove(0, 1); break;
            case 'ArrowLeft': handlePlayerMove(-1, 0); break;
            case 'ArrowRight': handlePlayerMove(1, 0); break;
            case ' ':
            case 'Spacebar':
                e.preventDefault();
                placeBomb();
                break;
        }
    }, [handlePlayerMove, placeBomb]);

    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [handleKeyDown]);

    if (level.length === 0) {
        return (
            <div className="flex items-center justify-center" style={{ width: `600px`, height: `520px` }}>
                <div className="text-2xl text-yellow-400">Loading Exam...</div>
            </div>
        );
    }

    const allExplosionPositions = explosions.flatMap(e => e.positions);
    const GRID_WIDTH = level[0].length;
    const GRID_HEIGHT = level.length;
    const TILE_SIZE_REM = 2.5;

    return (
        <div className="flex flex-col items-center">
            <HUD 
              enemiesLeft={enemies.length} 
              bombCount={player.bombsMax} 
              blastRadius={player.blastRadius} 
            />
            <div className="relative bg-green-800" style={{ width: `${GRID_WIDTH * TILE_SIZE_REM}rem`, height: `${GRID_HEIGHT * TILE_SIZE_REM}rem` }}>
                <div className="grid" style={{ gridTemplateColumns: `repeat(${GRID_WIDTH}, minmax(0, 1fr))` }}>
                    {level.map((row, y) => 
                        row.map((tile, x) => {
                           const powerup = powerUps.find(p => p.position.x === x && p.position.y === y);
                           let tileContent = null;
                           if (tile === TileType.EMPTY && powerup) {
                                let powerupEmoji = '';
                                if (powerup.type === PowerUpType.BOMB_UP) powerupEmoji = '✊';
                                if (powerup.type === PowerUpType.FIRE_UP) powerupEmoji = '🔥';
                                if (powerup.type === PowerUpType.SPEED_UP) powerupEmoji = '⚡';
                                tileContent = <div className={`w-full h-full flex items-center justify-center text-2xl`}>{powerupEmoji}</div>;
                           }

                           return (
                             <div key={`${x}-${y}`} className={`w-10 h-10 flex items-center justify-center ${TILE_COLORS[tile]}`}>
                                 {tileContent}
                             </div>
                           );
                        })
                    )}
                </div>
                
                {/* Player (Gon) */}
                <div className="absolute w-10 h-10 bg-green-500 rounded-md transition-all duration-75 border-2 border-green-200" style={{ left: `${player.position.x * TILE_SIZE_REM}rem`, top: `${player.position.y * TILE_SIZE_REM}rem`, zIndex: 10 }}></div>

                {/* Allies (Killua, Kurapika, Senritsu) */}
                {allies.map(ally => (
                    <div key={ally.id} className="absolute w-10 h-10 flex items-center justify-center text-3xl" style={{ left: `${ally.position.x * TILE_SIZE_REM}rem`, top: `${ally.position.y * TILE_SIZE_REM}rem`, zIndex: 8 }}>
                        {characterEmojis[ally.name]}
                    </div>
                ))}

                {/* Enemies (Phantom Troupe) */}
                {enemies.map(enemy => (
                    <div key={enemy.id} className="absolute w-10 h-10 flex items-center justify-center text-3xl transition-all duration-100" style={{ left: `${enemy.position.x * TILE_SIZE_REM}rem`, top: `${enemy.position.y * TILE_SIZE_REM}rem`, zIndex: 9 }}>
                        {characterEmojis[enemy.name]}
                    </div>
                ))}
                
                {/* Bombs (Jajanken: Rock) */}
                {bombs.map(bomb => (
                    <div key={bomb.id} className="absolute w-10 h-10 flex items-center justify-center text-3xl" style={{ left: `${bomb.position.x * TILE_SIZE_REM}rem`, top: `${bomb.position.y * TILE_SIZE_REM}rem`, zIndex: 5 }}>
                       <div className="animate-pulse">✊</div>
                    </div>
                ))}

                 {/* Explosions (Nen Aura) */}
                {allExplosionPositions.map((pos, i) => (
                    <div key={i} className="absolute w-10 h-10 bg-yellow-400/75 rounded-full animate-ping" style={{ left: `${pos.x * TILE_SIZE_REM}rem`, top: `${pos.y * TILE_SIZE_REM}rem`, animation: 'ping 0.5s cubic-bezier(0, 0, 0.2, 1) forwards', zIndex: 20 }}></div>
                ))}
            </div>
        </div>
    );
};

export default Game;
