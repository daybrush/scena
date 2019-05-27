import * as React from "react";
import { prefix } from "../../utils";

export default ({
    maxTime,
}: {
    maxTime: number,
}) => {
    const lines = [];
    for (let time = 0; time <= maxTime; ++time) {
        lines.push(
            <div className={prefix("division-line")} key={time} style={{ left: `${100 / maxTime * time}%` }}></div>,
        );
    }
    return (<div className={prefix("line-area")}>{lines}</div>);
};
