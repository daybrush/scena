import { TimelineInfo } from "../types";
import Value from "./Value";
import * as React from "react";
import { prefix, refs, checkFolded, getTarget } from "../utils";
import ElementComponent from "./ElementComponent";
import { IObject, hasClass, findIndex } from "@daybrush/utils";
import Scene, { SceneItem } from "scenejs";
import { drag } from "@daybrush/drag";
import KeyController from "keycon";

export default class ValuesArea extends ElementComponent<{
    timelineInfo: TimelineInfo,
    keycon: KeyController,
    selectedProperty: string,
    add: (item: Scene | SceneItem, properties: string[]) => any,
    setTime: (time?: number) => any,
    editKeyframe: (index: number, value: any) => any,
}, {
    foldedInfo: IObject<boolean>,
}> {
    public values: Value[] = [];
    public state = {
        foldedInfo: {},
    };
    public render() {
        const { timelineInfo, selectedProperty, add } = this.props;
        const { foldedInfo } = this.state;
        const values: JSX.Element[] = [];
        this.values = [];

        for (const id in timelineInfo) {
            const propertiesInfo = timelineInfo[id];
            const selected = selectedProperty === id;
            const folded = checkFolded(foldedInfo, propertiesInfo.keys);

            values.push(<Value
                ref={refs(this, "values", values.length)}
                add={add}
                folded={folded}
                selected={selected}
                id={id} propertiesInfo={propertiesInfo} />);
        }

        return (
            <div className={prefix("values-area")}>
                {values}
            </div>
        );
    }
    public componentDidMount() {
        const element = this.getElement();
        let dragTarget: HTMLInputElement = null;
        let dragTargetValue: any;

        element.addEventListener("focusout", e => {
            this.props.setTime();
        });
        drag(element, {
            container: window,
            dragstart: e => {
                dragTarget = e.inputEvent.target;
                dragTargetValue = dragTarget.value;

                if (!this.props.keycon.altKey || !getTarget(dragTarget, el => el.nodeName === "INPUT")) {
                    return false;
                }
            },
            drag: e => {
                const nextValue = dragTargetValue.replace(/-?\d+/g, num => {
                    return `${parseFloat(num) + Math.round(e.distX / 2)}`;
                });

                dragTarget.value = nextValue;
            },
            dragend: e => {
                this.edit(dragTarget, dragTarget.value);
            },
        });
        new KeyController(element)
            .keydown(e => {
                !e.isToggle && e.inputEvent.stopPropagation();
            })
            .keyup(e => {
                !e.isToggle && e.inputEvent.stopPropagation();
            })
            .keyup("enter", e => {
                const target = e.inputEvent.target as HTMLInputElement;

                this.edit(target, target.value);
            })
            .keyup("esc", e => {
                const target = e.inputEvent.target as HTMLInputElement;

                target.blur();
            });
    }
    private edit(target: HTMLInputElement, value: any) {
        const parentEl = getTarget(target, el => hasClass(el, "value"));

        if (!parentEl) {
            return;
        }
        const index = findIndex(this.values, v => v.getElement() === parentEl);

        if (index === -1) {
            return;
        }
        this.props.editKeyframe(index, value);
    }
}
