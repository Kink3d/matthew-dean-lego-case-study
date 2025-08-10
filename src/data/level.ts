import { Enemy } from "./enemy";
import { EmptyTile, GapTile, PathTile, Tile, TileData } from "./tile";

export interface Level {
  startPosition: [number, number];
  goalPosition: [number, number];
  perfectMoves: number;
  grid: Grid;
  enemies: Enemy[];
  bricks: Brick[];
}

export interface LevelData {
  level: Level;
  tileDatas: TileData[];
  size: [number, number];
  levelOrigin: [number, number];
}

export interface Brick {
  startPosition: [number, number];
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
  enemies: [],
  bricks: []
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
  enemies: [],
  bricks: []
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
  enemies: [],
  bricks: []
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
  ],
  bricks: []
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
  ],
  bricks: []
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
  ],
  bricks: []
}

export const Level7: Level = {
  startPosition: [0, 0],
  goalPosition: [2, 2],
  perfectMoves: 4,
  grid: [
    [PathTile, PathTile, PathTile],
    [EmptyTile, PathTile, EmptyTile],
    [EmptyTile, GapTile, PathTile],
  ],
  enemies: [],
  bricks: [
    { startPosition: [0, 2] }
  ]
}

export const Level8: Level = {
  startPosition: [0, 3],
  goalPosition: [3, 1],
  perfectMoves: 9,
  grid: [
    [PathTile, PathTile, PathTile, PathTile, EmptyTile],
    [EmptyTile, EmptyTile, PathTile, EmptyTile, EmptyTile],
    [EmptyTile, EmptyTile, GapTile, PathTile, PathTile],
    [EmptyTile, PathTile, GapTile, EmptyTile, EmptyTile],
  ],
  enemies: [],
  bricks: [
    { startPosition: [0, 0] },
    { startPosition: [2, 4] }
  ]
}

export const Level9: Level = {
  startPosition: [0, 2],
  goalPosition: [5, 2],
  perfectMoves: 13,
  grid: [
    [EmptyTile, EmptyTile, PathTile, EmptyTile],
    [PathTile, PathTile, PathTile, PathTile],
    [PathTile, EmptyTile, PathTile, EmptyTile],
    [PathTile, EmptyTile, PathTile, EmptyTile],
    [GapTile, PathTile, PathTile, PathTile],
    [EmptyTile, EmptyTile, PathTile, EmptyTile],
  ],
  enemies: [
    { startPosition: [4, 1], initialDirection: [0, -1] },
  ],
  bricks: [
    { startPosition: [1, 3] },
  ]
}

/* LEVEL LIST */
export const Levels: Level[] = [
  Level1,
  Level2,
  Level3,
  Level4,
  Level5,
  Level6,
  Level7,
  Level8,
  Level9
]
