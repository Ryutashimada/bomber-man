import { useState, useEffect, useCallback, useRef } from 'react';
import { TileType, PowerUpType, Position, PlayerState, EnemyState, BombState, ExplosionState, PowerUpState, AllyState, EnemyName, AllyName } from '../types';
import { GRID_WIDTH, GRID_HEIGHT, GAME_TICK_RATE, BOMB_TIMER_DURATION, EXPLOSION_DURATION, PLAYER_START_POS, INITIAL_BOMB_COUNT, INITIAL_BLAST_RADIUS, INITIAL_PLAYER_SPEED, INITIAL_ENEMY_COUNT, SOFT_BLOCK_DENSITY, POWERUP_CHANCE, ENEMY_MOVE_INTERVAL } from '../constants';

const generateLevel = (): { level: TileType[][], powerUps: PowerUpState[], enemies: EnemyState[], allies: AllyState[] } => {
  const level = Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(TileType.EMPTY));
  const powerUps: PowerUpState[] = [];
  const enemies: EnemyState[] = [];
  const allies: AllyState[] = [];
  const emptyPositions: Position[] = [];

  for (let y = 0; y < GRID_HEIGHT; y++) {
    for (let x = 0; x < GRID_WIDTH; x++) {
      if (x === 0 || x === GRID_WIDTH - 1 || y === 0 || y === GRID_HEIGHT - 1 || (x % 2 === 0 && y % 2 === 0)) {
        level[y][x] = TileType.SOLID_WALL;
      } else {
        emptyPositions.push({ x, y });
      }
    }
  }

  level[1][1] = TileType.EMPTY;
  level[1][2] = TileType.EMPTY;
  level[2][1] = TileType.EMPTY;
  
  const safeZone = new Set(['1,1', '1,2', '2,1']);
  let availablePositions = emptyPositions.filter(p => !safeZone.has(`${p.x},${p.y}`)).sort(() => 0.5 - Math.random());
  
  // Place Allies
  const allyNames: AllyName[] = ['Killua', 'Kurapika', 'Senritsu'];
  for (const name of allyNames) {
      const pos = availablePositions.pop();
      if(pos) {
          allies.push({ id: name, name, position: pos });
      }
  }

  // Place Soft Blocks and Power-ups
  const softBlockCount = Math.floor(availablePositions.length * SOFT_BLOCK_DENSITY);
  const softBlockPositions = availablePositions.slice(0, softBlockCount);
  availablePositions = availablePositions.slice(softBlockCount);
  
  for (const pos of softBlockPositions) {
    level[pos.y][pos.x] = TileType.SOFT_BLOCK;
    if (Math.random() < POWERUP_CHANCE) {
        const randomPowerUp = [PowerUpType.BOMB_UP, PowerUpType.FIRE_UP, PowerUpType.SPEED_UP][Math.floor(Math.random() * 3)];
        powerUps.push({ position: pos, type: randomPowerUp });
    }
  }

  // Place Enemies
  const enemyPool: EnemyName[] = ['Hisoka', 'Chrollo', 'Machi', 'Feitan', 'Phinks'];
  const shuffledEnemies = enemyPool.sort(() => 0.5 - Math.random());
  const enemyPositions = availablePositions.slice(0, INITIAL_ENEMY_COUNT);

  enemyPositions.forEach((pos, i) => {
      enemies.push({id: i, name: shuffledEnemies[i], position: pos, direction: 'right'});
  });

  return { level, powerUps, enemies, allies };
};


export const useGameState = (onEndGame: (result: 'victory' | 'defeat') => void) => {
    const [level, setLevel] = useState<TileType[][]>([]);
    const [player, setPlayer] = useState<PlayerState>({ position: PLAYER_START_POS, bombsMax: INITIAL_BOMB_COUNT, blastRadius: INITIAL_BLAST_RADIUS, speed: INITIAL_PLAYER_SPEED });
    const [enemies, setEnemies] = useState<EnemyState[]>([]);
    const [allies, setAllies] = useState<AllyState[]>([]);
    const [bombs, setBombs] = useState<BombState[]>([]);
    const [explosions, setExplosions] = useState<ExplosionState[]>([]);
    const [powerUps, setPowerUps] = useState<PowerUpState[]>([]);
    
    const lastEnemyMoveRef = useRef<number>(0);
    const gameOverRef = useRef(false);

    const isWalkable = useCallback((pos: Position, currentLevel: TileType[][], currentBombs: BombState[], currentAllies: AllyState[]) => {
        if (pos.x < 0 || pos.x >= GRID_WIDTH || pos.y < 0 || pos.y >= GRID_HEIGHT) return false;
        const tile = currentLevel[pos.y][pos.x];
        if (tile === TileType.SOLID_WALL || tile === TileType.SOFT_BLOCK) return false;
        if (currentBombs.some(b => b.position.x === pos.x && b.position.y === pos.y)) return false;
        if (currentAllies.some(a => a.position.x === pos.x && a.position.y === pos.y)) return false;
        return true;
    }, []);

    const resetGame = useCallback(() => {
        gameOverRef.current = false;
        const { level, powerUps, enemies, allies } = generateLevel();
        setLevel(level);
        setPowerUps(powerUps);
        setEnemies(enemies);
        setAllies(allies);
        setPlayer({ position: PLAYER_START_POS, bombsMax: INITIAL_BOMB_COUNT, blastRadius: INITIAL_BLAST_RADIUS, speed: INITIAL_PLAYER_SPEED });
        setBombs([]);
        setExplosions([]);
    }, []);

    useEffect(() => {
        resetGame();
    }, [resetGame]);

    const handlePlayerMove = useCallback((dx: number, dy: number) => {
        setPlayer(p => {
            const newPos = { x: p.position.x + dx, y: p.position.y + dy };
            if (isWalkable(newPos, level, bombs, allies)) {
                return { ...p, position: newPos };
            }
            return p;
        });
    }, [isWalkable, level, bombs, allies]);

    const placeBomb = useCallback(() => {
        setBombs(prevBombs => {
            if (prevBombs.length >= player.bombsMax) return prevBombs;
            if (prevBombs.some(b => b.position.x === player.position.x && b.position.y === player.position.y)) return prevBombs;

            return [...prevBombs, {
                id: Date.now(),
                position: player.position,
                timer: BOMB_TIMER_DURATION,
                blastRadius: player.blastRadius
            }];
        });
    }, [player.bombsMax, player.position, player.blastRadius]);
    
    const gameLoop = useCallback(() => {
        if (gameOverRef.current) return;

        const now = Date.now();
        
        setBombs(prevBombs => {
            const explodingBombs: BombState[] = [];
            const remainingBombs = prevBombs.filter(bomb => {
                const newTimer = bomb.timer - GAME_TICK_RATE;
                if (newTimer <= 0) {
                    explodingBombs.push(bomb);
                    return false;
                }
                bomb.timer = newTimer;
                return true;
            });
            
            if (explodingBombs.length > 0) {
                 setExplosions(prevExplosions => {
                    let newExplosions = [...prevExplosions];
                    setLevel(currentLevel => {
                        const newLevel = currentLevel.map(row => [...row]);
                        explodingBombs.forEach(bomb => {
                            const explosionPositions: Position[] = [bomb.position];
                            const directions = [{dx:0, dy:1}, {dx:0, dy:-1}, {dx:1, dy:0}, {dx:-1, dy:0}];
                            
                            directions.forEach(({dx, dy}) => {
                                for(let i=1; i<=bomb.blastRadius; i++) {
                                    const pos = { x: bomb.position.x + dx * i, y: bomb.position.y + dy * i };
                                    if(pos.x < 0 || pos.x >= GRID_WIDTH || pos.y < 0 || pos.y >= GRID_HEIGHT) break;

                                    const tile = newLevel[pos.y][pos.x];
                                    if (tile === TileType.SOLID_WALL) break;
                                    
                                    explosionPositions.push(pos);
                                    
                                    if (tile === TileType.SOFT_BLOCK) {
                                        newLevel[pos.y][pos.x] = TileType.EMPTY;
                                        break;
                                    }
                                }
                            });
                            newExplosions.push({ id: bomb.id, positions: explosionPositions, timer: EXPLOSION_DURATION });
                        });
                        return newLevel;
                    });
                    return newExplosions;
                });
            }
            return remainingBombs;
        });

        setExplosions(prev => prev.filter(exp => exp.timer - GAME_TICK_RATE > 0).map(exp => ({ ...exp, timer: exp.timer - GAME_TICK_RATE })));

        if (now - lastEnemyMoveRef.current > ENEMY_MOVE_INTERVAL) {
            lastEnemyMoveRef.current = now;
            setEnemies(prevEnemies => prevEnemies.map(enemy => {
                const { x, y } = enemy.position;
                const directions = [
                    { name: 'up', pos: { x, y: y - 1 }},
                    { name: 'down', pos: { x, y: y + 1 }},
                    { name: 'left', pos: { x: x - 1, y }},
                    { name: 'right', pos: { x: x + 1, y }},
                ] as const;

                const possibleMoves = directions.filter(d => isWalkable(d.pos, level, bombs, allies));
                if (possibleMoves.length > 0) {
                    const move = possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
                    return { ...enemy, position: move.pos, direction: move.name };
                }
                return enemy;
            }));
        }

        setPlayer(p => {
             const newPos = p.position;
             const powerupIndex = powerUps.findIndex(pu => pu.position.x === newPos.x && pu.position.y === newPos.y && level[newPos.y][newPos.x] === TileType.EMPTY);
             if (powerupIndex > -1) {
                 const powerUp = powerUps[powerupIndex];
                 let newPlayerState = { ...p };
                 if (powerUp.type === PowerUpType.BOMB_UP) newPlayerState.bombsMax++;
                 if (powerUp.type === PowerUpType.FIRE_UP) newPlayerState.blastRadius++;
                 
                 setPowerUps(pus => pus.filter((_, i) => i !== powerupIndex));
                 return newPlayerState;
             }
             return p;
        });

        const allExplosionPos = explosions.flatMap(e => e.positions);
        
        if (allExplosionPos.length > 0) {
            if (allExplosionPos.some(pos => pos.x === player.position.x && pos.y === player.position.y)) {
                gameOverRef.current = true;
                onEndGame('defeat');
                return;
            }
            
            const remainingEnemies = enemies.filter(enemy => {
                return !allExplosionPos.some(pos => pos.x === enemy.position.x && pos.y === enemy.position.y);
            });

            if (enemies.length > 0 && remainingEnemies.length === 0) {
                gameOverRef.current = true;
                onEndGame('victory');
            } else if (remainingEnemies.length < enemies.length) {
                 setEnemies(remainingEnemies);
            }
        }
        
        if (enemies.some(en => en.position.x === player.position.x && en.position.y === player.position.y)) {
             gameOverRef.current = true;
             onEndGame('defeat');
        }
    }, [bombs, enemies, explosions, isWalkable, level, onEndGame, player.position, powerUps, allies]);

    useEffect(() => {
        const tick = setInterval(gameLoop, GAME_TICK_RATE);
        return () => clearInterval(tick);
    }, [gameLoop]);

    return {
        level,
        player,
        enemies,
        allies,
        bombs,
        explosions,
        powerUps,
        handlePlayerMove,
        placeBomb,
    };
};
