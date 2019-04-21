import Timeline from "./Timeline";
import Scene, { SceneItem, Animator, DirectionType } from "scenejs";
import { createElement, updateElement, getTarget, isSceneItem } from "./utils";
import DataDOM, { DataStructure } from "data-dom";
import { ElementStructure } from "./types";
import { CSS2 } from "./consts";
import { isUndefined } from "@daybrush/utils";
import KeyController from "keycon";

export interface SelectEvent {
    selectedItem: Scene | SceneItem;
    selectedProperty: string;
    selectedTime: number;
    prevSelectedProperty: string;
    prevSelectedTime: number;
}
export function getOptionAreaStructure(option: string, value: any): ElementStructure {
    return {
        selector: ".option_area",
        children: [
            {
                selector: ".option_name",
                html: option,
            },
            {
                selector: ".option_value",
                dataset: {
                    option,
                },
                children: {
                    selector: "input",
                    dataset: {
                        option,
                    },
                    ref: e => {
                        (e.element as HTMLInputElement).value = isUndefined(value) ? "" : value;
                    },
                },
            },
        ],
    };
}
export function getOptionsStructure(item?: Animator): ElementStructure[] {
    return [
        getOptionAreaStructure("delay", item && item.getDelay()),
        getOptionAreaStructure("easing", item && item.getEasingName()),
        getOptionAreaStructure("iterationCount", item && item.getIterationCount()),
        getOptionAreaStructure("playSpeed", item && item.getPlaySpeed()),
        getOptionAreaStructure("fillMode", item && item.getFillMode()),
        getOptionAreaStructure("direction", item && item.getDirection()),
        getOptionAreaStructure("duration", item && item.getDuration()),
        getOptionAreaStructure("lastFrame", item && item.getDuration()),
    ];
}
export class Info {
    private datadom: DataDOM<ElementStructure>;
    private optionArea: ElementStructure;
    private infoArea: ElementStructure;
    private selectedItem: Scene | SceneItem;
    constructor(private timeline: Timeline, parentEl: HTMLElement) {
        timeline.on("select", this.select);

        this.datadom = new DataDOM(
            createElement,
            updateElement,
        );
        this.selectedItem = timeline.scene;

        this.infoArea = this.datadom.render(
            {
                selector: ".item_info",
                children: [
                    {
                        selector: "style",
                        html: CSS2,
                    },
                    {
                        ref: (e: ElementStructure) => {
                            this.optionArea = e;
                        },
                        selector: ".options_area",
                        children: getOptionsStructure(timeline.scene),
                    },
                ],
            },
            parentEl,
        );
        this.init();
    }
    public update() {
        this.datadom.update(
            this.optionArea.children,
            getOptionsStructure(this.selectedItem),
            this.optionArea,
        );
    }
    public select = (info: SelectEvent) => {
        this.selectedItem = info.selectedItem;
        this.update();
    }
    private init() {
        new KeyController(this.infoArea.element)
        .keydown(e => {
            e.inputEvent.stopPropagation();
        })
        .keyup(e => {
            e.inputEvent.stopPropagation();
        })
        .keyup("enter", e => {
            const selectedItem = this.selectedItem;
            if (!this.selectedItem) {
                return;
            }
            const target = getTarget(e.inputEvent.target as HTMLInputElement, el => el.nodeName === "INPUT");

            if (!target) {
                return;
            }
            const option = target.getAttribute("data-option");
            const value = target.value;

            if (option === "delay") {
                selectedItem.setDelay(parseFloat(value));
            } else if (option === "lastFrame") {
                const nextDuration = parseFloat(value);
                if (isSceneItem(selectedItem) && selectedItem.getDuration() < nextDuration) {
                    selectedItem.newFrame(nextDuration);
                }
            } else if (option === "playSpeed") {
                selectedItem.setPlaySpeed(parseFloat(value));
            } else if (option === "direction") {
                selectedItem.setDirection(value as DirectionType);
            } else if (option === "iterationCount") {
                selectedItem.setIterationCount(value === "infinite" ? value : parseFloat(value));
            } else if (option === "easing") {
                selectedItem.setEasing(value);
            }
            this.timeline.update();
            this.update();
        });
    }
}
