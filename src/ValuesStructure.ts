import { isObject } from "@daybrush/utils";

export function getValuesStructure(timelineInfo) {
    const values = [];

    for (const property in timelineInfo) {
        const times = timelineInfo[property];
        const isHasObject = times[0] && isObject(times[0][1]);
        values.push({
            id: "values[]",
            selector: ".value",
            dataset: {
                property,
                object: isHasObject ? "1" : "0",
            },
            children: {
                id: "inputs[]",
                selector: "input",
                attr: {
                    value: times[0] ? times[0][1] : "",
                },
            },
        });
    }
    return values;
}
