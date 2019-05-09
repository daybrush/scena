import { toValue, applyStyle, isSceneItem, isScene } from "./utils";
import { ElementStructure, Ids, TimelineInfo, PropertiesInfo } from "./types";
import { getLinesStructure } from "./KeytimesStructure";
import { isUndefined } from "@daybrush/utils";

export function updateKeyframesStructure(keyframes: ElementStructure[], maxTime: number) {
    keyframes.forEach(keyframe => {
        const { selector, dataset, style, element } = keyframe;
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
                item: propertiesInfo.isItem ? "1" : "0",
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
export function getDelayFrameStructure(
    time: number,
    nextTime: number,
    maxTime: number,
): ElementStructure {
    return {
        selector: ".keyframe_delay",
        key: `delay${time},${nextTime}`,
        datas: {
            time: -1,
        },
        style: {
            left: `${time / maxTime * 100}%`,
            width: `${(nextTime - time) / maxTime * 100}%`,
        },
    };
}
export function getKeyframesStructure(
    propertiesInfo: PropertiesInfo,
    maxTime: number,
): ElementStructure[] {
    const keyframeLines: ElementStructure[] = [];
    const { item, frames, properties } = propertiesInfo;
    const duration = item.getDuration();
    const delayFrames: ElementStructure[] = [];
    const isItScene = isScene(item);

    const keyframes: ElementStructure[] = frames.map(([time, iterationTime, value], i): ElementStructure => {
        const valueText = toValue(value);

        if (frames[i + 1]) {
            const [nextTime, nextIterationTime, nextValue] = frames[i + 1];
            const nextValueText = toValue(nextValue);

            if (
                (iterationTime === 0 && nextIterationTime === 0)
                || (iterationTime === duration && nextIterationTime === duration)
            ) {
                delayFrames.push(
                    getDelayFrameStructure(time, nextTime, maxTime),
                );
            }
            if (isItScene) {
                if (valueText !== nextValueText) {
                    return {
                        selector: ".keyframe_group",
                        key: `group${time},${nextTime}`,
                        datas: {
                            time: `${time},${nextTime}`,
                            from: time,
                            to: nextTime,
                        },
                        dataset: {
                            time,
                        },
                        style: {
                            left: `${time / maxTime * 100}%`,
                            width: `${(nextTime - time) / maxTime * 100}%`,
                        },
                    };
                } else {
                    return;
                }
            }
            if (!isUndefined(value) && !isUndefined(nextValue) && valueText !== nextValueText) {
                keyframeLines.push({
                    selector: ".keyframe_line",
                    key: `line${time},${nextTime}`,
                    datas: {
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

        if (isItScene) {
            return;
        }

        return {
            key: time,
            selector: ".keyframe",
            dataset: {
                time,
            },
            datas: {
                time,
                iterationTime,
                value: valueText,
            },
            style: {
                left: `${time / maxTime * 100}%`,
            },
            html: `${time} ${valueText}`,
        };
    }).filter(keyframe => keyframe);

    return [...keyframes, ...delayFrames, ...keyframeLines];
}
