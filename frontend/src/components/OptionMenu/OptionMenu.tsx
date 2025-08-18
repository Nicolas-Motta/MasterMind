import Button from "../Button/Button";
import Window from "../Window/Window";
import "./OptionMenu.css";

export default function OptionMenu() {
    return (
        <Window className="optionMenu">
            <h3>Option</h3>
            <Button className="statsButton">STATS</Button>
            <Button>SOUND</Button>
            <Button>GRAFICH</Button>
        </Window>
    );
}