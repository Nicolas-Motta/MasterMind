import React, { useState, useCallback } from "react";
import Button from "../Button/Button";
import OptionMenu from "../OptionMenu/OptionMenu";
import Window from "../Window/Window";
import Ball from "../Ball/Ball"
import { type Color as ColorType } from "../../Types/Color";
import "./Game.css"

export default function Game() {
  const [optionMenu, setOptionMenu] = useState<React.ReactNode | null>(null);

  function toggleOptionMenu() {
    if (optionMenu) {
      setOptionMenu(null);
    } else {
      setOptionMenu(<OptionMenu />);
    }
  }

  // Funzione per richiedere i dati della pallina dal backend
  const fetchBallData = useCallback(async (): Promise<{ id: string; color: ColorType }> => {
    try {
      const requestBody = {
        instraction: "newHomeBall"
      };
      
      const response = await fetch('http://localhost:8080/MasterMind/newHomeBall', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.Ball) {
        return {
          id: data.Ball.id,
          color: data.Ball.color
        };
      } else {
        return {
          id: `error`,
          color: "ERROR"
        };
      }
    } catch (error) {
      return {
        id: `error`,
        color: "ERROR"
      };
    }
  }, []); // Array di dipendenze vuoto perché la funzione non dipende da nessuna prop o state

  return (
    <div className="Game">
      <Window className="gameSettings">
        <Button className="newGameButton">NEW GAME</Button>
        <Button className="optionButton" onClick={() => toggleOptionMenu()}>OPTION</Button>
        <Button className="mainMenuButton">MAIN MENU</Button>
        <Button className="quitButton">QUIT</Button>
      </Window>

      <Window className="homeBall">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} style={{ position: 'relative' }}>
            <Ball getBallInfo={fetchBallData} />
          </div>
        ))}
      </Window>

      {optionMenu}
    </div>
  );
}