import React from "react";
import { ScenaElementLayer, ScenaElementLayerGroup } from "../types";
import { readPSDFile } from "./files/psd";

export interface ReadFileResult {
    layers?: ScenaElementLayer[];
    groups?: ScenaElementLayerGroup[];
}


export async function readFiles(e: DragEvent, offsetPosition: number[]): Promise<ReadFileResult> {
    const files = e.dataTransfer?.files;

    if (!files?.length) {
        return {};
    }
    const item = files.item(0)!;
    const type = item.type;

    if (type === "image/svg+xml") {
        // SVG
    } else if (type === "image/vnd.adobe.photoshop") {
        // PSD
        return readPSDFile(item, offsetPosition);
    }

    // console.log(item);

    return {};
}
