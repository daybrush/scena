import { useStoreStateValue, useStoreValue } from "@scena/react-store";
import { width } from "@webtoon/psd/dist/utils";
import * as React from "react";
import styled from "react-css-styled";
import { RectInfo } from "react-moveable";
import {
    $actionManager, $groupOrigin, $historyManager,
    $layerManager, $moveable, $selectedLayers,
} from "../../../stores/stores";
import { prefix } from "../../../utils/utils";

const AnchorElement = styled("div", `
{
    position: relative;
    width: 38px;
    height: 38px;
    box-sizing: border-box;
    padding: 4px;
}
.scena-anchor-input-background {
    position: relative;
    width: 30px;
    height: 30px;
    background: var(--scena-editor-color-background-bold);
}
.scena-anchor-control {
    position: absolute;
    width: 8px;
    height: 8px;
    transform: translate(-50%, -50%);
    left: 50%;
    top: 50%;
    padding: 1px;
    box-sizing: border-box;
    cursor: pointer;
}
.scena-anchor-control:before {
    content: "";
    position: relative;
    display: block;
    background: var(--scena-editor-color-text-unlit);
    width: 100%;
    height: 100%;
}
.scena-anchor-control.scena-anchor-selected {
    padding: 0px;
}
.scena-anchor-control.scena-anchor-selected:before {
    background: var(--scena-editor-color-text);
}
.scena-anchor-control.scena-anchor-n {
    top: 0;
}
.scena-anchor-control.scena-anchor-s {
    top: 100%;
}
.scena-anchor-control.scena-anchor-w {
    left: 0;
}
.scena-anchor-control.scena-anchor-e {
    left: 100%;
}
`);



const HORIZONTAL_DIRECTIONS = ["w", "", "e"];
const VERTICAL_DIRECTIONS = ["n", "", "s"];

export default function Anchor() {
    const actionManager = useStoreStateValue($actionManager);
    const [origin, setOrigin] = React.useState([50, 50]);
    const originValue = origin.map(v => {
        return Math.min(100, Math.max(0, Math.round(v / 50) * 50));
    });

    const moveableRef = useStoreStateValue($moveable);
    const historyManager= useStoreStateValue($historyManager);
    const layerManager = useStoreStateValue($layerManager);
    const selectedLayersStore = useStoreValue($selectedLayers);
    const groupOriginStore = useStoreValue($groupOrigin);



    React.useEffect(() => {
        const onUpdate = (e: { rect: RectInfo }) => {
            const rect = e.rect;

            setOrigin([
                rect.transformOrigin[0] / rect.width * 100,
                rect.transformOrigin[1] / rect.height * 100,
            ]);
        };
        actionManager.on("get.rect", onUpdate);

        return () => {
            actionManager.off("get.rect", onUpdate);
        };
    }, []);

    const onClick = (e: any) => {
        const target = e.currentTarget as HTMLElement;
        const indexes = target.getAttribute("data-anchor-index");

        if (!indexes) {
            return;
        }
        const origin = indexes.split(",").map(v => `${parseFloat(v) * 50}%`).join(" ");
        const layers = layerManager.toFlatten(selectedLayersStore.value);

        if (layers.length > 1) {
            groupOriginStore.update(origin);
        } else {
            historyManager.addHistory("render", {
                infos: layers.map(layer => {
                    const frame = layerManager.getFrame(layer);
                    const prev = frame.toCSSObject();
                    frame.set("transform-origin", origin);


                    layer.ref.current!.style.cssText += frame.toCSSText();
                    return {
                        layer,
                        prev,
                        next: frame.toCSSObject(),
                    };
                }),
            });
            moveableRef.current?.updateRect();
        }
        actionManager.requestAct("update.rect");
    };
    return (
        <AnchorElement className={prefix("anchor-input")}>
            <div className={prefix("anchor-input-background")}>
                {VERTICAL_DIRECTIONS.map((v, i) => {
                    return HORIZONTAL_DIRECTIONS.map((h, j) => {
                        const classNames: string[] = [];
                        if (v) {
                            classNames.push(`anchor-${v}`);
                        }
                        if (h) {
                            classNames.push(`anchor-${h}`);
                        }
                        if (originValue[0] === j * 50 && originValue[1] === i * 50) {
                            classNames.push(`anchor-selected`);
                        }
                        return <div key={`dir${h}-${v}`}
                            className={prefix("anchor-control", ...classNames)}
                            data-anchor-index={`${j},${i}`}
                            onClick={onClick}
                        ></div>;
                    });
                })}
            </div>
        </AnchorElement>
    );
}

