export enum TileType {
  Empty = "empty",
  Path = "path",
}

export interface Tile {
  type: TileType;
}

export interface TileData {
  type: TileType;
  position: [number, number];
  nav?: NavDirections; // Only present for Path tiles
}

export type NavDirections = {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
};

/* TILE DEFINITIONS */
export const EmptyTile: Tile = {
  type: TileType.Empty
}
export const PathTile: Tile = {
  type: TileType.Path
}
