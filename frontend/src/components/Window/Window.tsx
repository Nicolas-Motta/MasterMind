import React from "react";
import "./Window.css";

type WindowProps = {
    children: React.ReactNode;
    id?: string
    className?: string
};

export default function Window({ className, id, children }: WindowProps) {
    const windowClasses = `window ${className || ''}`.trim()

    return (
        <div className={windowClasses} id={id}>
            {children}
        </div>
    );
}