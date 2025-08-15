const Color = {
    RED: "RED",
    BLUE: "BLUE", 
    GREEN: "GREEN",
    YELLOW: "YELLOW",
    ORANGE: "ORANGE",
    PURPLE: "PURPLE",
    ERROR: "ERROR"
} as const;

export type Color = typeof Color[keyof typeof Color];

export default Color;
