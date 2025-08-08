import * as FIBER from '@react-three/fiber'
import * as THREE from 'three';
import { CameraStateResult, GameStateResult } from '../hooks';

export interface CameraProps {
  cameraStateResult: CameraStateResult;
  gameStateResult: GameStateResult;
  fieldOfView: number;
}

export function Camera({ cameraStateResult, gameStateResult, fieldOfView }: CameraProps) {
  // Get the camera from the FIBER context
  const { position, rotation } = cameraStateResult;
  const { levelData } = gameStateResult;
  const { camera } = FIBER.useThree();
  const perspectiveCamera = camera as THREE.PerspectiveCamera;

  // Offset camera position and target by levelOrigin
  const centerY = levelData.levelOrigin[0];
  const centerX = levelData.levelOrigin[1];
  perspectiveCamera.position.set(
    position.x + centerY,
    position.y,
    position.z + centerX
  );

  perspectiveCamera.rotation.set(rotation.x, rotation.y, rotation.z, 'YXZ');
  perspectiveCamera.fov = fieldOfView;
  perspectiveCamera.updateProjectionMatrix();
  return null;
}
