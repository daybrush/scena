import { toValue, applyStyle } from "./utils";
import { ElementStructure, Ids } from "./types";
import { getLinesStructure } from "./KeytimesStructure";

export function updateKeyframesStructure(keyframes: ElementStructure[], maxTime) {
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

export function getKeyframesAreaStructure(ids: Ids, keyframesList, maxDuration, maxTime): ElementStructure {
    return {
        ref: e => {
            ids.keyframesAreas[1] = e;
        },
        selector: ".keyframes_area",
        children: {
            style: {
                minWidth: `${50 * maxTime}px`,
                width: `${(maxDuration ? maxTime / maxDuration : 1) * 100}%`,
            },
            ref: e => {
                ids.keyframesScrollAreas[1] = e;
            },
            selector: ".keyframes_scroll_area",
            children: getKeyframesScrollAreaChildrenStructure(ids, keyframesList, maxTime),
        },
    };
}
export function getKeyframesScrollAreaChildrenStructure(ids: Ids, keyframesList, maxTime): ElementStructure[] {
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
export function getKeyframesListStructure(ids: Ids, timelineInfo, maxTime: number): ElementStructure[] {
    const keyframesList: ElementStructure[] = [];

    for (const property in timelineInfo) {
        const times = timelineInfo[property];
        const keyframes = getKeyframesStructure(times, maxTime);

        keyframesList.push({
            ref: (e, i) => {
                ids.keyframesList[i] = e;
            },
            selector: ".keyframes",
            key: property,
            dataset: {
                property,
            },
            children: {
                ref: (e, i) => {
                    ids.keyframesContainers[i] = e;
                },
                selector: ".keyframes_container",
                children: keyframes,
            },
        });
    }
    return keyframesList;
}
export function getKeyframesStructure(times: any[][], maxTime): ElementStructure[] {
    const keyframeLines: ElementStructure[] = [];

    const keyframes: ElementStructure[] = times.map(([time, value], i): ElementStructure => {
        const valueText = toValue(value);

        if (times[i + 1]) {
            const [nextTime, nextValue] = times[i + 1];
            const nextValueText = toValue(nextValue);

            if (valueText === nextValueText) {
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
