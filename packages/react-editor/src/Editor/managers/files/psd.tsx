import * as React from "react";
import { isNumber, splitUnit } from "@daybrush/utils";
import Psd, { Layer, NodeChild } from "@webtoon/psd";
import {
    VectorStrokeDataAliBlock,
    VectorMaskSettingAliBlock, Point, DoubleDescriptorValue,
    DescriptorValue, VectorStrokeContentDataAliBlock,
    Descriptor, SolidColorSheetSettingAliBlock, TypeToolObjectSettingAliBlock,
} from "@webtoon/psd/dist/interfaces";
import { AdditionalLayerProperties, GroupFrame } from "@webtoon/psd/dist/sections";
import { width, height } from "@webtoon/psd/dist/utils";
import { SceneItem } from "scenejs";
import { Canvas } from "../../defaultComponents/Canvas";
import { ScenaElementLayer, ScenaElementLayerGroup } from "../../types";
import { getPureValue } from "../../utils/utils";
import { createGroup, createLayer } from "../LayerManager";
import { SVGText } from "../../defaultComponents/svg";


function getDescriptorUnitValue(dpi: number, value?: DescriptorValue): string | number | null {
    if (value?.type === "UntF") {
        const unitType = value.unitType;

        if (unitType === "#Pnt") {
            return `${value.value / 72 * dpi}px`;
        } else if (unitType === "#Pxl") {
            return `${value.value}px`;
        }
        return value.value;
    }
    return null;
}
function getDescriptorArrayValue(dpi: number, value?: DescriptorValue): Array<number | string> | null {
    if (value?.type === "VlLs") {
        return value.values.map(v => {
            return getDescriptorUnitValue(dpi, v)!;
        });
    }

    return null;
}
function getDescriptorColorValue(descriptor?: Descriptor | DescriptorValue): number[] | null {
    if (!descriptor) {
        return null;
    }
    if (("type" in descriptor)) {
        const value = descriptor;

        if (value.type === "Objc") {
            return getDescriptorColorValue(value.descriptor);
        }
    } else {
        const items = descriptor.items;

        if (descriptor.classId === "RGBC") {
            const r = items.get("Rd  ") as DoubleDescriptorValue;
            const g = items.get("Grn ") as DoubleDescriptorValue;
            const b = items.get("Bl  ") as DoubleDescriptorValue;

            return [r.value, g.value, b.value];
        }
        const clr = items.get("Clr ")!;

        if (clr) {
            return getDescriptorColorValue(clr);
        }
    }
    return null;
}


export function compositeSVG(layer: Layer, psd: Psd): Record<string, any> | null {
    const composites = [
        () => compositePath(layer, psd),
        () => compositeText(layer, psd),
    ];
    let result: Record<string, any> | null = null;

    composites.some(composite => {
        result = composite();

        return result;
    });

    return result;
}




export function compositePath(layer: Layer, psd: Psd) {
    const dpi = psd.resolutionInfo?.horizontal ?? 72;
    const psdWidth = psd.width;
    const psdHeight = psd.height;
    const left = layer.left;
    const top = layer.top;

    function getRelativePosition(pos: { horiz: number, vert: number }) {
        return [
            pos.horiz * psdWidth - left,
            pos.vert * psdHeight - top,
        ].join(" ");
    }
    // background-color: vscg
    // stroke-color: vstk
    // path: vsms, vmsk
    const additionalProperties = layer.additionalProperties;
    const pathProperty = additionalProperties.find(({ key }) => {
        return key === "vmsk" || key === "vsms";
    }) as VectorMaskSettingAliBlock;

    if (!pathProperty) {
        return null;
    }
    interface PathRecord {
        preceding: Point;
        anchor: Point;
        leaving: Point;
    }

    const ds: string[] = [];
    const style: Record<string, any> = {};
    const pathRecords = pathProperty.pathRecords;

    pathRecords.forEach((record, i) => {
        if (record.type === 0) {
            const length = record.length;
            const subRecords = pathRecords.slice(i + 1, i + 1 + length) as PathRecord[];

            ds.push(subRecords.map((subRecord, j) => {
                const nextRecord = subRecords[j + 1] || subRecords[0];

                return `${j ? "L" : "M"} ${getRelativePosition(subRecord.anchor)} `
                    + `C ${getRelativePosition(subRecord.leaving)} `
                    + `${getRelativePosition(nextRecord.preceding)} `
                    + `${getRelativePosition(nextRecord.anchor)} `;
            }).join(" "));
        }
    });

    const layerFXProperty = additionalProperties.find(({ key }) => {
        return key === "lrFX";
    });

    if (layerFXProperty?._isUnknown) {
        parseLayerFX(layerFXProperty.data);
    } else {
        // Support Layer FX?
    }
    const strokeProperty = additionalProperties.find(({ key }) => {
        return key === "vstk";
    }) as VectorStrokeDataAliBlock;
    const fillProperty1 = additionalProperties.find(({ key }) => {
        return key === "vscg";
    }) as VectorStrokeContentDataAliBlock;
    const fillProperty2 = additionalProperties.find(({ key }) => {
        return key === "SoCo";
    }) as SolidColorSheetSettingAliBlock;

    if (strokeProperty) {
        const items = strokeProperty.data.descriptor.items;

        // type UntF = Unit Float
        // UnitType #Pnt = point
        const strokeWidth = getDescriptorUnitValue(dpi, items.get("strokeStyleLineWidth"));

        if (strokeWidth != null) {
            style.strokeWidth = strokeWidth;
        }
        const strokeColor = getDescriptorColorValue(items.get("strokeStyleContent"));

        if (strokeColor) {
            style.stroke = `rgb(${strokeColor.map(v => Math.floor(v)).join(",")})`;
        }

        const strokeDasharray = getDescriptorArrayValue(dpi, items.get("strokeStyleLineDashSet"));

        if (strokeDasharray) {
            const strokeWidthInfo = splitUnit(style.strokeWidth || "0px");

            // 24pt === 100px
            // 1pt === 100 / 2.4pt
            style.strokeDasharray = strokeDasharray.map(d => {
                return isNumber(d) ? `${strokeWidthInfo.value * d}${strokeWidthInfo.unit}` : d;
            }).join(" ");
        }
    }

    const fillColor
        = (fillProperty1 && getDescriptorColorValue(fillProperty1.data.descriptor))
        || (fillProperty2 && getDescriptorColorValue(fillProperty2.data));

    if (fillColor) {
        style.fill = `rgb(${fillColor.map(v => Math.floor(v)).join(",")})`;
    }

    const nextObj: Record<string, any> = {
        d: ds.join(" "),
        style,
    };

    return nextObj;
}


export function compositeText(layer: Layer, psd: Psd) {
    interface EngineData {
        DocumentResources: {
            FontSet: Array<{
                Name: string;
            }>;
            ParagraphSheetSet: Array<{
                Properties: {
                    AutoLeading: number;
                };
            }>;
            StyleSheetSet: Array<{
                StyleSheetData: {
                    // Default
                    FontSize: number;
                    Leeding: number;
                    StyleRunAlignment: number;
                };
            }>;
        };
        EngineDict: {
            StyleRun: {
                RunArray: Array<{
                    StyleSheet: {
                        StyleSheetData: {
                            FillColor?: {
                                Values: number[];
                            };
                            FontCaps?: number;
                            FontSize?: number;
                            Leeding?: number;
                            Ligatures?: boolean;
                        };
                    };
                }>;
            };
        };
    }

    const dpi = psd.resolutionInfo?.horizontal ?? 72;
    const textProperties = layer.textProperties as EngineData | undefined;

    if (!textProperties) {
        return null;
    }

    const style: Record<string, any> = {};
    const nextObj: Record<string, any> = {
        text: layer.text,
        style,
    };


    // TySh type tool info
    const typeToolInfo = layer.additionalProperties.find(({ key }) => {
        return key === "TySh";
    }) as TypeToolObjectSettingAliBlock;
    let sx = 1;
    let sy = 1;
    let tx = 0;
    let ty = 0;
    let width = 0;
    let height = 0;


    if (typeToolInfo) {
        sx = typeToolInfo.transformXX;
        sy = typeToolInfo.transformYY;
        tx = typeToolInfo.transformTX;
        ty = typeToolInfo.transformTY;

        const bounds = typeToolInfo.textData.descriptor.items.get("bounds");



        if (bounds?.type === "Objc") {
            const items = bounds.descriptor.items;
            const top = getPureValue(getDescriptorUnitValue(dpi, items.get("Top ")));
            const left = getPureValue(getDescriptorUnitValue(dpi, items.get("Left")));
            const right = getPureValue(getDescriptorUnitValue(dpi, items.get("Rght")));
            const bottom = getPureValue(getDescriptorUnitValue(dpi, items.get("Btom")));

            ty += top * sy;
            tx += left * sx;
            width = (right - left) * sx;
            height = (bottom - top) * sy;
        }
    }
    const data = textProperties.EngineDict.StyleRun.RunArray[0].StyleSheet.StyleSheetData;
    const {
        FillColor,
        FontSize,
        Leeding,
        FontCaps,
        Ligatures,
    } = data;


    if (FillColor) {
        const [a, r, g, b] = FillColor.Values;

        style.color = `rgba(${Math.floor(r * 255)}, ${Math.floor(g * 255)}, ${Math.floor(b * 255)}, ${a})`;
    }

    if (Ligatures) {
        style.fontVariantLigatures = "normal";
    }

    if (FontCaps === 1) {
        style.fontVariantCaps = "small-caps";
    }

    if (FontSize != null) {
        style.fontSize = FontSize * dpi / 72;
    } else {
        style.fontSize = textProperties.DocumentResources.StyleSheetSet[0].StyleSheetData.FontSize;
    }


    if (Leeding != null) {
        style.lineHeight = `${Leeding}px`;
    } else {
        const autoLeading = textProperties.DocumentResources.ParagraphSheetSet[0].Properties.AutoLeading;

        if (autoLeading) {
            style.lineHeight = autoLeading;
        }
    }
    const StyleRunAlignment = textProperties.DocumentResources.StyleSheetSet[0].StyleSheetData.StyleRunAlignment;

    if (StyleRunAlignment === 2) {
        style.textAlign = "center";
    }
    nextObj.width = width;
    nextObj.height = height;
    nextObj.tx = tx;
    nextObj.ty = ty;
    style.fontSize = `${style.fontSize * sy}px`;




    return nextObj;
}


export async function readPSDFile(file: File, offsetPosition: number[]) {
    const buffer = await file.arrayBuffer();

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


    const psdWidth = psd.width;
    const psdHeight = psd.height;
    const baseLeft = offsetPosition[0] - psdWidth / 2;
    const baseTop = offsetPosition[1] - psdHeight / 2;

    function traverseChildren(children: NodeChild[], scope: string[]): Promise<any> {
        return [...children].reverse().reduce(async (prev, child) => {
            await prev;
            if (child.type === "Layer") {
                const childWidth = child.width * widthUnit;
                const childHeight = child.height * heightUnit;
                const item = new SceneItem({
                    0: {
                        position: "absolute",
                        left: `0px`,
                        top: `0px`,
                        transform: `translate(${baseLeft + child.left * widthUnit}px, ${baseTop + child.top * heightUnit}px)`,
                        width: `${childWidth}px`,
                        height: `${childHeight}px`,
                        display: child.isHidden ? "none" : "block",
                        opacity: child.opacity / 255,
                    },
                });
                // const svg = compositeSVG(child, psd);

                // if (svg) {
                //     if ("d" in svg) {
                //         layers.push(createLayer({
                //             title: child.name || child.text || "(SVG)",
                //             scope: [...scope],
                //             item,
                //             jsx: <svg viewBox={`0 0 ${childWidth} ${childHeight}`}>
                //                 <path d={svg.d} style={svg.style} />
                //             </svg>,
                //         }));
                //         return;
                //     } else if ("text" in svg) {
                //         // console.log(svg);
                //         // if (svg.width || svg.height) {
                //         //     childWidth = svg.width;
                //         //     childHeight = svg.height;
                //         //     item.set(0, "transform", `translate(${svg.tx}px, ${svg.ty}px)`);
                //         //     item.set(0, "width", `${childWidth}px`);
                //         //     item.set(0, "height", `${childHeight}px`);
                //         // }
                //         // layers.push(createLayer({
                //         //     title: child.name || child.text || "(SVG)",
                //         //     scope: [...scope],
                //         //     item,
                //         //     jsx: <SVGText
                //         //         text={svg.text}
                //         //         width={childWidth}
                //         //         height={childHeight}
                //         //         style={svg.style}
                //         //     />,
                //         // }));
                //     }
                // }
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
                await traverseChildren(child.children, [...group.scope, group.id]);
            }
        }, Promise.resolve());
    }

    await traverseChildren(psd.children, [psdGroup.id]);
    return {
        layers,
        groups,
    };
}

export function toInteger(data: Uint8Array) {
    return data.reduce((prev, v) => {
        return prev * 256 + v;
    }, 0);
}

export function parseLayerFX(data: Uint8Array) {
    // https://www.adobe.com/devnet-apps/photoshop/fileformatashtml/#50577409_22203
    const decoder = new TextDecoder("utf-8");

    const length = data.length;
    let cursor = 4;

    while (cursor < length) {
        // 8BIM (cursor, cursor + 4)
        // cmnS, dsdw, isdw, oglw, iglw, bevl, sofi
        const effect = decoder.decode(data.slice(cursor + 4, cursor + 8));

        if (!effect) {
            break;
        }
        cursor += 8;
        const size = toInteger(data.slice(cursor, cursor + 4));

        // Drop Shadw, outer shadow
        if (effect === "dsdw") {
            console.log(size, data.slice(cursor + 4, cursor + 4 + size));
            const blur = toInteger(data.slice(cursor + 8, cursor + 12)) / (2 ** 16);
            const intensity = toInteger(data.slice(cursor + 12, cursor + 16)) / (2 ** 16);
            const angle = toInteger(data.slice(cursor + 16, cursor + 20)) / (2 ** 16);
            const distance = toInteger(data.slice(cursor + 20, cursor + 24)) / (2 ** 16);
            const color = [
                toInteger(data.slice(cursor + 24, cursor + 26)),
                toInteger(data.slice(cursor + 26, cursor + 28)),
                toInteger(data.slice(cursor + 28, cursor + 30)),
                toInteger(data.slice(cursor + 30, cursor + 32)),
                toInteger(data.slice(cursor + 32, cursor + 34)),
            ];
            const blendSignature = decoder.decode(data.slice(cursor + 34, cursor + 38));
            const blendKey = decoder.decode(data.slice(cursor + 38, cursor + 42));
            const endabled = data[cursor + 42];
            // cursor + 33 (Use this angle in all of the layer effects)
            // opacity
            const opacity = data[cursor + 44] / 256;

            console.log(
                "blur", blur,
                "intensity", intensity,
                "angle", angle,
                "dist", distance,
                "color", color,
                "bs", blendSignature,
                "bk", blendKey,
                "enabled", endabled,
                "op", opacity,
            );
        }
        cursor += 4 + size;
    }
}
