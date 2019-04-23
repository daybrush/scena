import { ElementStructure, Ids, TimelineInfo } from "./types";

export function getPropertiesStructure(ids: Ids, timelineInfo: TimelineInfo) {
    const properties: ElementStructure[] = [];

    for (const key in timelineInfo) {
        const propertiesInfo = timelineInfo[key];
        const propertyNames = key.split("///");
        const length = propertyNames.length;
        const id = propertyNames[length - 1];

        properties.push({
            ref: (e, i) => {
                ids.properties[i] = e;
            },
            key,
            selector: ".property",
            dataset: {
                key,
                object: propertiesInfo.isParent ? "1" : "0",
                item: propertiesInfo.isItem ? "1" : "0",
            },
            datas: propertiesInfo,
            style: {
                paddingLeft: `${10 + (length - 1) * 20}px`,
            },
            children: [
                { selector: ".arrow" },
                {
                    selector: "span",
                    html: id,
                },
                { selector: ".remove" },
            ],
        });
    }
    return properties;
}
