import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../Button/Button";
import OptionMenu from "../OptionMenu/OptionMenu";
import { quitApp } from "../../utils/electronUtils";

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

            <div className="gameSettings">
                <Button className="gameButton" id="newButton" onClick={() => restartGame()}>NEW GAME</Button>
                <Button id="optionMode" onClick={() => toggleOptionMenu(<OptionMenu />)}>OPTION</Button>
                <Button onClick={() => goToLobby()}>MAIN MENU</Button>
                <Button onClick={quitApp}>QUIT</Button>
            </div>

            {optionMenu}
        </div>
    );
}