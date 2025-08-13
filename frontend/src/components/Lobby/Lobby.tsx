import React, { useState } from "react"
import Button from "../Button/Button"
import CareerMenu from "../CareerMenu/CareerMenu"
import OptionMenu from "../OptionMenu/OptionMenu"
import "./Lobby.css"

export default function Lobby() {
    const [careertMenu, setCareertMenu] = useState<React.ReactNode | null>(null);
    const [optionMenu, setOptionMenu] = useState<React.ReactNode | null>(null);

    function toggleCareertMenu(menuComponent: React.ReactNode) {
        if (careertMenu) {
            setCareertMenu(null);
        } else {
            setCareertMenu(menuComponent);
            setOptionMenu(null);
        }
    }

    function toggleOptionMenu(menuComponent: React.ReactNode) {
        if (optionMenu) {
            setOptionMenu(null);
        } else {
            setOptionMenu(menuComponent);
            setCareertMenu(null);
        }
    }

    return (
        <div className="Lobby">
            <h1>MasterMind</h1>
            <div className="buttons">
                <Button className="careerButton" onClick={() => toggleCareertMenu(<CareerMenu />)}>CAREER</Button>
                <Button className="infinityButton">INFINITY</Button>
                <Button className='quitButton'>QUIT</Button>
                <Button className="optionButton" onClick={() => toggleOptionMenu(<OptionMenu />)}>OPTION</Button>
            </div>
            {careertMenu}
            {optionMenu}
        </div>
    )
}