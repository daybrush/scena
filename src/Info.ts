import Timeline from "./Timeline";
import Scene, { SceneItem, Animator } from "scenejs";
import { createElement, updateElement, getTarget } from "./utils";
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
                    attr: {
                        value: isUndefined(value) ? "" : value,
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
    public select = (info: SelectEvent) => {
        console.log(info);
        this.datadom.update(
            this.optionArea.children,
            getOptionsStructure(info.selectedItem),
            this.optionArea,
        );
        this.selectedItem = info.selectedItem;
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
                this.selectedItem.setDelay(parseFloat(value));
            }

            this.timeline.update();
        });
    }
}
