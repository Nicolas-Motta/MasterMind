import React from "react";
import Button from "../Button/Button";
import Window from "../Window/Window";
import "./OptionMenu.css";

export default function OptionMenu() {
    return (
        <Window className="optionMenu">
            <h3>Option</h3>
            <Button className="optionButton" id="statsButton">STATS</Button>
            <Button className="optionButton" id="soundButton">SOUND</Button>
            <Button className="optionButton" id="grafichButton">GRAFICH</Button>
        </Window>
    );
}