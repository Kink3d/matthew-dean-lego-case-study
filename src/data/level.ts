import { Enemy } from "./enemy";
import { EmptyTile, PathTile, Tile, TileData } from "./tile";

export interface Level {
  startPosition: [number, number];
  goalPosition: [number, number];
  perfectMoves: number;
  grid: Grid;
  enemies: Enemy[];
}

export interface LevelData {
  level: Level;
  tileDatas: TileData[];
  size: [number, number];
  levelOrigin: [number, number];
}

export type Grid = Tile[][];

/* LEVEL DEFINITIONS */
export const Level1: Level = {
  startPosition: [1, 1],
  goalPosition: [3, 1],
  perfectMoves: 2,
  grid: [
    [EmptyTile, PathTile, EmptyTile],
    [PathTile, PathTile, PathTile],
    [EmptyTile, PathTile, EmptyTile],
    [EmptyTile, PathTile, EmptyTile],
  ],
  enemies: []
}

export const Level2: Level = {
  startPosition: [0, 0],
  goalPosition: [2, 2],
  perfectMoves: 4,
  grid: [
    [PathTile, PathTile, EmptyTile],
    [EmptyTile, PathTile, EmptyTile],
    [EmptyTile, PathTile, PathTile],
  ],
  enemies: []
}

export const Level3: Level = {
  startPosition: [0, 0],
  goalPosition: [2, 0],
  perfectMoves: 6,
  grid: [
    [PathTile, PathTile, PathTile],
    [EmptyTile, EmptyTile, PathTile],
    [PathTile, PathTile, PathTile],
  ],
  enemies: []
}

export const Level4: Level = {
  startPosition: [0, 1],
  goalPosition: [4, 1],
  perfectMoves: 4,
  grid: [
    [EmptyTile, PathTile, EmptyTile, EmptyTile],
    [EmptyTile, PathTile, EmptyTile, EmptyTile],
    [EmptyTile, PathTile, EmptyTile, EmptyTile],
    [PathTile, PathTile, PathTile, PathTile],
    [EmptyTile, PathTile, EmptyTile, EmptyTile],
  ],
  enemies: [
    { startPosition: [3, 0], initialDirection: [0, 1] }
  ]
}

export const Level5: Level = {
  startPosition: [0, 0],
  goalPosition: [5, 0],
  perfectMoves: 7,
  grid: [
    [PathTile, EmptyTile, EmptyTile],
    [PathTile, EmptyTile, EmptyTile],
    [PathTile, EmptyTile, EmptyTile],
    [PathTile, PathTile, PathTile],
    [PathTile, EmptyTile, EmptyTile],
    [PathTile, EmptyTile, EmptyTile],
  ],
  enemies: [
    { startPosition: [3, 2], initialDirection: [0, -1] }
  ]
}

export const Level6: Level = {
  startPosition: [0, 1],
  goalPosition: [4, 1],
  perfectMoves: 6,
  grid: [
    [EmptyTile, PathTile, EmptyTile, EmptyTile],
    [EmptyTile, PathTile, PathTile, PathTile],
    [PathTile, PathTile, EmptyTile, EmptyTile],
    [EmptyTile, PathTile, PathTile, PathTile],
    [EmptyTile, PathTile, EmptyTile, EmptyTile],
  ],
  enemies: [
    { startPosition: [1, 3], initialDirection: [0, -1] },
    { startPosition: [3, 3], initialDirection: [0, -1] }
  ]
}

/* LEVEL LIST */
export const Levels: Level[] = [
  Level1,
  Level2,
  Level3,
  Level4,
  Level5,
  Level6
]