// FIX: Removed a self-referential import of `TileType` that was causing compilation errors.
export enum TileType {
  EMPTY,
  SOLID_WALL,
  SOFT_BLOCK,
}

export enum PowerUpType {
  NONE,
  BOMB_UP,
  FIRE_UP,
  SPEED_UP,
}

export enum GameStatus {
    START,
    PLAYING,
    END,
}

export interface Position {
  x: number;
  y: number;
}

export interface PlayerState {
  position: Position;
  bombsMax: number;
  blastRadius: number;
  speed: number;
}

export type EnemyName = 'Hisoka' | 'Chrollo' | 'Machi' | 'Feitan' | 'Phinks';

export interface EnemyState {
  id: number;
  name: EnemyName;
  position: Position;
  direction: 'up' | 'down' | 'left' | 'right';
}

export interface BombState {
  id: number;
  position: Position;
  timer: number;
  blastRadius: number;
}

export interface ExplosionState {
    id: number;
    positions: Position[];
    timer: number;
}

export interface PowerUpState {
    position: Position;
    type: PowerUpType;
}

export type AllyName = 'Killua' | 'Kurapika' | 'Senritsu';

export interface AllyState {
    id: string;
    name: AllyName;
    position: Position;
}