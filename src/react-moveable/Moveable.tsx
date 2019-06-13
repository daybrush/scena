import * as React from "react";
import { prefix } from "../react-scenejs-editor/utils";
import styled from "styled-components";

const ControlBox = styled.div`
    position: fixed;
    width: 0;
    height: 0;
    left: 0;
    top: 0;
`;

export default class Moveable extends React.PureComponent<{
    target?: HTMLElement,
}> {
    public render() {
        const { target } = this.props;
        // if (!target) {
        //     return null;
        // }
        // const { left, top, width, height } = target.getBoundingClientRect();
        const left = 100;
        const top = 100;
        return (
            <ControlBox
                className={prefix("control-box")} style={{ position: "fixed", left: `${left}px`, top: `${top}px` }}>
                <div className={prefix("control", "nw")}></div>
                <div className={prefix("control", "n")}></div>
                <div className={prefix("control", "ne")}></div>

                <div className={prefix("control", "w")}></div>
                <div className={prefix("control", "e")}></div>

                <div className={prefix("control", "sw")}></div>
                <div className={prefix("control", "s")}></div>
                <div className={prefix("control", "se")}></div>
            </ControlBox>
        );
    }
}
