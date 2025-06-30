import React from "react"
import Button from "../Button/Button"
import { quitApp } from "../../utils/electronUtils"
import "./Lobby.css"

export default function Lobby() {

    return (
        <div className="Lobby">
            <h1>MasterMind</h1>
            <div className="buttons">
                <Button id="carrerMode">CARRER</Button>
                <Button id="infinityMode">INFINITY</Button>
                <Button id='quitMode' onClick={quitApp}>QUIT</Button>
                <Button id="settingsMode">OPTION</Button>
            </div>
        </div>
    )
}