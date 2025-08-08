import * as THREE from 'three';
import { useLoader } from '@react-three/fiber';
import { GameStateResult } from '../hooks/usegamestate.hooks';
import { FileUtils } from '../utils';

export interface MoveButtonsProps {
  gameStateResult: GameStateResult;
}

export function MoveButtons(props: MoveButtonsProps) {
  const { gameStateResult } = props;
  const { playerPosition, playerTile, winAnimation, moveTo, moving, displayMoveButtons } = gameStateResult;
  if (!displayMoveButtons) return null;

  const playerGridPos: [number, number] = [playerPosition.x, playerPosition.z];
  if (!playerTile || !playerTile.nav || winAnimation) return null;
  
  const nav = playerTile.nav;
  if (!nav) return;

  const directions = [
    { dir: 'up',    offset: [-1, 0] },
    { dir: 'down',  offset: [1, 0] },
    { dir: 'left',  offset: [0, -1] },
    { dir: 'right', offset: [0, 1] },
  ];

  return (
    <>
      {directions.map(({ dir, offset }) => {
        if (nav[dir as keyof typeof playerTile.nav]) {
          const pos: [number, number] = [playerGridPos[0] + offset[0], playerGridPos[1] + offset[1]];
          return (
            <MoveButton3D
              key={dir}
              position={pos}
              direction={dir as any}
              onClick={() => moveTo({ x: pos[0], y: 0, z: pos[1] })}
              disabled={moving}
            />
          );
        }
        return null;
      })}
    </>
  );
};

function MoveButton3D(props: {
  position: [number, number];
  direction: 'up' | 'down' | 'left' | 'right';
  onClick: () => void;
  disabled?: boolean;
}) {
  const texture = useLoader(THREE.TextureLoader, FileUtils.GetAbsolutePath("arrow.png"));

  const { position, direction, onClick, disabled } = props;
  const [y, x] = position;
  const scale: [number, number, number] = [1, 0.0001, 1];
  const pos: [number, number, number] = [y, scale[1] / 2, x];
  const rotation = direction === 'left' ? 0 : direction === 'right' ? Math.PI : direction === 'up' ? Math.PI * 0.5 : Math.PI * 1.5;

  return (
    <mesh
      key={direction}
      position={pos}
      scale={scale}
      rotation={[0, rotation, 0]}
      onClick={disabled ? undefined : onClick}
    >
      <boxGeometry />
      <meshBasicMaterial 
        transparent
        color="#ffffff"
        map={texture}
      />
    </mesh>
  );
};
