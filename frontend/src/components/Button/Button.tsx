import React from "react"
import "./Button.css"

type ButtonProps = {
    children: React.ReactNode
    onClick?: () => void
    id?: string
    className?: string
}

export default function Button({ children, onClick, id, className }: ButtonProps) {
    const buttonClasses = `game-button ${className || ''}`.trim()
    
    return (
        <button className={buttonClasses} id={id} onClick={onClick}>
            {children}
        </button>
    )
}