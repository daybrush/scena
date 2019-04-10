import { toValue } from "./utils";

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
