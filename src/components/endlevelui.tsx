import { InterfaceState } from "../data";
import { GameStateResult } from "../hooks";
import '../styles/endlevelui.css'

export interface EndLevelUiProps {
  gameStateResult: GameStateResult;
}

export function EndLevelUi(props: EndLevelUiProps) {
  const { gameStateResult } = props;
  const { movesTaken, levelData, setLevelLoaded } = gameStateResult;
  const perfectMoves = levelData.level.perfectMoves;
  const isPerfect = movesTaken <= perfectMoves;
  return (
    <div className="end-level-overlay">
      <div className="end-level-modal">
        <h2 style={{ marginBottom: 16 }}>{isPerfect ? 'Perfect!' : 'Clear'}</h2>
        <div style={{ marginBottom: 16 }}>
          <div>Moves taken: {movesTaken}</div>
          <div>Perfect goal: {perfectMoves}</div>
        </div>
        <button
          className="end-level-btn"
          onClick={() => {
            gameStateResult.setInterfaceState(InterfaceState.Game);
            setLevelLoaded(true);
            gameStateResult.setActiveLevelIndex(gameStateResult.activeLevelIndex); 
          }}
        >Retry</button>
        <button
          className="end-level-btn"
          onClick={() => {
            gameStateResult.setInterfaceState(InterfaceState.Game);
            setLevelLoaded(true);
            gameStateResult.setActiveLevelIndex((gameStateResult.activeLevelIndex + 1) % gameStateResult.Levels.length);
          }}
        >Next</button>
      </div>
    </div>
  );
}
