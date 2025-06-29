import React from "react"
import Button from "../Button/Button"
import "./Lobby.css"

export default function Lobby() {
    return (
        <div className="Lobby">
            <h1>MasterMind</h1>
            <div className="buttons">
                <Button id="carrerMode">CARRER</Button>
                <Button id="infinityMode">INFINITY</Button>
                <Button id='quitMode'>QUIT</Button>
                <Button id="settingsMode">SETTING</Button>
            </div>
        </div>
    )
}