import { PropertiesInfo } from "../types";
import { isScene, findIndex, toValue, prefix } from "../utils";
import Keyframe from "./Keyframe";
import KeyframeGroup from "./KeyframeGroup";
import KeyframeDelay from "./KeyframeDelay";
import KeyframeLine from "./KeyframeLine";
import { isUndefined } from "@daybrush/utils";
import * as React from "react";
import ElementComponent from "./ElementComponent";

export default class Keyframes extends ElementComponent<{
    id: string,
    propertiesInfo: PropertiesInfo,
    maxTime: number,
    folded: number,
    selected: boolean,
    selectedTime: number,
}> {
    public render() {
        const { id, propertiesInfo, selected, folded } = this.props;
        return (
            <div
                className={prefix("keyframes" + (folded === 1 ? " fold" : "") + (selected ? " select" : ""))}
                data-item={propertiesInfo.isItem ? "1" : "0"}
                data-id={id}>
                <div className={prefix("keyframes-container")}>
                    {this.renderList()}
                </div>
            </div>
        );
    }
    public renderList() {
        const { propertiesInfo, maxTime, selected, selectedTime } = this.props;
        const { item, frames, properties } = propertiesInfo;
        const isItScene = isScene(item);
        const duration = item.getDuration();

        const keyframes: JSX.Element[] = [];
        const keyframeGroups: JSX.Element[] = [];
        const keyframeDelays: JSX.Element[] = [];
        const keyframeLines: JSX.Element[] = [];

        const length = frames.length;
        const hasProperties = properties.length;
        let startIndex = 0;

        if (length >= 2 && !hasProperties) {
            const index = findIndex(frames, ([, , value]) => !isUndefined(value));
            startIndex = Math.min(length - 2, Math.max(frames[0][1] === 0 && frames[1][1] === 0 ? 1 : 0, index));
            const startFrame = frames[startIndex];
            const endFrame = frames[length - 1];
            const time = startFrame[0];
            const nextTime = endFrame[0];

            keyframeGroups.push(
                <KeyframeGroup
                    key="group"
                    id={`${time},${nextTime}`}
                    selected={selected && time <= selectedTime && selectedTime <= nextTime}
                    time={time}
                    nextTime={nextTime}
                    maxTime={maxTime} />,
            );
        }
        frames.forEach(([time, iterationTime, value], i) => {
            const valueText = toValue(value);
            if (frames[i + 1]) {
                const [nextTime, nextIterationTime] = frames[i + 1];

                if (
                    (iterationTime === 0 && nextIterationTime === 0)
                    || (iterationTime === duration && nextIterationTime === duration)
                ) {
                    keyframeDelays.push(
                        <KeyframeDelay
                            key={`delay${time},${nextTime}`}
                            id="-1"
                            time={time}
                            nextTime={nextTime}
                            maxTime={maxTime} />,
                    );
                }
            }
            if (
                i === 0
                && time === 0
                && iterationTime === 0
                && isUndefined(value)
                && !hasProperties
            ) {
                return;
            }
            if (frames[i + 1]) {
                const [nextTime, , nextValue] = frames[i + 1];
                const nextValueText = toValue(nextValue);

                if (
                    !isItScene
                    && !isUndefined(value)
                    && !isUndefined(nextValue)
                    && valueText !== nextValueText
                    && hasProperties
                ) {
                    keyframeLines.push(
                        <KeyframeLine
                            key={`line${keyframeLines.length}`}
                            time={time}
                            id={`${time},${nextTime}`}
                            nextTime={nextTime}
                            maxTime={maxTime} />,
                    );
                }
            }

            if (isItScene || i < startIndex) {
                return;
            }
            keyframes.push(
                <Keyframe
                    key={`keyframe${i}`}
                    id={`${time}`}
                    selected={selected && time === selectedTime}
                    time={time}
                    iterationTime={iterationTime}
                    value={valueText}
                    maxTime={maxTime}
                />,
            );
        });

        return [...keyframeGroups, ...keyframes, ...keyframeDelays, ...keyframeLines];
    }
}
