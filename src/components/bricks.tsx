import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { GameStateResult } from '../hooks';
import { FileUtils } from '../utils';

export interface BricksProps {
    gameStateResult: GameStateResult;
}

useGLTF.preload(FileUtils.GetAbsolutePath("/assets/brick2x2.glb"));

export function Bricks(props: BricksProps) {
  const { brickRenderPositions } = props.gameStateResult;

  return (
    <>
      {brickRenderPositions.map((brickPos, i) => (
        <Brick key={i} position={[brickPos[0], brickPos[1], brickPos[2]]} />
      ))}
    </>
  )
}

function Brick({ position }: { position: [number, number, number] }) {
  const brick2x2 = useGLTF(FileUtils.GetAbsolutePath("/assets/brick2x2.glb"));
  const brickMesh = brick2x2.scene.children.find(child => (child as any).isMesh) as THREE.Mesh;
  if (!brickMesh) {
    console.error("Brick mesh not found");
    return null;
  }

  return (
    <>
      <mesh
        geometry={brickMesh.geometry}
        material={new THREE.MeshPhysicalMaterial({
            color: '#ff5722',
            roughness: 1.0,
            metalness: 0.0,
        })}
        position={position as [number, number, number]}
        scale={[0.5, 0.25, 0.5]}
      />
    </>
  );
}
