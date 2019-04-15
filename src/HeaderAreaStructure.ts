import { getKeytimesStructure } from "./KeytimesStructure";
import { Ids, ElementStructure } from "./types";

export function getHeaderAreaStructure(ids: Ids, zoom: number, maxDuration: number, maxTime: number): ElementStructure {
    return {
        selector: ".header_area",
        ref: e => {
            ids.keyframesScrollAreas = [];
            ids.keyframesAreas = [];
            ids.propertiesAreas = [];
        },
        children: [
            {
                ref: (e: ElementStructure) => {
                    ids.propertiesAreas[0] = e;
                },
                selector: ".properties_area",
                children: [
                    {
                        selector: ".property",
                        html: "Name",
                    },
                ],
            },
            {
                selector: ".values_area",
                children: {
                    selector: ".value",
                    html: "+",
                },
            },
            getKeytimesAreaStructure(ids, zoom, maxDuration, maxTime),
        ],
    };
}

export function getKeytimesAreaStructure(
    ids: Ids,
    zoom: number,
    maxDuration: number,
    maxTime: number,
): ElementStructure {
    return {
        ref: e => {
            ids.keyframesAreas[0] = e;
        },
        selector: ".keyframes_area",
        children: {
            style: {
                minWidth: `${50 * maxTime}px`,
                width: `${Math.min(maxDuration ? maxTime / maxDuration : 1, 2) * zoom * 100}%`,
            },
            dataset: {
                width: Math.min(maxDuration ? maxTime / maxDuration : 1, 2),
            },
            ref: (e: ElementStructure) => {
                ids.keyframesScrollAreas[0] = e;
            },
            selector: ".keyframes_scroll_area",
            children: {
                ref: e => {
                    ids.cursors = [];
                },
                selector: ".keyframes",
                children: [
                    {
                        ref: e => {
                            ids.keytimesContainer = e;
                        },
                        selector: ".keyframes_container",
                        children: getKeytimesStructure(maxTime),
                    },
                    {
                        selector: ".keyframe_cursor",
                        ref: e => {
                            ids.cursors[0] = e;
                        },
                    },
                ],
            },
        },
    };
}
