import { useState } from "react";

export interface CameraStateResult {
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };

  target: { x: number; y: number; z: number };
  setTarget: React.Dispatch<React.SetStateAction<{ x: number; y: number; z: number; }>>;
  radius: number;
  setRadius: React.Dispatch<React.SetStateAction<number>>;
  theta: number; // azimuthal angle (Y)
  setTheta: React.Dispatch<React.SetStateAction<number>>;
  phi: number; // polar angle (X)
  setPhi: React.Dispatch<React.SetStateAction<number>>;
}

export function useCameraState() {
  const defaultTarget = { x: 0, y: 0, z: 0 };
  const defaultTheta = Math.PI / 4; // 45 deg
  const defaultPhi = Math.acos(1 / Math.sqrt(2)); // ~54.74 deg
  const defaultZoom = 5;

  const [target, setTarget] = useState(defaultTarget);
  const [radius, setRadius] = useState(defaultZoom);
  const [theta, setTheta] = useState(defaultTheta);
  const [phi, setPhi] = useState(defaultPhi);

  // Compute position from spherical coordinates
  const position = {
      x: target.x + radius * Math.sin(phi) * Math.sin(theta),
      y: target.y + radius * Math.cos(phi),
      z: target.z + radius * Math.sin(phi) * Math.cos(theta)
  };

  // Camera should look at the target, so compute rotation accordingly
  const rotation = {
      x: -phi,
      y: theta,
      z: 0
  };

  return {
      position,
      rotation,
      target,
      setTarget,
      radius,
      setRadius,
      theta,
      setTheta,
      phi,
      setPhi
  };
}
