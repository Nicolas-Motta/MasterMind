import React, { useState } from "react"
import Button from "../Button/Button"
import CareerMenu from "../CareerMenu/CareerMenu"
import { quitApp } from "../../utils/electronUtils"
import "./Lobby.css"

export default function Lobby() {
    const [careertMenu, setCareertMenu] = useState<React.ReactNode | null>(null);

    function toggleCareertMenu(menuComponent: React.ReactNode) {
        if (careertMenu) {
            setCareertMenu(null);
        } else {
            setCareertMenu(menuComponent);
        }
    }

    return (
        <div className="Lobby">
            <h1>MasterMind</h1>
            <div className="buttons">
                <Button id="careerMode" onClick={() => toggleCareertMenu(<CareerMenu />)}>CAREER</Button>
                <Button id="infinityMode">INFINITY</Button>
                <Button id='quitMode' onClick={quitApp}>QUIT</Button>
                <Button id="settingsMode">OPTION</Button>
            </div>
            {careertMenu}
        </div>
    )
}