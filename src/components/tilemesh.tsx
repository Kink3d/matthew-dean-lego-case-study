import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { TileType } from "../data";
import { FileUtils } from '../utils';
import { GameStateResult } from '../hooks';

export interface TileMeshProps {
  gameStateResult: GameStateResult;
}


export function TileMesh(props: TileMeshProps) {
  const tileTexture = useLoader(THREE.TextureLoader, FileUtils.GetAbsolutePath("/assets/tile.png"));
  const tileGapTexture = useLoader(THREE.TextureLoader, FileUtils.GetAbsolutePath("/assets/tilegap.png"));
  
  const { gameStateResult } = props;
  const meshes: React.ReactNode[] = [];

  for (let i = 0; i < gameStateResult.levelData.tileDatas.length; i++) {
    const tileData = gameStateResult.levelData.tileDatas[i];
    const position = [tileData.position[0], 0, tileData.position[1]];
    const tileScale = [1, 0.001, 1];

    if (tileData.type === TileType.Path) {
      meshes.push(
        <mesh
          key={`tile-${i}`}
          position={[position[0], position[1] - tileScale[1] / 2, position[2]]}
          scale={[tileScale[0], tileScale[1], tileScale[2]]}
        >
          <boxGeometry />
          <meshBasicMaterial 
            transparent
            color="#ffffff"
            map={tileTexture}
          />
        </mesh>
      );
    } else if (tileData.type === TileType.Gap) {
      meshes.push(
        <mesh
          key={`tile-${i}`}
          position={[position[0], position[1] - tileScale[1] / 2, position[2]]}
          scale={[tileScale[0], tileScale[1], tileScale[2]]}
        >
          <boxGeometry />
          <meshBasicMaterial 
            transparent
            color="#000000"
            map={gameStateResult.filledGapTiles.some(filled => filled[0] === tileData.position[0] && filled[1] === tileData.position[1]) ? tileTexture : tileGapTexture}
          />
        </mesh>
      );
    }
  }
  
  return (
    <>
      {meshes}
    </>
  );
}
