import Button from "../Button/Button";
import Window from "../Window/Window";
import "./CareerMenu.css";

export default function CareerMenu() {

    return (
        <Window className="careerMenu">
            <h3>Career</h3>
            <Button 
                className="newGameButton" 
                disabled={false}
            > NEW GAME</Button>
            <Button
                className="continueGameButton"
                disabled={false}
            > CONTINUE</Button>
            <Button>GAME SETTINGS</Button>
        </Window>
    );
}