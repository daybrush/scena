import { isObject } from "@daybrush/utils";
import { Ids, ElementStructure } from "./types";

export function getValuesStructure(ids: Ids, timelineInfo): ElementStructure[] {
    const values: ElementStructure[] = [];

    for (const property in timelineInfo) {
        const times = timelineInfo[property];
        const isHasObject = times[0] && isObject(times[0][1]);
        values.push({
            ref: (e, i) => {
                ids.values[i] = e;
            },
            key: property,
            selector: ".value",
            dataset: {
                property,
                object: isHasObject ? "1" : "0",
            },
            children: {
                selector: "input",
                attr: {
                    value: times[0] ? times[0][1] : "",
                },
            },
        });
    }
    return values;
}
