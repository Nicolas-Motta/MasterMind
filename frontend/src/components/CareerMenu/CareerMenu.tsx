import React from "react";
import Button from "../Button/Button";
import Window from "../Window/Window";
import "./CareerMenu.css";
import { useNavigate } from "react-router-dom";

export default function CareerMenu() {
    const navigate = useNavigate();

    function goToGame() {
        navigate("/game");
    }

    return (
        <Window className="careerMenu">
            <h3>Career</h3>
            <Button className="newGameButton" onClick={() => goToGame()}>NEW GAME</Button>
            <Button>CONTINUE</Button>
            <Button>GAME SETTINGS</Button>
        </Window>
    );
}