import React, { useState } from "react";
import Button from "../Button/Button";
import OptionMenu from "../OptionMenu/OptionMenu";
import Window from "../Window/Window";
import "./Game.css"

export default function Game() {
  const [optionMenu, setOptionMenu] = useState<React.ReactNode | null>(null);

  React.useEffect(() => {
    console.log("Game component mounted");
  }, []);

  function toggleOptionMenu() {
    if (optionMenu) {
      setOptionMenu(null);
    } else {
      setOptionMenu(<OptionMenu />);
    }
  }

  return (
    <div className="Game">
      <Window className="gameSettings">
        <Button className="newGameButton">NEW GAME</Button>
        <Button className="optionButton" onClick={() => toggleOptionMenu()}>OPTION</Button>
        <Button className="mainMenuButton">MAIN MENU</Button>
        <Button className="quitButton">QUIT</Button>
      </Window>
      {optionMenu}
    </div>
  );
}