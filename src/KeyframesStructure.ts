import { toValue, applyStyle } from "./utils";
import { ElementStructure, Ids, TimelineInfo, PropertiesInfo } from "./types";
import { getLinesStructure } from "./KeytimesStructure";

export function updateKeyframesStructure(keyframes: ElementStructure[], maxTime: number) {
    keyframes.forEach(keyframe => {
        const {selector, dataset, style, element} = keyframe;
        if (selector === ".keyframe") {
            style.left = `${dataset.time / maxTime * 100}%`;
        } else {
            style.left = `${dataset.from / maxTime * 100}%`,
            style.width = `${(dataset.to - dataset.from) / maxTime * 100}%`;
        }
        applyStyle(element, style);
    });
}

export function getKeyframesAreaStructure(
    ids: Ids,
    keyframesList: ElementStructure[],
    zoom: number,
    maxDuration: number,
    maxTime: number,
): ElementStructure {
    const width = Math.min(maxDuration ? maxTime / maxDuration : 1, 2);
    return {
        ref: e => {
            ids.keyframesAreas[1] = e;
        },
        selector: ".keyframes_area",
        children: {
            style: {
                minWidth: `${50 * maxTime}px`,
                width: `${width * zoom * 100}%`,
            },
            dataset: {
                width,
            },
            ref: e => {
                ids.keyframesScrollAreas[1] = e;
            },
            selector: ".keyframes_scroll_area",
            children: getKeyframesScrollAreaChildrenStructure(ids, keyframesList, maxTime),
        },
    };
}
export function getKeyframesScrollAreaChildrenStructure(
    ids: Ids,
    keyframesList: ElementStructure[],
    maxTime: number,
): ElementStructure[] {
    return [
        ...keyframesList,
        {
            key: "cursor",
            selector: ".keyframe_cursor",
            ref: e => {
                ids.cursors[1] = e;
            },
        },
        {
            key: "lineArea",
            ref: e => {
                ids.lineArea = e;
            },
            selector: ".line_area",
            children: getLinesStructure(maxTime),
        },
    ];
}
export function getKeyframesListStructure(
    ids: Ids,
    timelineInfo: TimelineInfo,
    maxTime: number,
): ElementStructure[] {
    const keyframesList: ElementStructure[] = [];

    for (const key in timelineInfo) {
        const propertiesInfo = timelineInfo[key];
        const keyframes = getKeyframesStructure(propertiesInfo, maxTime);

        keyframesList.push({
            ref: (e, i) => {
                ids.keyframesList[i] = e;
                ids.keyframesContainers[i] = e.children as ElementStructure;
            },
            selector: ".keyframes",
            key,
            dataset: {
                key,
            },
            datas: propertiesInfo,
            children: {
                selector: ".keyframes_container",
                children: keyframes,
            },
        });
    }
    return keyframesList;
}
export function getKeyframesStructure(
    propertiesInfo: PropertiesInfo,
    maxTime: number,
): ElementStructure[] {
    const keyframeLines: ElementStructure[] = [];
    const frames = propertiesInfo.frames;
    const keyframes: ElementStructure[] = frames.map(([time, value], i): ElementStructure => {
        const valueText = toValue(value);

        if (frames[i + 1]) {
            const [nextTime, nextValue] = frames[i + 1];
            const nextValueText = toValue(nextValue);

            if (valueText !== nextValueText) {
                keyframeLines.push({
                    selector: ".keyframe_line",
                    key: `${time},${nextTime}`,
                    dataset: {
                        time: `${time},${nextTime}`,
                        from: time,
                        to: nextTime,
                    },
                    style: {
                        left: `${time / maxTime * 100}%`,
                        width: `${(nextTime - time) / maxTime * 100}%`,
                    },
                });
            }
        }

        return {
            key: time,
            selector: ".keyframe",
            dataset: {
                time,
                value: valueText,
            },
            style: {
                left: `${time / maxTime * 100}%`,
            },
            html: `${time} ${valueText}`,
        };
    });

    return [...keyframes, ...keyframeLines];
}
