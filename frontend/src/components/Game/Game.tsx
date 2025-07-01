import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import OptionMenu from "../OptionMenu/OptionMenu";
import Window from "../Window/Window";

import "./Game.css";

export default function Game() {
    const navigate = useNavigate();
    const [optionMenu, setOptionMenu] = useState<React.ReactNode | null>(null);

    function goToLobby() {
        navigate("/");
    }

    function restartGame() {

    }

    function toggleOptionMenu(menuComponent: React.ReactNode) {
        if (optionMenu) {
            setOptionMenu(null);
        } else {
            setOptionMenu(menuComponent);
        }
    }

    return (
        <div className="Game">
            <div className="homeBall">
                
            </div>

            <Window className="gameSettings">
                <Button className="newGameButton" id="newButton" onClick={() => restartGame()}>NEW GAME</Button>
                <Button className="optionButton" id="optionMode" onClick={() => toggleOptionMenu(<OptionMenu />)}>OPTION</Button>
                <Button onClick={() => goToLobby()}>MAIN MENU</Button>
                <Button className="quitButton">QUIT</Button>
            </Window>

            {optionMenu}
        </div>
    );
}