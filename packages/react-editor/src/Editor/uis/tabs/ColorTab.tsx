
import * as React from "react";
import { prefix } from "../../utils/utils";
import styled from "react-css-styled";
import Anchor from "./inputs/Anchor";
import { Text } from "./inputs/Text";
import { ChromePicker, ColorResult } from "react-color";
import { useStoreStateValue, useStoreValue } from "@scena/react-store";
import {
    $actionManager, $historyManager, $layerManager,
    $selectedFlattenLayers, $selectedLayers,
} from "../../stores/stores";
import { Frame, rgbaToHexa, rgbaToHexWithOpacity } from "scenejs";
import { useAction } from "../../hooks/useAction";
import { COLOR_MODELS, hexToRGBA, stringToRGBA } from "@daybrush/utils";

const ColorTabElement = styled("div", `
{
    color: var(--scena-editor-color-text);
    font-size: 12px;
    padding: 0px 5px;
    display: flex;
    align-content: center;
    align-items: stretch;
}

.scena-tab-grid {
    flex: auto;
}

.scena-tab-grid-color {
    position: relative;
    padding: 5px;
    width: 30px;
    height: 30px;
    box-sizing: border-box;
}
.scena-tab-grid-color:before {
    position: absolute;
    content: "";
    width: 20px;
    height: 20px;
    top: 5px;
    left: 5px;
    z-index: 0;
    background: #fff;
}
.scena-tab-grid-color:after {
    position: absolute;
    content: "";
    width: 20px;
    height: 20px;
    top: 5px;
    left: 5px;
    z-index: 0;
    background:
        linear-gradient(45deg, #aaa 25%, transparent 25%),
        linear-gradient(-45deg, #aaa 25%, transparent 25%),
        linear-gradient(45deg, transparent 75%, #aaa 75%),
        linear-gradient(-45deg, transparent 75%, #aaa 75%);
    background-size: 7px 7px;
    background-position: 0 0, 0 3.5px, 3.5px -3.5px, -3.5px 0px;
}
.scena-tab-grid-hex {
    width: 120px;
}
.scena-tab-color {
    position: relative;
    width: 20px;
    height: 20px;
    background-color: #fff;
    z-index: 1;
}
.scena-tab-grid-hex input {
    width: 100%;
    letter-spacing: 1px;
}
.scena-tab-grid-opacity {
    width: 60px;
    white-space: nowrap;
}
.scena-tab-grid-opacity:after {
    content: "%";
}
.scena-tab-grid-opacity input {
    display: inline-block;
    width: 55px;
}
`);



export interface ColorTabProps {
    id: string;
    property?: string;
    value?: string;
    onChnage?: (color: string) => void;
}

export default function ColorTab(props: ColorTabProps) {
    useAction("render.end");

    const actionManager = useStoreStateValue($actionManager);
    const historyManager = useStoreStateValue($historyManager);
    const layerManager = useStoreStateValue($layerManager);
    const selectedLayersStore = useStoreValue($selectedFlattenLayers);


    let color = props.value || "transparent";
    const property = props.property;

    if (property) {
        const selectedLayers = useStoreStateValue($selectedFlattenLayers);
        const selected = selectedLayers.map(layer => {
            const frame = layerManager.getFrame(layer);

            return frame;
        }).filter(Boolean) as Frame[];

        selected.some(frame => {
            const selectedColor = frame.get(property);

            if (selectedColor) {
                color = selectedColor;
            }
            return selectedColor;
        });
    }

    function setColor(color: string) {
        const selectedLayers = selectedLayersStore.value;

        if (!selectedLayers.length) {
            return;
        }
        if (!property) {
            props.onChnage?.(color);
            return;
        }
        historyManager.addHistory("render", {
            infos: selectedLayers.map(layer => {
                const frame = layerManager.getFrame(layer);
                const prev = frame.toCSSObject();

                frame.set(props.id, color);
                layer.ref.current!.style.cssText += frame.toCSSText();
                return {
                    layer,
                    prev,
                    next: frame.toCSSObject(),
                };
            }),
        });

        actionManager.act("render.end");
    }

    React.useEffect(() => {
        actionManager.act("request.color.picker.refresh", {
            id: props.id,
            color,
        });
    }, [color]);

    React.useEffect(() => {
        const onChange = (e: any) => {
            if (e.id !== props.id) {
                return;
            }
            setColor(e.color);
        };
        actionManager.on("request.color.picker.change", onChange);

        return () => {
            actionManager.off("request.color.picker.change", onChange);
        };
    }, []);

    const {
        hex,
        opacity,
    } = rgbaToHexWithOpacity(color);


    return <ColorTabElement>
        <div className={prefix("tab-grid", "tab-grid-color")} onClick={e => {
            const event = e.nativeEvent || e;

            (event as any).__STOP__COLOR_PICKER = true;
            actionManager.act("request.color.picker", {
                id: props.id,
                top: e.clientY,
                color,
            });
        }}>
            <div className={prefix("tab-color")} style={{
                backgroundColor: color || "transparent",
            }}></div>
        </div>
        <div className={prefix("tab-grid", "tab-grid-hex")}>
            <Text defaultValue={hex || "transparent"} onChangeValue={value => {
                const rgba = stringToRGBA(color);
                const nextRGBA = stringToRGBA(value);

                setColor(`rgba(${nextRGBA[0]}, ${nextRGBA[1]}, ${nextRGBA[2]}, ${rgba[3]})`);
            }} />
        </div>
        <div className={prefix("tab-grid", "tab-grid-opacity")}>
            <Text defaultValue={opacity * 100} type="number" onChangeValue={value => {
                const rgba = stringToRGBA(color);

                setColor(`rgba(${rgba[0]}, ${rgba[1]}, ${rgba[2]}, ${parseFloat(value) / 100})`);
            }} />
        </div>

    </ColorTabElement>;
}
