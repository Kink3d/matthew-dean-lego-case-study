import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { LevelData, TileType } from "../data";
import { FileUtils } from '../utils';

export interface TileMeshProps {
  levelData: LevelData;
}


export function TileMesh(props: TileMeshProps) {
  const tileTexture = useLoader(THREE.TextureLoader, FileUtils.GetAbsolutePath("tile.png"));
  
  const { levelData } = props;
  const meshes: React.ReactNode[] = [];

  for (let i = 0; i < levelData.tileDatas.length; i++) {
    const tileData = levelData.tileDatas[i];
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
    }
  }
  
  return (
    <>
      {meshes}
    </>
  );
}
