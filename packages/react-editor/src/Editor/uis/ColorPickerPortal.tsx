import { useStoreStateValue } from "@scena/react-store";
import * as React from "react";
import { ChromePicker, ColorResult, RGBColor } from "react-color";
import styled, { StyledElement } from "react-css-styled";
import { createPortal } from "react-dom";
import { $actionManager, $editor } from "../stores/stores";

const ColorPickerElement = styled("div", `
{
    position: fixed;
    right: var(--scena-editor-size-tabs);
    z-index: 10;
    transform: translateZ(100px);
    user-select: none;
}
`);

export default function ColorPickerPortal() {
    const editorRef = useStoreStateValue($editor);
    const actionManager = useStoreStateValue($actionManager);
    const elementRef = React.useRef<StyledElement<HTMLDivElement>>(null);
    const [portal, setPortal] = React.useState<HTMLDivElement>();
    const [color, setColor] = React.useState<string | RGBColor>("#ffffff");
    const [id, setId] = React.useState("");

    React.useEffect(() => {
        setPortal(editorRef.current!.editorElementRef.current!.getElement()!);

        const onClick = (e: any) => {
            if (e.__STOP__COLOR_PICKER) {
                return;
            }
            const element = elementRef.current!.getElement();

            element.style.cssText += `display: none;`;
        };
        window.addEventListener("click", onClick);
        let currentId = "";
        actionManager.on("request.color.picker", ({
            id,
            top,
            color,
        }) => {
            const element = elementRef.current!.getElement();
            const height = 240;
            const y = Math.max(0, top - height / 2);

            element.style.cssText += `display: block; top: ${y}px`;
            currentId = id;
            setColor(color);
            setId(id);
        });
        actionManager.on("request.color.picker.change", ({
            id,
            color,
        }) => {
            if (currentId === id) {
                setColor(color);
            }
        });


        return () => {
            window.removeEventListener("click", onClick);
            actionManager.off("request.color.picker");
            actionManager.off("request.color.picker.change");
        };
    }, []);
    return portal ? createPortal(
        <ColorPickerElement ref={elementRef} onClick={(e: any) => {
            const event = e.nativeEvent || e;

            event.__STOP__COLOR_PICKER = true;
        }} style={{
            display: "none",
        }}>
            <ChromePicker
                color={color}
                onChange={e => {
                    setColor(e.rgb);
                }}
                onChangeComplete={e => {
                    const rgb = e.rgb;
                    actionManager.act("request.color.picker.change", {
                        id,
                        color: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${rgb.a ?? 1})`,
                    });
                }}
            />
        </ColorPickerElement>,
        portal,
    ) : null;
}
