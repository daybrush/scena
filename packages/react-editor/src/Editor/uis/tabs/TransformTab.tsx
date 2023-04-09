
import * as React from "react";
import { prefix } from "../../utils/utils";
import styled from "react-css-styled";
import Anchor from "./inputs/Anchor";
import { Text, TextInstance } from "./inputs/Text";
import { useStoreStateValue } from "@scena/react-store";
import { $actionManager, $moveable } from "../../stores/stores";
import { RectInfo } from "react-moveable";
import { LinkIcon, UnlinkIcon } from "../icons";

const TransformTabElement = styled("div", `
{
    color: var(--scena-editor-color-text);
    font-size: 12px;
}
.scena-tab-line {
    display: flex;
    align-content: center;
    align-items: stretch;
}
.scena-tab-grid {
    width: 80px;
    flex: 1;
}
.scena-tab-input-grid {
    display: flex;
    height: 30px;
}
.scena-tab-label {
    line-height: 30px;
    padding: 0px 8px;
    cursor: ew-resize;
}
.scena-tab-anchor {
    display: flex;
    align-content: center;
    align-items: center;
    justify-content: center;
    padding: 10px;
    height: 60px;
    box-sizing: border-box;
}
.scena-tab-grid-link {
    user-select: none;
    position: relative;
    width: 15px;
    height: 60px;
}
.scena-tab-link {
    position: absolute;
    width: 15px;
    height: 15px;
    fill: #fff;
    top: 30px;
    left: 50%;
    transform: translate(-50%, -50%) rotate(90deg);
}
`);



export default function TransformTab() {
    const actionManager = useStoreStateValue($actionManager);
    const moveableRef = useStoreStateValue($moveable);
    const [keepRatio, setKeepRatio] = React.useState(true);

    const xRef = React.useRef<TextInstance>(null);
    const yRef = React.useRef<TextInstance>(null);
    const wRef = React.useRef<TextInstance>(null);
    const hRef = React.useRef<TextInstance>(null);
    const rRef = React.useRef<TextInstance>(null);

    React.useEffect(() => {
        const onUpdate = (e: { rect: RectInfo }) => {
            const rect = e.rect;

            xRef.current!.setValue(rect.left.toFixed(1));
            yRef.current!.setValue(rect.top.toFixed(1));
            wRef.current!.setValue(rect.width.toFixed(1));
            hRef.current!.setValue(rect.height.toFixed(1));
            rRef.current!.setValue(rect.rotation.toFixed(1));
        };
        actionManager.on("get.rect", onUpdate);

        return () => {
            actionManager.off("get.rect", onUpdate);
        };
    }, []);

    return <TransformTabElement>
        <div className={prefix("tab-line")}>
            <div className={prefix("tab-grid", "tab-anchor")}>
                <Anchor />
            </div>
            <div className={prefix("tab-grid")}>
                <div className={prefix("tab-grid", "tab-input-grid")}>
                    <div className={prefix("tab-label")}>X</div>
                    <div className={prefix("tab-input")}>
                        <Text ref={xRef} defaultValue={0} onChangeValue={value => {
                            moveableRef.current!.request("draggable", {
                                x: parseFloat(value),
                            }, true);
                        }} />
                    </div>
                </div>
                <div className={prefix("tab-grid", "tab-input-grid")}>
                    <div className={prefix("tab-label")}>Y</div>
                    <div className={prefix("tab-input")}>
                        <Text ref={yRef} defaultValue={0} onChangeValue={value => {
                            moveableRef.current!.request("draggable", {
                                y: parseFloat(value),
                            }, true);
                        }} />
                    </div>
                </div>
                <div className={prefix("tab-grid", "tab-input-grid")}>
                    <div className={prefix("tab-label")}>R</div>
                    <div className={prefix("tab-input")}>
                        <Text ref={rRef} defaultValue={0} onChangeValue={value => {
                            moveableRef.current!.request("rotatable", {
                                rotate: parseFloat(value),
                            }, true);
                        }} />
                    </div>
                </div>
            </div>
            <div className={prefix("tab-grid")}>
                <div className={prefix("tab-grid", "tab-input-grid")}>
                    <div className={prefix("tab-label")}>W</div>
                    <div className={prefix("tab-input")}>
                        <Text ref={wRef} defaultValue={0} onChangeValue={value => {
                            moveableRef.current!.request("resizable", {
                                keepRatio,
                                offsetWidth: parseFloat(value),
                            }, true);
                        }} />
                    </div>
                </div>
                <div className={prefix("tab-grid", "tab-input-grid")}>
                    <div className={prefix("tab-label")}>H</div>
                    <div className={prefix("tab-input")}>
                        <Text ref={hRef} defaultValue={0} onChangeValue={value => {
                            moveableRef.current!.request("resizable", {
                                keepRatio,
                                offsetHeight: parseFloat(value),
                            }, true);
                        }} />
                    </div>
                </div>
            </div>
            <div className={prefix("tab-grid", "tab-grid-link")} onClick={e => {
                e.preventDefault();
                setKeepRatio(!keepRatio);
            }}>
                {keepRatio
                    ? <LinkIcon className={prefix("tab-link")} />
                    : <UnlinkIcon className={prefix("tab-link")} />}
            </div>
        </div>
    </TransformTabElement>;
}
