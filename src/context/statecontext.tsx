import { createContext } from "react";
import { CameraStateResult, GameStateResult } from "../hooks";

export interface StateContextData {
  cameraStateResult: CameraStateResult;
  gameStateResult: GameStateResult;
}

// The StateContext provides access to the camera and game state
// from the Three.js canvas to the rest of the application
// This allows us to lift state up from the hooks inside the Three.js Canvas
export const StateContext = createContext<StateContextData | null>(null);
