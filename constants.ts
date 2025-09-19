import { TileType, Position } from './types';

export const GRID_WIDTH = 15;
export const GRID_HEIGHT = 13;

// Timings in milliseconds
export const GAME_TICK_RATE = 100;
export const BOMB_TIMER_DURATION = 3000;
export const EXPLOSION_DURATION = 500;
export const ENEMY_MOVE_INTERVAL = 500;

// Player initial stats
export const PLAYER_START_POS: Position = { x: 1, y: 1 };
export const INITIAL_BOMB_COUNT = 1;
export const INITIAL_BLAST_RADIUS = 1;
export const INITIAL_PLAYER_SPEED = 1; // 1 tile per move

// Enemy config
export const INITIAL_ENEMY_COUNT = 4;

// Level Generation
export const SOFT_BLOCK_DENSITY = 0.6; // 60% of empty spaces will be soft blocks
export const POWERUP_CHANCE = 0.3; // 30% chance for a soft block to have a powerup

export const TILE_COLORS: { [key in TileType]: string } = {
  [TileType.EMPTY]: 'bg-green-800',
  [TileType.SOLID_WALL]: 'bg-gray-700 border border-gray-800',
  [TileType.SOFT_BLOCK]: 'bg-gray-600 border border-gray-700',
};
