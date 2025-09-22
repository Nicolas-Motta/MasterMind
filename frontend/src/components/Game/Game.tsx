import React, { useState, useEffect } from "react";
import Button from "../Button/Button";
import OptionMenu from "../OptionMenu/OptionMenu";
import Window from "../Window/Window";
import Ball from "../Ball/Ball"
import Label from "../Label/Label";
import Result from "../Result/Result";
import { type Color as ColorType } from "../../Types/Color";
import { type Position } from "../../Types/Position";
import { usePositionContext } from "../../contexts/PositionContext";
import "./Game.css"
import { config } from "../../config";

interface BallData {
  id: string;
  color: ColorType;
  position: Position;
}

export default function Game() {
  const [optionMenu, setOptionMenu] = useState<React.ReactNode | null>(null);
  const [composition, setComposition] = useState<(BallData | null)[] | null>(null);
  const { setBall } = usePositionContext();

  function toggleOptionMenu() {
    if (optionMenu) {
      setOptionMenu(null);
    } else {
      setOptionMenu(<OptionMenu />);
    }
  }

  useEffect(() => {
    const fetchBallData = async () => {
      try {
        const requestBody = {
          instraction: "getBaseBall"
        };

      const response = await fetch(`${config.baseURL}/MasterMind/getBaseBall`, {
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
      setComposition(data.Label);

    } catch (error) {
      console.error(`Errore nell'aggiornamento Label:`, error);
    }
    };

    fetchBallData();
  }, []);

  useEffect(() => {
    setBall({
      id: "error",
      x: 0,
      y: 0,
      color: "ERROR",
      position: "ERROR"
    });
  }, []);

  return (
    <div className="Game">
      <Window className="gameSettings">
        <Button className="newGameButton">NEW GAME</Button>
        <Button className="optionButton" onClick={() => toggleOptionMenu()}>OPTION</Button>
        <Button className="mainMenuButton">MAIN MENU</Button>
        <Button className="quitButton">QUIT</Button>
      </Window>

      <div className="board">
        {Array.from({ length: 6 }, (_, i) => (
          <Label key={i} id={`LABEL${i}` as Position}></Label>
        ))}
        <Result />
      </div>

      <Window className="homeBall">
        {Array.from({ length: 6 }, (_, index) => (
          <div key={index} style={{ position: 'relative' }}>
            {composition !== null && composition[index] !== null ? (
              <Ball
                id={composition[index]!.id}
                color={composition[index]!.color as ColorType}
                position={(composition[index]!.position) as Position}
              />
            ) : null}
          </div>
        ))}
      </Window>

      {optionMenu}
    </div>
  );
}
