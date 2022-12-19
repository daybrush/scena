import Psd, { NodeChild } from "@webtoon/psd";
import { GroupFrame } from "@webtoon/psd/dist/sections";
import React from "react";
import { SceneItem } from "scenejs";
import { ScenaElementLayer, ScenaElementLayerGroup } from "../types";
import { compositeSVG } from "./files/psd";
import { createGroup, createLayer } from "./LayerManager";

export interface ReadFileResult {
    layers?: ScenaElementLayer[];
    groups?: ScenaElementLayerGroup[];
}
export interface CanvasProps {
    width: number;
    height: number;
    data: Uint8ClampedArray;
}

// export const Path = React.forwardRef<HTMLCanvasElement, CanvasProps>((props, ref) => {
//     const canvasRef = React.useRef<HTMLCanvasElement>(null);

//     React.useImperativeHandle(ref, () => canvasRef.current!, []);
//     React.useEffect(() => {
//         const canvasElement = canvasRef.current!;
//         const context = canvasElement.getContext("2d") as CanvasRenderingContext2D;

//         const { width, height, data: rgba } = props;
//         const imageData = context.createImageData(width, height);

//         canvasElement.width = width;
//         canvasElement.height = height;
//         imageData.data.set(rgba);
//         context.putImageData(imageData, 0, 0);
//     }, []);

//     return <canvas ref={canvasRef} width={props.width} height={props.height} />;
// });

export const Canvas = React.forwardRef<HTMLCanvasElement, CanvasProps>((props, ref) => {
    const canvasRef = React.useRef<HTMLCanvasElement>(null);

    React.useImperativeHandle(ref, () => canvasRef.current!, []);
    React.useEffect(() => {
        const canvasElement = canvasRef.current!;
        const context = canvasElement.getContext("2d") as CanvasRenderingContext2D;

        const { width, height, data: rgba } = props;
        const imageData = context.createImageData(width, height);

        canvasElement.width = width;
        canvasElement.height = height;
        imageData.data.set(rgba);
        context.putImageData(imageData, 0, 0);
    }, []);

    return <canvas ref={canvasRef} width={props.width} height={props.height} />;
});
Canvas.displayName = "Canvas";
export async function readFiles(files?: FileList): Promise<ReadFileResult> {
    if (!files?.length) {
        return {};
    }
    const item = files.item(0)!;
    const buffer = await item.arrayBuffer();

    const psd = Psd.parse(buffer);
    // const { widthUnit, heightUnit } = resolutionInfo;
    const widthUnit = 1;
    const heightUnit = 1;
    const layers: ScenaElementLayer[] = [];
    const groups: ScenaElementLayerGroup[] = [];
    const psdGroup = createGroup({
        title: "(PSD)",
    });

    groups.push(psdGroup);

    console.log(psd);
    function traverseChildren(children: NodeChild[], scope: string[]): Promise<any> {
        return Promise.all([...children].reverse().map(child => {
            if (child.type === "Layer") {
                const childWidth = child.width * widthUnit;
                const childHeight = child.height * heightUnit;
                const item = new SceneItem({
                    0: {
                        position: "absolute",
                        left: `0px`,
                        top: `0px`,
                        transform: `translate(${child.left * widthUnit}px, ${child.top * heightUnit}px)`,
                        width: `${childWidth}px`,
                        height: `${childHeight}px`,
                        display: child.isHidden ? "none" : "block",
                        opacity: child.opacity / 255,
                    },
                });
                const svg = compositeSVG(child, psd);

                if (svg) {
                    layers.push(createLayer({
                        title: child.name || "(SVG)",
                        scope: [...scope],
                        item,
                        jsx: <svg viewBox={`0 0 ${childWidth} ${childHeight}`}>
                            <path d={svg.d} style={svg.style} />
                        </svg>,
                    }));
                    return;
                }
                return child.composite(true, true).then(pixelData => {
                    layers.push(createLayer({
                        title: child.name,
                        scope: [...scope],
                        item,
                        jsx: <Canvas
                            width={child.width}
                            height={child.height}
                            data={pixelData} />,
                    }));
                });
            } else {
                const group = createGroup({
                    title: child.name,
                    scope: [...scope],
                    opacity: child.opacity / 255,
                    display: ((child as any).layerFrame as GroupFrame).layerProperties.hidden ? "none" : "block",
                });

                groups.push(group);
                return traverseChildren(child.children, [...group.scope, group.id]);
            }
        }));
    }

    await traverseChildren(psd.children, [psdGroup.id]);
    return {
        layers,
        groups,
    };
}
