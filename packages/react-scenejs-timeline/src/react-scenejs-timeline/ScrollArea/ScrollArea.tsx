import { TimelineInfo, PropertiesInfo } from "../types";
import ElementComponent from "../utils/ElementComponent";
import KeyframesArea from "./KeyframesArea/KeyframesArea";
import PropertiesArea from "./PropertiesArea/PropertiesArea";
import ValuesArea from "./ValuesArea/ValuesArea";
import * as React from "react";
import { prefix, ref, fold, getTarget, hasClass } from "../utils";
import Axes from "@egjs/axes";
import KeyController from "keycon";
import Scene, { SceneItem } from "scenejs";

export default class ScrollArea extends ElementComponent<{
    timelineInfo: TimelineInfo,
    maxTime: number,
    maxDuration: number,
    zoom: number,
    axes: Axes,
    keycon: KeyController,
    selectedProperty: string,
    selectedTime: number,
    add: (item: Scene | SceneItem, properties: string[]) => any,
    setTime: (time?: number) => any,
    select: (property: string, time?: number, isNotUpdate?: boolean) => any,
    editKeyframe: (index: number, value: any) => any,
    update: () => any,
}> {
    public propertiesArea!: PropertiesArea;
    public valuesArea!: ValuesArea;
    public keyframesArea!: KeyframesArea;
    public render() {
        const {
            axes, keycon, zoom, maxDuration, maxTime, timelineInfo,
            selectedProperty, selectedTime, add, setTime, editKeyframe,
        } = this.props;

        return (
            <div className={prefix("scroll-area")}>
                <PropertiesArea
                    ref={ref(this, "propertiesArea")}
                    timelineInfo={timelineInfo}
                    selectedProperty={selectedProperty}
                />
                <ValuesArea
                    ref={ref(this, "valuesArea")}
                    add={add}
                    keycon={keycon}
                    setTime={setTime}
                    editKeyframe={editKeyframe}
                    timelineInfo={timelineInfo}
                    selectedProperty={selectedProperty}
                />
                <KeyframesArea
                    ref={ref(this, "keyframesArea")}
                    axes={axes}
                    keycon={keycon}
                    zoom={zoom}
                    maxDuration={maxDuration}
                    timelineInfo={timelineInfo}
                    maxTime={maxTime}
                    selectedProperty={selectedProperty}
                    selectedTime={selectedTime}
                />
            </div>
        );
    }
    public componentDidMount() {
        this.initClickProperty();
        this.foldAll();
    }
    public foldAll() {
        // fold all
        this.propertiesArea.properties.forEach((property, i) => {
            const { keys, isParent } = property.props.propertiesInfo;

            if (isParent) {
                this.fold(i);
            }
        });
    }
    private fold(index: number, isNotUpdate?: boolean) {
        const selectedProperty = this.propertiesArea.properties[index];
        const foldedId = selectedProperty.props.id;

        fold(this.propertiesArea, foldedId, isNotUpdate);
        fold(this.valuesArea, foldedId, isNotUpdate);
        fold(this.keyframesArea, foldedId, isNotUpdate);
    }
    private removeProperty(propertiesInfo: PropertiesInfo) {
        const { key, isItem, parentItem, item: targetItem, properties } = propertiesInfo;
        if (isItem) {
            let targetName: string | number | null = null;
            parentItem.forEach((item, name) => {
                if (item === targetItem) {
                    targetName = name;
                    return;
                }
            });
            if (targetName != null) {
                parentItem.removeItem(targetName);
            }
        } else {
            const times = (targetItem as SceneItem).times;

            times.forEach(time => {
                (targetItem as SceneItem).remove(time, ...properties);
            });
        }
        if (this.props.selectedProperty === key) {
            this.props.select("", -1, true);
        }
        this.props.update();
    }
    private initClickProperty() {
        this.propertiesArea.getElement().addEventListener("click", e => {
            const isClickArrow = getTarget(e.target as HTMLElement, el => hasClass(el, "arrow"));
            const isClickRemove = getTarget(e.target as HTMLElement, el => hasClass(el, "remove"));
            const target = getTarget(e.target as HTMLElement, el => hasClass(el, "property"));

            if (!target) {
                return;
            }
            const properties = this.propertiesArea.properties;
            const index = this.propertiesArea.properties
                .map(property => property.getElement())
                .indexOf(target);

            if (index === -1) {
                return;
            }
            const selectedProperty = properties[index];

            if (isClickRemove) {
                this.removeProperty(selectedProperty.props.propertiesInfo);
            } else {
                this.props.select(selectedProperty.props.id);

                if (isClickArrow) {
                    this.fold(index);
                }
            }
        });
    }
}
