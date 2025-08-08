import * as FIBER from '@react-three/fiber'
import { useContext, useEffect, useState } from 'react';
import { useCameraState, useGameState } from './hooks'
import { Camera, Goal, Lighting, MoveButtons, Player, TileMesh, Enemies, EndLevelUi } from './components'
import { StateContext, StateContextData } from './context';
import { Levels, InterfaceState } from './data'
import './App.css'

function App() {
  // Use a Context to lift state up from the hooks inside the Three.js Canvas
  // This allows us to provide the camera and game state to the UserInterface component
  const [stateContext, setStateContext] = useState<StateContextData | null>(null);

  return (
    <>
      <FIBER.Canvas className="canvas">
        {/* Pass the Context setter down. We then set the state hooks from inside the Three.js canvas */}
        < Canvas setStateContext = { setStateContext } />
      </FIBER.Canvas>
      {/* Provide the SceneStateContext to the Interface component to get state from the Three.js canvas */}
      {stateContext && (
        <StateContext.Provider value={stateContext}>
          <UserInterface/>
        </StateContext.Provider>
      )}
    </>
  )
}

interface CanvasProps {
  setStateContext: React.Dispatch<React.SetStateAction<StateContextData | null>>
}

function Canvas(props: CanvasProps) {
  const { setStateContext } = props;

  const cameraStateResult = useCameraState();
  const gameStateResult = useGameState(Levels);
  const { levelData, levelLoaded } = gameStateResult;

  useEffect(() => {
    setStateContext({ cameraStateResult, gameStateResult });
  }, [cameraStateResult, gameStateResult]);

  if (!levelLoaded) return null;

  return (
      <>
        <Camera cameraStateResult={cameraStateResult} gameStateResult={gameStateResult} fieldOfView={75} />
        <Lighting />
        <TileMesh levelData={levelData} />
        <Enemies gameStateResult={gameStateResult} />
        <Player gameStateResult={gameStateResult} />
        <MoveButtons gameStateResult={gameStateResult} />
        <Goal levelData={levelData} />
      </>
  )
}

function UserInterface() {
  const { cameraStateResult, gameStateResult } = useContext(StateContext) || {};
  if (!cameraStateResult || !gameStateResult) return null;

  const { interfaceState } = gameStateResult;

  if (interfaceState === InterfaceState.Game) return null;

  if (interfaceState === InterfaceState.EndLevel) {
    return ( <EndLevelUi gameStateResult={gameStateResult} /> );
  }
  
  return null;
}


export default App
