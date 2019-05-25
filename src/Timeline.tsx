import Scene, { SceneItem } from "scenejs";
import {
    getTarget,
    hasClass, removeClass, addClass,
    flatObject, splitProperty, findElementIndexByPosition,
    findIndexByProperty, findStructure, numberFormat, isScene, findStructureByProperty,
} from "./utils";
import { drag } from "@daybrush/drag";
import { CSS, SUPPORT_TOUCH, SUPPORT_POINTER_EVENTS } from "./consts";
import { IObject, addEvent, isUndefined } from "@daybrush/utils";
import Axes, { PinchInput } from "@egjs/axes";
import { ElementStructure, Ids, PropertiesInfo, TimelineInfo } from "./types";
import { dblCheck } from "./dblcheck";
import KeyController from "keycon";
import DataDOM from "data-dom";
import { getHeaderAreaStructure, getKeytimesAreaStructure } from "./HeaderAreaStructure";
import { getScrollAreaStructure } from "./ScrollAreaStructure";
import { getControlAreaStructure } from "./ControlAreaStructure";
import Component from "@egjs/component";
import { getTimelineInfo } from "./TimelineInfo";
import * as ReactDOM from "react-dom";
import * as React from "react";
import TimelineArea from "./components/TimelineArea";

export default class Timeline extends Component {
    public scene: Scene | SceneItem;
    public options: {
        keyboard?: boolean,
    };
    private maxTime: number = 0;
    private axes: Axes;
    private selectedProperty: string = "";
    private selectedTime: number = -1;
    private keycon: KeyController;
    private datadom: DataDOM<ElementStructure>;
    private structure: ElementStructure;
    private ids: Ids = {};
    private timelineInfo: TimelineInfo;
    private timelineArea: TimelineArea;
    constructor(scene: Scene | SceneItem, parentEl: HTMLElement, options: {
        keyboard?: boolean,
    } = {}) {
        super();
        this.options = {
            keyboard: true,
            ...options,
        };
        scene.finish();
        this.scene = scene;
        this.initStructure(scene, parentEl);
        // this.initEditor();
        // this.initScroll();
        // this.initWheelZoom();
        // this.initDragKeyframes();
        // this.initClickProperty();
        // this.initController();
        // this.initDragValues();
        // this.initKeyController();

        this.setTime(0);

        // new Info(this, parentEl);
    }
    public getElement() {
        return this.structure.element;
    }
    // scene control
    public prev() {
        this.setTime(this.scene.getTime() - 0.05);
    }
    public next() {
        this.setTime(this.scene.getTime() + 0.05);
    }
    public finish() {
        this.scene.finish();
    }
    public togglePlay() {
        const scene = this.scene;
        if (scene.getPlayState() === "running") {
            scene.pause();
        } else {
            scene.play();
        }
    }
    public setTime(time: number) {
        const scene = this.scene;
        const direction = scene.getDirection();

        scene.pause();

        if (direction === "normal" || direction === "alternate") {
            scene.setTime(time);
        } else {
            scene.setTime(scene.getDuration() - time);
        }
    }
    public update() {
        const scene = this.scene;
        this.timelineInfo = getTimelineInfo(scene);
        const maxDuration = Math.ceil(scene.getDuration());
        const maxTime = Math.max(this.maxTime, maxDuration);
        let zoom = this.axes.get(["zoom"]).zoom;
        const currentMaxTime = this.maxTime;
        this.maxTime = maxTime;
        const ids = this.ids;
        const prevKeytimesArea = ids.keyframesAreas[0];
        const nextZoom = currentMaxTime > 1 ? maxTime / currentMaxTime : 1;

        zoom = Math.max(1, zoom * nextZoom);
        this.axes.axm.set({ zoom });
        // update keytimes
        this.datadom.update(
            prevKeytimesArea,
            getKeytimesAreaStructure(ids, zoom, maxTime, maxTime),
        );

        const nextScrollAreaStructure = getScrollAreaStructure(
            ids,
            this.timelineInfo,
            this.axes.get(["zoom"]).zoom,
            maxTime, maxTime,
        );

        this.datadom.update(
            ids.scrollArea,
            nextScrollAreaStructure,
        );
        this.setTime(scene.getTime());
    }
    private newItem(scene: Scene) {
        const name = prompt("Add Item");

        if (!name) {
            return;
        }
        (this.scene as Scene).newItem(name);
        this.update();
    }
    private newProperty(item: SceneItem, properties: string[]) {
        const property = prompt("new property");

        if (!property) {
            return;
        }
        item.set(item.getIterationTime(), ...properties, property, 0);
        this.update();
    }
    // init
    private initController() {
        const ids = this.ids;
        const playBtn = this.ids.playBtn.element;
        const scene = this.scene;

        this.ids.addItem.element.addEventListener("click", e => {
            if (isScene(this.scene)) {
                this.newItem(this.scene);
            } else {
                this.newProperty(this.scene, []);
            }
        });
        playBtn.addEventListener("click", e => {
            this.togglePlay();
            e.preventDefault();
        });
        ids.unselectedArea.element.addEventListener("click", e => {
            this.select("", -1);
        });
        ids.prevBtn.element.addEventListener("click", e => {
            this.prev();
            e.preventDefault();
        });
        ids.nextBtn.element.addEventListener("click", e => {
            this.next();
            e.preventDefault();
        });
        scene.on("play", () => {
            addClass(playBtn, "pause");
            removeClass(playBtn, "play");
            // playBtn.innerHTML = "pause";
        });
        scene.on("paused", () => {
            addClass(playBtn, "play");
            removeClass(playBtn, "pause");
            // playBtn.innerHTML = "play";
        });
        if (this.options.keyboard) {
            new KeyController(ids.timeArea.element)
                .keydown(e => {
                    !e.isToggle && e.inputEvent.stopPropagation();
                })
                .keyup(e => {
                    !e.isToggle && e.inputEvent.stopPropagation();
                })
                .keyup("enter", e => {
                    // go to time
                    const element = ids.timeArea.element;
                    const value = (element as HTMLInputElement).value;
                    const result = /(\d+):(\d+):(\d+)/g.exec(value);

                    if (!result) {
                        return;
                    }
                    const minute = parseFloat(result[1]);
                    const second = parseFloat(result[2]);
                    const milisecond = parseFloat(`0.${result[3]}`);
                    const time = minute * 60 + second + milisecond;

                    this.setTime(time);
                });
        }
    }
    private initKeyController() {
        const ids = this.ids;

        window.addEventListener("blur", () => {
            removeClass(ids.timeline.element, "alt");
        });

        this.keycon = new KeyController()
            .keydown("alt", () => {
                addClass(ids.timeline.element, "alt");
            })
            .keyup("alt", () => {
                removeClass(ids.timeline.element, "alt");
            });

        if (this.options.keyboard) {
            this.keycon.keydown("space", ({ inputEvent }) => {
                inputEvent.preventDefault();
            })
                .keydown("left", e => {
                    this.prev();
                })
                .keydown("right", e => {
                    this.next();
                })
                .keyup("backspace", () => {
                    this.removeKeyframe(this.selectedProperty);
                })
                .keyup("esc", () => {
                    this.finish();
                })
                .keyup("space", () => {
                    this.togglePlay();
                });
        }
    }
    private initStructure(scene: Scene | SceneItem, parentEl: HTMLElement) {
        this.timelineArea = ReactDOM.render(
            <TimelineArea scene = {this.scene}/>,
            parentEl,
        ) as any;
    }

    private initDragValues() {
        const ids = this.ids;
        const element = ids.valuesArea.element;
        let dragTarget: HTMLInputElement = null;
        let dragTargetValue: any;

        addEvent(element, "click", e => {
            const addedElement = getTarget(dragTarget, el => hasClass(el, "add"));
            if (!addedElement) {
                return;
            }
            const valueElement = addedElement.parentElement as HTMLElement;
            const index = findIndexByProperty(valueElement.getAttribute("data-id"), ids.values);

            if (index < 0) {
                return;
            }

            const propertiesInfo = ids.properties[index].datas as PropertiesInfo;
            const properties = propertiesInfo.properties.slice();
            const item = propertiesInfo.item;

            if (isScene(item)) {
                this.newItem(item);
            } else {
                this.newProperty(item, properties);
            }

        });
        drag(element, {
            container: window,
            dragstart: e => {
                dragTarget = e.inputEvent.target;
                dragTargetValue = dragTarget.value;

                if (!this.keycon.altKey || !getTarget(dragTarget, el => el.nodeName === "INPUT")) {
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
    }

    private fold(index: number, forceFold?: boolean) {
        const ids = this.ids;
        const { properties, values, keyframesList } = ids;
        const selectedProperty = properties[index];
        const length = properties.length;
        let max;
        for (max = index + 1; max < length; ++max) {
            if (properties[max].datas.key.indexOf(selectedProperty.datas.key + "///") !== 0) {
                break;
            }
        }
        const foldProperties = properties.slice(index + 1, max);
        const foldValues = values.slice(index + 1, max);
        const foldKeyframesList = keyframesList.slice(index + 1, max);
        const selectedElement = selectedProperty.element;
        // true : unfold, false: fold
        const isFold = isUndefined(forceFold) ? selectedElement.getAttribute("data-fold") === "1" : forceFold;

        selectedElement.setAttribute("data-fold", isFold ? "0" : "1");
        const foldFunction = (isFold ? removeClass : addClass);
        const depth = selectedProperty.datas.keys.length;

        foldProperties.forEach((property, i) => {
            const datas = property.datas as PropertiesInfo;
            if (depth + 1 < datas.keys.length) {
                return;
            }
            foldFunction(property.element, "fold");
            foldFunction(foldValues[i].element, "fold");
            foldFunction(foldKeyframesList[i].element, "fold");
            if (datas.isParent) {
                if (!isFold) {
                    this.fold(index + 1 + i, false);
                } else {
                    // always fold
                    property.element.setAttribute("data-fold", "1");
                }
            } else {
                property.element.setAttribute("data-fold", isFold ? "0" : "1");
            }
        });
    }

    private removeKeyframe(property: string) {
        const propertiesInfo = this.timelineInfo[property];
        if (!property || !propertiesInfo || isScene(propertiesInfo.item)) {
            return;
        }

        const properties = propertiesInfo.properties;
        const item = propertiesInfo.item;

        item.remove(item.getIterationTime(), ...properties);
        this.update();
    }
    private editKeyframe(index: number, value: any) {
        const ids = this.ids;
        const isObjectData = ids.properties[index].dataset.object === "1";

        if (isObjectData) {
            return;
        }
        const propertiesInfo = ids.keyframesList[index].datas as PropertiesInfo;
        const item = propertiesInfo.item;
        const properties = propertiesInfo.properties;

        item.set(item.getIterationTime(), ...properties, value);
        this.update();
    }
    private restoreKeyframes() {
        this.setTime(this.scene.getTime());
    }
    private edit(target: HTMLInputElement, value: any) {
        const parentEl = getTarget(target, el => hasClass(el, "value"));

        if (!parentEl) {
            return;
        }
        const values = this.ids.values.map(({ element }) => element);
        const index = values.indexOf(parentEl);

        if (index === -1) {
            return;
        }
        this.editKeyframe(index, value);
    }
    private initEditor() {
        const valuesArea = this.ids.valuesArea.element;

        new KeyController(valuesArea)
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
        valuesArea.addEventListener("focusout", e => {
            this.restoreKeyframes();
        });
    }
}
