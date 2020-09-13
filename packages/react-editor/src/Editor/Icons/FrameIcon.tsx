import * as React from "react";
import Icon from "./Icon";

export default class FrameIcon extends Icon {
    public static id = "Frame";
    public renderIcon() {
        return (
            <svg viewBox="0 0 80 80">
                <g transform="matrix(1.18519,0,0,2.42309,-7.4076,-21.5629)">
                    <rect x="13" y="17" width="54" height="2" fill="white" />
                </g>
                <g transform="matrix(1.18519,0,0,2.42309,-7.40741,14.3317)">
                    <rect x="13" y="17" width="54" height="2" fill="white" />
                </g>
                <g transform="matrix(1.03519,0,0,1.31422,37.8389,-2.71207)">
                    <rect x="13" y="25" width="20" height="15" fill="white" />
                </g>
                <g transform="matrix(1.03519,0,0,1.31422,11.7648,-2.71207)">
                    <rect x="13" y="25" width="20" height="15" fill="white" />
                </g>
                <g transform="matrix(0.592593,0,0,1.31422,0.296296,-2.71207)">
                    <rect x="13" y="25" width="20" height="15" fill="white" />
                </g>
            </svg>
        );
    }
}
