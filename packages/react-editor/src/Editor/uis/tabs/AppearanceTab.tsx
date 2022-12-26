
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
import { hexToRGBA } from "@daybrush/utils";

const AppearanceTabElement = styled("div", `
{
    color: #fff;
    font-size: 12px;
    padding: 8px;
    display: flex;
    align-content: center;
    align-items: stretch;
}

.scena-tab-grid {
}

.scena-tab-grid-color {
    padding: 5px;
    width: 30px;
    height: 30px;
    box-sizing: border-box;
}
.scena-tab-grid-hex {
    width: 70px;
}
.scena-tab-color {
    width: 20px;
    height: 20px;
    background: #fff;
}
.scena-tab-grid-hex input {
    width: 100%;
    letter-spacing: 1px;
}
.scena-tab-grid-opacity {
    width: 65px;
    white-space: nowrap;
}
.scena-tab-grid-opacity:after {
    content: "%";
}
.scena-tab-grid-opacity input {
    display: inline-block;
    width: 40px;
}
`);




export default function AppearanceTab() {
    useAction("render.end");

    const actionManager = useStoreStateValue($actionManager);
    const historyManager = useStoreStateValue($historyManager);
    const layerManager = useStoreStateValue($layerManager);
    const selectedLayers = useStoreStateValue($selectedFlattenLayers);
    const selectedLayersStore = useStoreValue($selectedFlattenLayers);


    console.log(selectedLayers);
    const selected = selectedLayers.map(layer => {
        const frame = layerManager.getFrame(layer);

        return frame;
    }).filter(Boolean) as Frame[];


    let color = "transparent";
    selected.some(frame => {
        const selectedColor = frame.get("background-color");

        if (selectedColor) {
            color = selectedColor;
        }
        return selectedColor;
    });

    React.useEffect(() => {
        actionManager.act("request.color.picker.refresh", {
            id: "fill",
            color,
        });
    }, [color]);


    React.useEffect(() => {
        const onChange = (e: any) => {
            if (e.id !== "fill") {
                return;
            }
            const selectedLayers = selectedLayersStore.value;

            if (!selectedLayers.length) {
                return;
            }
            historyManager.addHistory("render", {
                infos: selectedLayers.map(layer => {
                    const frame = layerManager.getFrame(layer);
                    const prev = frame.toCSSObject();

                    frame.set("background-color", e.color);
                    layer.ref.current!.style.cssText += frame.toCSSText();
                    return {
                        layer,
                        prev,
                        next: frame.toCSSObject(),
                    };
                }),
            });

            actionManager.act("render.end");
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


    return <AppearanceTabElement>
        <div className={prefix("tab-grid", "tab-grid-color")} onClick={e => {
            const event = e.nativeEvent || e;

            (event as any).__STOP__COLOR_PICKER = true;
            actionManager.act("request.color.picker", {
                id: "fill",
                top: e.clientY,
                color,
            });
        }}>
            <div className={prefix("tab-color")} style={{
                backgroundColor: hex || "transparent",
            }}></div>
        </div>
        <div className={prefix("tab-grid", "tab-grid-hex")}>
            <Text defaultValue={hex || "transparent"} />
        </div>
        <div className={prefix("tab-grid", "tab-grid-opacity")}>
            <Text defaultValue={opacity * 100} type="number" />
        </div>

    </AppearanceTabElement>;
}
