import { GameStateResult } from '../hooks';

interface PlayerProps {
  gameStateResult: GameStateResult;
}

export function Player(props: PlayerProps) {
  const { playerY, playerRenderPosition, playerScale } = props.gameStateResult;
  const playerPos: [number, number, number] = [playerRenderPosition.x, playerY, playerRenderPosition.z];

  return (
    <mesh position={playerPos} scale={[playerScale, playerScale, playerScale]}>
      <capsuleGeometry args={[0.3, 0.7, 8, 16]} />
      <meshPhysicalMaterial color="#ff5722" />
    </mesh>
  );
};
