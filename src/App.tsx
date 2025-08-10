import * as FIBER from '@react-three/fiber'
import { useContext, useEffect, useState } from 'react';
import { useCameraState, useGameState } from './hooks'
import { Camera, Goal, Lighting, MoveButtons, Player, TileMesh, Enemies, EndLevelUi, Bricks, MenuUi, MenuButton } from './components'
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

  // Adjust camera radius based on screen orientation
  useEffect(() => {
    const handleOrientationChange = () => {
      const isPortrait = window.innerHeight > window.innerWidth;
      if (isPortrait) {
        cameraStateResult.setRadius(8); // Larger radius for portrait mode
      } else {
        cameraStateResult.setRadius(5); // Default radius for landscape mode
      }
    };

    // Set initial radius
    handleOrientationChange();

    // Listen for orientation changes
    window.addEventListener('resize', handleOrientationChange);
    window.addEventListener('orientationchange', handleOrientationChange);

    return () => {
      window.removeEventListener('resize', handleOrientationChange);
      window.removeEventListener('orientationchange', handleOrientationChange);
    };
  }, [cameraStateResult.setRadius]);

  useEffect(() => {
    setStateContext({ cameraStateResult, gameStateResult });
  }, [cameraStateResult, gameStateResult]);

  if (!levelLoaded) return null;

  return (
      <>
        <Camera cameraStateResult={cameraStateResult} gameStateResult={gameStateResult} fieldOfView={75} />
        <Lighting />
        <TileMesh gameStateResult={gameStateResult} />
        <Enemies gameStateResult={gameStateResult} />
        <Player gameStateResult={gameStateResult} />
        <MoveButtons gameStateResult={gameStateResult} />
        <Goal levelData={levelData} />
        <Bricks gameStateResult={gameStateResult} />
      </>
  )
}

function UserInterface() {
  const { cameraStateResult, gameStateResult } = useContext(StateContext) || {};
  if (!cameraStateResult || !gameStateResult) return null;

  const { interfaceState } = gameStateResult;

  if (interfaceState === InterfaceState.Game) {
    return <MenuButton gameStateResult={gameStateResult} />;
  }

  if (interfaceState === InterfaceState.EndLevel) {
    return ( <EndLevelUi gameStateResult={gameStateResult} /> );
  }

  if (interfaceState === InterfaceState.Menu) {
    return ( <MenuUi gameStateResult={gameStateResult} /> );
  }
  
  return null;
}


export default App
