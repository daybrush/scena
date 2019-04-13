import { toValue, applyStyle } from "./utils";
import { ElementStructure } from "./types";
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

export function getKeyframesAreaStructure(keyframesList, maxDuration, maxTime) {
    return {
        id: "keyframesAreas[]",
        selector: ".keyframes_area",
        children: {
            style: {
                minWidth: `${50 * maxTime}px`,
                width: `${(maxDuration ? maxTime / maxDuration : 1) * 100}%`,
            },
            id: "keyframesScrollAreas[]",
            selector: ".keyframes_scroll_area",
            children: getKeyframesScrollAreaChildrenStructure(keyframesList, maxTime),
        },
    };
}
export function getKeyframesScrollAreaChildrenStructure(keyframesList, maxTime) {
    return [
        ...keyframesList,
        {
            key: "cursor",
            selector: ".keyframe_cursor",
            id: "cursors[]",
        },
        {
            key: "lineArea",
            id: "lineArea",
            selector: ".line_area",
            children: getLinesStructure(maxTime),
        },
    ];
}
export function getKeyframesListStructure(timelineInfo, maxTime: number) {
    const keyframesList = [];

    for (const property in timelineInfo) {
        const times = timelineInfo[property];
        const keyframes = getKeyframesStructure(times, maxTime);

        keyframesList.push({
            id: [
                "keyframesList[]",
            ],
            selector: ".keyframes",
            key: property,
            dataset: {
                property,
            },
            children: {
                id: "keyframesContainers[]",
                selector: ".keyframes_container",
                children: keyframes,
            },
        });
    }
    return keyframesList;
}
export function getKeyframesStructure(times, maxTime) {
    const keyframeLines = [];

    const keyframes = times.map(([time, value], i) => {
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
            memberof: "keyframesInfoList",
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
