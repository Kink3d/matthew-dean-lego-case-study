import { InterfaceState } from "../data";
import { GameStateResult } from "../hooks";
import '../styles/menubutton.css'
import menubuttonImage from '/assets/menubutton.png'

export interface MenuButtonProps {
  gameStateResult: GameStateResult;
}

export function MenuButton(props: MenuButtonProps) {
  const { gameStateResult } = props;
  const { setInterfaceState } = gameStateResult;

  return (
    <button
      className="menu-button"
      onClick={() => setInterfaceState(InterfaceState.Menu)}
      title="Level Selection"
    >
      <img src={menubuttonImage} alt="Menu" />
    </button>
  );
}
