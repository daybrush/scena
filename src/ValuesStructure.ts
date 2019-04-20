import { isObject } from "@daybrush/utils";
import { Ids, ElementStructure, TimelineInfo } from "./types";

export function getValuesStructure(ids: Ids, timelineInfo: TimelineInfo): ElementStructure[] {
    const values: ElementStructure[] = [];

    for (const key in timelineInfo) {
        const propertiesInfo = timelineInfo[key];
        const frames = propertiesInfo.frames;
        values.push({
            ref: (e, i) => {
                ids.values[i] = e;
            },
            key,
            selector: ".value",
            dataset: {
                key,
                object: propertiesInfo.isParent ? "1" : "0",
            },
            datas: propertiesInfo,
            children: {
                selector: "input",
                attr: {
                    value: frames[0] ? frames[0][1] : "",
                },
            },
        });
    }
    return values;
}
