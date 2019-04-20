import { getKeyframesAreaStructure, getKeyframesListStructure } from "./KeyframesStructure";
import { ElementStructure, Ids, TimelineInfo } from "./types";
import { getPropertiesStructure } from "./PropertiesStructure";
import { getValuesStructure } from "./ValuesStructure";

export function getScrollAreaStructure(
    ids: Ids,
    timelineInfo: TimelineInfo,
    zoom: number,
    maxDuration: number,
    maxTime: number,
): ElementStructure {
    const keyframesList: ElementStructure[] = getKeyframesListStructure(ids, timelineInfo, maxTime);

    return {
        ref: e => {
            ids.scrollArea = e;
            ids.keyframesList = [];
            ids.keyframesContainers = [];
        },
        selector: ".scroll_area",
        children: [
            {
                ref: e => {
                    ids.propertiesAreas[1] = e;
                    ids.properties = [];
                },
                selector: ".properties_area",
                children: [
                    {
                        selector: ".properties_scroll_area",
                        children: getPropertiesStructure(ids, timelineInfo),
                    },
                ],
            },
            {
                ref: e => {
                    ids.valuesArea = e;
                    ids.values = [];
                },
                selector: ".values_area",
                children: getValuesStructure(ids, timelineInfo),
            },
            getKeyframesAreaStructure(ids, keyframesList, zoom, maxDuration, maxTime),
        ],
    };
}
