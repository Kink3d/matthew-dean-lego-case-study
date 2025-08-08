import { GameStateResult } from '../hooks';

export interface EnemiesProps {
    gameStateResult: GameStateResult;
}

export function Enemies(props: EnemiesProps) {
  const { enemyRenderPositions } = props.gameStateResult;

  return (
    <>
      {enemyRenderPositions.map((enemyPos, i) => (
        <Enemy key={i} position={[enemyPos[0], 0.5, enemyPos[1]]} />
      ))}
    </>
  )
}

function Enemy({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position}>
      <capsuleGeometry args={[0.3, 0.7, 8, 16]} />
      <meshPhysicalMaterial color="#464646" />
    </mesh>
  );
}
