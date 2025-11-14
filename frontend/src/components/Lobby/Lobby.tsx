import React, { useState, useEffect } from "react"
import Button from "../Button/Button"
import CareerMenu from "../CareerMenu/CareerMenu"
import OptionMenu from "../OptionMenu/OptionMenu"
import InfinityPop from "../InfinityPop/InfinityPop"
import { preloadComponents } from "../../utils/preloadUtils"
import "./Lobby.css"

export default function Lobby() {
    const [careertMenu, setCareertMenu] = useState<React.ReactNode | null>(null);
    const [optionMenu, setOptionMenu] = useState<React.ReactNode | null>(null);
    const [infinityPop, setInfinityPop] = useState<React.ReactNode | null>(null);

    // Preload del componente Game al mount della Lobby
    useEffect(() => {
        preloadComponents.preloadGame();
    }, []);

    function toggleCareertMenu() {
        if (careertMenu) {
            setCareertMenu(null);
        } else {
            setCareertMenu(<CareerMenu />);
            setOptionMenu(null);
            setInfinityPop(null);
        }
    }

    function toggleOptionMenu() {
        if (optionMenu) {
            setOptionMenu(null);
        } else {
            setOptionMenu(<OptionMenu />);
            setCareertMenu(null);
            setInfinityPop(null);
        }
    }

    function toggleInfinityPop() {
        if (infinityPop) {
            setInfinityPop(null);
        } else {
            setInfinityPop(<InfinityPop />);
            setCareertMenu(null);
            setOptionMenu(null);
        }
    }

    return (
        <div className="Lobby">
            <h1>MasterMind</h1>
            <div className="buttons">
                <Button 
                    className="careerButton" 
                    onClick={() => toggleCareertMenu()}
                >
                    CAREER
                </Button>
                <Button 
                    className="infinityButton"
                    onClick={() => toggleInfinityPop()}
                    >
                        INFINITY</Button>
                <Button className='quitButton'>QUIT</Button>
                <Button 
                    className="optionButton" 
                    onClick={() => toggleOptionMenu()}
                >
                    OPTION
                </Button>
            </div>
            {careertMenu}
            {optionMenu}
            {infinityPop}
        </div>
    )
}