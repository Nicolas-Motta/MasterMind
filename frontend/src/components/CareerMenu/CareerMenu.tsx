import Button from "../Button/Button";
import Window from "../Window/Window";
import "./CareerMenu.css";

export default function CareerMenu() {
    return (
        <Window className="careerMenu">
            <h3>Career</h3>
            <Button className="newGameButton">NEW GAME</Button>
            <Button className="continueGameButton">CONTINUE</Button>
            <Button>GAME SETTINGS</Button>
        </Window>
    );
}