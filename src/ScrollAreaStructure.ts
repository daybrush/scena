import { getKeyframesAreaStructure, getKeyframesListStructure } from "./KeyframesStructure";
import { ElementStructure } from "./types";
import { getPropertiesStructure } from "./PropertiesStructure";
import { getValuesStructure } from "./ValuesStructure";

export function getScrollAreaStructure(timelineInfo, maxDuration: number, maxTime: number) {
    const properties: ElementStructure[] = getPropertiesStructure(timelineInfo);
    const values: ElementStructure[] = getValuesStructure(timelineInfo);
    const keyframesList: ElementStructure[] = getKeyframesListStructure(timelineInfo, maxTime);
    return {
        id: "scrollArea",
        selector: ".scroll_area",
        children: [
            {
                id: "propertiesAreas[]",
                selector: ".properties_area",
                children: [
                    {
                        selector: ".properties_scroll_area",
                        children: properties,
                    },
                ],
            },
            {
                id: "valuesArea",
                selector: ".values_area",
                children: values,
            },
            getKeyframesAreaStructure(keyframesList, maxDuration, maxTime),
        ],
    };
}
