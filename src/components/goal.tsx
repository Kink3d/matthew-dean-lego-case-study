import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { LevelData } from "../data";
import { FileUtils } from '../utils';

export interface GoalProps {
  levelData: LevelData;
}

useGLTF.preload(FileUtils.GetAbsolutePath("/assets/goalcube.glb"));

export function Goal(props: GoalProps) {
  const goalcubeTexture = useLoader(THREE.TextureLoader, FileUtils.GetAbsolutePath("/assets/goalcube.png"));
  
  // Fix texture color space
  goalcubeTexture.colorSpace = THREE.SRGBColorSpace;
  goalcubeTexture.flipY = false;

  const { levelData } = props;

  const goalPosition = [levelData.level.goalPosition[0], 0.5, levelData.level.goalPosition[1]];
  const goalCube = useGLTF(FileUtils.GetAbsolutePath("/assets/goalcube.glb"));
  const goalMesh = goalCube.scene.children.find(child => (child as any).isMesh) as THREE.Mesh;
  if (!goalMesh) {
    console.error("Goal mesh not found");
    return null;
  }
  
  return (
    <>
      <mesh
        key="goalcube"
        geometry={goalMesh.geometry}
        material={new THREE.MeshBasicMaterial({ 
          color: 'white', 
          map: goalcubeTexture, 
          transparent: true, 
          side: THREE.DoubleSide,
          blending: THREE.CustomBlending,
        })}
        position={goalPosition as [number, number, number]}
        scale={[0.5, 0.5, 0.5]}
      />
    </>
  );
}
