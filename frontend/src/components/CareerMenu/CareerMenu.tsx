import React from "react";
import Button from "../Button/Button";
import "./CareerMenu.css";

export default function CareerMenu() {
    return (
        <div className="careerMenu">
            <h3>Career</h3>
            <Button className="gameButton" id="newButton">NEW GAME</Button>
            <Button className="gameButton" id="continueButton">CONTINUE</Button>
            <Button className="gameButton" id="settingsButton">GAME SETTINGS</Button>
        </div>
    );
}