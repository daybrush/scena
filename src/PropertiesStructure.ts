import { ElementStructure } from "./types";

export function getPropertiesStructure(timelineInfo) {
    const properties: ElementStructure[] = [];

    for (const property in timelineInfo) {
        const propertyNames = property.split("///");
        const length = propertyNames.length;
        const id = propertyNames[length - 1];

        properties.push({
            id: "properties[]",
            selector: ".property",
            dataset: {
                id,
                property,
                parent: propertyNames[length - 2] || "",
                object: "0",
                item: propertyNames[0],
            },
            style: {
                paddingLeft: `${10 + (length - 1) * 20}px`,
            },
            children: [
                { selector: ".arrow"},
                {
                    selector: "span",
                    html: id,
                },
            ],
        });
        const parentProperty = propertyNames.slice(0, -1).join("///");
        properties.forEach(({dataset}) => {
            if (dataset.property === parentProperty) {
                dataset.object = "1";
            }
        });
    }
    return properties;
}
