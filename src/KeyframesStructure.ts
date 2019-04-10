import { toValue } from "./utils";
import { ElementStructure } from "./types";

export function updateKeyframesStructure(keyframes: ElementStructure[], maxTime) {
    keyframes.forEach(keyframe => {
        const {selector, dataset, style} = keyframe;
        if (selector === ".keyframe") {
            style.left = `${dataset.time / maxTime * 100}%`;
        } else {
            style.left = `${dataset.from / maxTime * 100}%`,
            style.width = `${(dataset.to - dataset.from) / maxTime * 100}%`;
        }
    });
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
