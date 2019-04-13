import { getKeytimesStructure } from "./KeytimesStructure";

export function getHeaderAreaStructure(maxDuration: number, maxTime: number) {
    return {
        selector: ".header_area",
        children: [
            {
                id: [
                    "propertiesAreas[]",
                ],
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
            {
                id: "keyframesAreas[]",
                selector: ".keyframes_area",
                children: {
                    style: {
                        minWidth: `${50 * maxTime}px`,
                        width: `${(maxDuration ? maxTime / maxDuration : 1) * 100}%`,
                    },
                    id: "keyframesScrollAreas[]",
                    selector: ".keyframes_scroll_area",
                    children: {
                        selector: ".keyframes",
                        children: [
                            {
                                id: "keytimesContainer",
                                selector: ".keyframes_container",
                                children: getKeytimesStructure(maxTime),
                            },
                            {
                                selector: ".keyframe_cursor",
                                id: "cursors[]",
                            },
                        ],
                    },
                },
            },
        ],
    };
}
