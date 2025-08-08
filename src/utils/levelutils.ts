import { Level, LevelData, TileData, TileType } from '../data';

export namespace LevelUtils {
  export function createLevelData(level: Level): LevelData {
    const height = level.grid.length;
    const width = level.grid[0].length;

    const tileDatas = [];
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const tile = level.grid[y][x];
        let tileData: any = {
          type: tile.type,
          position: [y, x] as [number, number]
        };
        if (tile.type === TileType.Path) {
          // Check neighbors for path connectivity
          const nav = {
            up: y > 0 && level.grid[y - 1][x].type === TileType.Path,
            down: y < height - 1 && level.grid[y + 1][x].type === TileType.Path,
            left: x > 0 && level.grid[y][x - 1].type === TileType.Path,
            right: x < width - 1 && level.grid[y][x + 1].type === TileType.Path
          };
          tileData.nav = nav;
        }
        tileDatas.push(tileData);
      }
    }

    return {
      level: level,
      tileDatas: tileDatas,
      size: [height, width],
      levelOrigin: getWeightedLevelCenter(tileDatas)
    }
  }

  function getWeightedLevelCenter(tileDatas: TileData[]): [number, number] {
    // Calculate center of the level only on the path tiles
    const pathTiles = tileDatas.filter(tile => tile.type === TileType.Path);
    const center = pathTiles.reduce((acc, tile) => {
      const [x, y] = tile.position;
      return [acc[0] + x, acc[1] + y];
    }, [0, 0]);
    
    return [center[0] / pathTiles.length, center[1] / pathTiles.length];
  }
}
