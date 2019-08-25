import React from "react";
import { prefix } from "../../utils";

export default class TextIcon extends React.PureComponent {
    public render() {
        return (
            <div className={prefix("icon")}>
                <svg viewBox="0 0 80 80">
                    <g transform="matrix(0.987601,0,0,0.987601,-1.97306,0.554734)">
                        <path
// tslint:disable-next-line: max-line-length
                            d="M64.286,17.81L20.714,17.81L20.714,29.56L29.214,23L39.262,23L39.262,55.476L27.77,61.262L27.77,62.071L57.23,62.071L57.23,61.262L45.738,55.476L45.738,23L55.786,23L64.286,29.56L64.286,17.81Z"
                            style={{ fill: "white" }} />
                    </g>
                </svg>
            </div>
        );
    }
}
