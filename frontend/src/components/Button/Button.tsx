import React from "react"
import "./Button.css"

type ButtonProps = {
    children: React.ReactNode
    onClick?: () => void
    id?: string
}

export default function Button({ children, onClick, id }: ButtonProps) {
    return (
        <button className="game-button" id={id} onClick={onClick}>
            {children}
        </button>
    )
}