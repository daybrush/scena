import * as React from "react";
import Icon from "./Icon";

export default class LayerIcon extends Icon {
    public static id = "Layer";
    public renderIcon() {
        return (
            <svg viewBox="0 0 73 73">
                <path d="M36.5,20 L56.5,30 L36.5,40 L16.5,30 L36.5,20Z" stroke="#fff" strokeWidth="3" style={{
                    fill: "rgba(255, 255, 255, 0.5)",
                }}></path>
                     <path d="M36.5,20 L56.5,30 L36.5,40 L16.5,30 L36.5,20Z" stroke="#fff" strokeWidth="3" style={{
                    fill: "rgba(255, 255, 255, 0.5)",
                    transform: "translateY(10px)",
                }}></path>
                <path d="M36.5,20 L56.5,30 L36.5,40 L16.5,30 L36.5,20Z" fill="#fff" stroke="#fff" strokeWidth="3" style={{
                    transform: "translateY(20px)",
                }}></path>
            </svg>
        );
    }
}
