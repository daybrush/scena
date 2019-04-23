import Scene, { SceneItem } from "scenejs";
import {
    getTarget,
    hasClass, removeClass, addClass,
    flatObject, splitProperty, findElementIndexByPosition,
    createElement, updateElement, findIndexByProperty, findStructure, numberFormat, isScene,
} from "./utils";
import { drag } from "@daybrush/drag";
import { CSS } from "./consts";
import { IObject, addEvent } from "@daybrush/utils";
import Axes, { PinchInput } from "@egjs/axes";
import { ElementStructure, Ids, PropertiesInfo, TimelineInfo } from "./types";
import { dblCheck } from "./dblcheck";
import KeyController from "keycon";
import DataDOM from "data-dom";
import { getHeaderAreaStructure, getKeytimesAreaStructure } from "./HeaderAreaStructure";
import { getScrollAreaStructure } from "./ScrollAreaStructure";
import { getControlAreaStructure } from "./ControlAreaStructure";
import Component from "@egjs/component";
import { Info } from "./Info";
import { getTimelineInfo } from "./TimelineInfo";

let isExportCSS = false;

export default class Timeline extends Component {
    public scene: Scene;
    private maxTime: number = 0;
    private axes: Axes;
    private selectedProperty: string = "";
    private selectedTime: number = -1;
    private keycon: KeyController;
    private datadom: DataDOM<ElementStructure>;
    private structure: ElementStructure;
    private ids: Ids = {};
    private timelineInfo: TimelineInfo;
    constructor(scene: Scene, parentEl: HTMLElement) {
        super();

        scene.finish();
        this.scene = scene;
        this.initStructure(scene, parentEl);
        this.initEditor();
        this.initScroll();
        this.initWheelZoom();
        this.initDragKeyframes();
        this.initClickProperty();
        this.initController();
        this.initDragValues();
        this.initKeyController();

        scene.setTime(0);

        new Info(this, parentEl);
    }
    public getElement() {
        return this.structure.element;
    }
    // scene control
    public prev() {
        this.scene.setTime(this.scene.getTime() - 0.05);
    }
    public next() {
        this.scene.setTime(this.scene.getTime() + 0.05);
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
    public update() {
        const scene = this.scene;
        this.timelineInfo = getTimelineInfo(scene);
        const maxDuration = Math.ceil(scene.getDuration());
        const maxTime = maxDuration;
        let zoom = this.axes.get(["zoom"]).zoom;
        const currentMaxTime = this.maxTime;
        this.maxTime = maxTime;
        const ids = this.ids;
        const prevKeytimesArea = ids.keyframesAreas[0];
        const nextZoom = currentMaxTime > 5 ? maxDuration / currentMaxTime : 1;

        zoom = zoom * nextZoom;
        this.axes.axm.set({ zoom });
        // update keytimes
        this.datadom.update(
            prevKeytimesArea,
            getKeytimesAreaStructure(ids, zoom, maxDuration, maxTime),
        );

        const nextScrollAreaStructure = getScrollAreaStructure(
            ids,
            this.timelineInfo,
            this.axes.get(["zoom"]).zoom,
            maxDuration, this.maxTime,
        );

        this.datadom.update(
            ids.scrollArea,
            nextScrollAreaStructure,
        );
        scene.setTime(scene.getTime());
    }
    // init
    private initController() {
        const ids = this.ids;
        const playBtn = this.ids.playBtn.element;
        const scene = this.scene;

        this.ids.addItem.element.addEventListener("click", e => {
            const name = prompt("Add Item");

            if (!name) {
                return;
            }
            this.scene.newItem(name);
            this.update();
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

            scene.setTime(time);
        });
    }
    private initKeyController() {
        const ids = this.ids;

        window.addEventListener("blur", () => {
            removeClass(ids.timeline.element, "alt");
        });
        this.keycon = new KeyController()
        .keydown("space", ({inputEvent}) => {
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
        .keydown("alt", () => {
            addClass(ids.timeline.element, "alt");
        })
        .keyup("alt", () => {
            removeClass(ids.timeline.element, "alt");
        })
        .keyup("esc", () => {
            this.finish();
        })
        .keyup("space", () => {
            this.togglePlay();
        });
    }
    private initStructure(scene: Scene, parentEl: HTMLElement) {
        this.timelineInfo = getTimelineInfo(scene);
        const duration = Math.ceil(scene.getDuration());
        const maxDuration = Math.ceil(duration);
        const maxTime = maxDuration;
        const ids = this.ids;
        let timelineCSS: ElementStructure;

        this.maxTime = maxTime;
        if (!isExportCSS) {
            timelineCSS = {
                selector: "style.style",
                html: CSS,
            };
            isExportCSS = true;
        }

        const structure: ElementStructure = {
            selector: ".timeline",
            ref: e => {
                ids.timeline = e;
            },
            children: [
                timelineCSS,
                getControlAreaStructure(ids),
                getHeaderAreaStructure(ids, 1, maxDuration, maxTime),
                getScrollAreaStructure(ids, this.timelineInfo, 1, maxDuration, maxTime),
            ],
        };
        this.datadom = new DataDOM(
            createElement,
            updateElement,
        );
        this.structure = this.datadom.render(structure, parentEl);
    }
    private initScroll() {
        const {
            keyframesAreas,
        } = this.ids;
        let isScrollKeyframe = false;

        const headerKeyframesArea = keyframesAreas[0].element;
        const scrollKeyframesArea = keyframesAreas[1].element;
        headerKeyframesArea.addEventListener("scroll", () => {
            if (isScrollKeyframe) {
                isScrollKeyframe = false;
            } else {
                isScrollKeyframe = true;
                scrollKeyframesArea.scrollLeft = headerKeyframesArea.scrollLeft;
            }
        });
        scrollKeyframesArea.addEventListener("scroll", () => {
            if (isScrollKeyframe) {
                isScrollKeyframe = false;
            } else {
                isScrollKeyframe = true;
                headerKeyframesArea.scrollLeft = scrollKeyframesArea.scrollLeft;
            }
        });
    }
    private initWheelZoom() {
        const ids = this.ids;
        const keyframesScrollAreas = ids.keyframesScrollAreas;
        const headerArea = keyframesScrollAreas[0].element;
        const scrollArea = keyframesScrollAreas[1].element;

        const axes = new Axes(
            {
                zoom: {
                    range: [1, Infinity],
                },
            },
            {},
            { zoom: 1 },
        );
        axes.connect("zoom", new PinchInput(scrollArea, {
            scale: 0.1,
            hammerManagerOptions: {
                touchAction: "auto",
            },
        }));
        axes.on("hold", e => {
            if (e.inputEvent) {
                e.inputEvent.preventDefault();
            }
        });
        axes.on("change", e => {
            const scale = ids.keyframesScrollAreas[0].dataset.width;
            const width = e.pos.zoom * scale * 100;

            ids.keyframesScrollAreas.forEach(({ element }) => {
                element.style.width = `${width}%`;
            });

            if (e.inputEvent) {
                e.inputEvent.preventDefault();
            }
        });

        this.axes = axes;
        headerArea.addEventListener("wheel", e => {
            const delta = e.deltaY;

            axes.setBy({ zoom: delta / 5000 });
            !e.deltaX && e.preventDefault();
        });

        addEvent(scrollArea, "wheel", e => {
            if (!this.keycon.altKey) {
                return;
            }
            e.preventDefault();
            const delta = e.deltaY;

            axes.setBy({ zoom: delta / 5000 });
        });
    }
    private select(selectedProperty: string, keyframeTime?: number) {
        const prevSelectedProperty = this.selectedProperty;
        const prevSelectedTime = this.selectedTime;
        const ids = this.ids;
        const values = ids.values;
        const properties = ids.properties;
        const keyframesList = ids.keyframesList;

        this.selectedProperty = selectedProperty;
        this.scene.pause();
        if (prevSelectedProperty) {
            const prevSelectedIndex = findIndexByProperty(prevSelectedProperty, properties);

            removeClass(properties[prevSelectedIndex].element, "select");
            removeClass(values[prevSelectedIndex].element, "select");
            removeClass(keyframesList[prevSelectedIndex].element, "select");

            if (prevSelectedTime >= 0) {
                const keyframes = ids.keyframesContainers[prevSelectedIndex].children as ElementStructure[];

                keyframes.forEach(keyframe => {
                    if (keyframe.datas.time === prevSelectedTime) {
                        removeClass(keyframe.element, "select");
                    }
                });
                this.selectedTime = -1;
            }
        }
        let selectedItem: Scene | SceneItem = this.scene;
        if (selectedProperty) {
            if (document.activeElement) {
                (document.activeElement as HTMLElement).blur();
            }
            const selectedIndex = findIndexByProperty(selectedProperty, properties);
            addClass(properties[selectedIndex].element, "select");
            addClass(values[selectedIndex].element, "select");
            addClass(keyframesList[selectedIndex].element, "select");

            selectedItem = (ids.keyframesList[selectedIndex].datas as PropertiesInfo).item;
            if (keyframeTime >= 0) {
                const selectedPropertyStructure = ids.keyframesContainers[selectedIndex];
                const keyframes = selectedPropertyStructure.children as ElementStructure[];

                keyframes.forEach(keyframe => {
                    if (keyframe.datas.time === keyframeTime) {
                        addClass(keyframe.element, "select");
                    }
                });
                this.selectedTime = keyframeTime;
            }
        }
        this.trigger("select", {
            selectedItem,
            selectedProperty: this.selectedProperty,
            selectedTime: this.selectedTime,
            prevSelectedProperty,
            prevSelectedTime,
        });
    }
    private initClickProperty() {
        const ids = this.ids;
        const {
            propertiesAreas,
        } = ids;

        propertiesAreas[1].element.addEventListener("click", e => {
            const properties = ids.properties.map(property => property.element);
            const length = properties.length;
            const arrow = getTarget(e.target as HTMLElement, el => hasClass(el, "arrow"));
            const remove = getTarget(e.target as HTMLElement, el => hasClass(el, "remove"));
            const target = getTarget(e.target as HTMLElement, el => hasClass(el, "property"));

            if (!target) {
                return;
            }
            const index = properties.indexOf(target);

            if (index === -1) {
                return;
            }
            const selectedProperty = ids.properties[index];
            if (remove) {
                this.remove(selectedProperty.datas as PropertiesInfo);
            } else if (arrow) {
                //
            } else  {
                this.select(selectedProperty.dataset.key);
                return;
            }
        });
    }
    private setInputs(obj: IObject<any>) {
        const valuesArea = this.ids.valuesArea.element;
        for (const name in obj) {
            valuesArea.querySelector<HTMLInputElement>(`[data-key="${name}"] input`).value = obj[name];
        }
    }
    private moveCursor(time: number) {
        const {cursors} = this.ids;
        const maxTime = this.maxTime;
        const px = 15 - 30 * time / maxTime;
        const percent = 100 * time / maxTime;
        const left = `calc(${percent}% + ${px}px)`;

        cursors.forEach(cursor => {
            cursor.element.style.left = left;
        });
    }
    private initDragKeyframes() {
        const ids = this.ids;
        const {
            scrollArea,
            timeArea,
            cursors,
            keyframesAreas,
            keyframesScrollAreas,
        } = ids;
        const scene = this.scene;

        scene.on("animate", e => {
            const time = e.time;
            this.moveCursor(time);

            this.setInputs(flatObject(e.frames));
            const minute = numberFormat(Math.floor(time / 60), 2);
            const second = numberFormat(Math.floor(time % 60), 2);
            const milisecond = numberFormat(Math.floor((time % 1) * 100), 3, true);
            (timeArea.element as HTMLInputElement).value = `${minute}:${second}:${milisecond}`;
        });
        const getTime = (clientX: number) => {
            const rect = keyframesScrollAreas[1].element.getBoundingClientRect();
            const scrollAreaWidth = rect.width - 30;
            const scrollAreaX = rect.left + 15;
            const x = Math.min(scrollAreaWidth, Math.max(clientX - scrollAreaX, 0));
            const percentage = x / scrollAreaWidth;
            let time = this.maxTime * percentage;

            time = Math.round(time * 20) / 20;

            return time;
        };
        const move = (clientX: number) => {
            scene.setTime(getTime(clientX));
        };
        const click = (e, clientX, clientY) => {
            const target = getTarget(e.target as HTMLElement, el => hasClass(el, "keyframe"));
            const time = target ? parseFloat(target.getAttribute("data-time")) : getTime(clientX);

            scene.setTime(time);
            const list = ids.keyframesList;
            const index = findElementIndexByPosition(
                list.map(({element}) => element),
                clientY,
            );

            if (index > -1) {
                this.select(list[index].dataset.key, time);
            }
            e.preventDefault();
        };
        const dblclick = (e, clientX, clientY) => {
            const list = ids.keyframesList;
            const index = findElementIndexByPosition(
                list.map(({element}) => element),
                clientY,
            );

            if (index === -1) {
                return;
            }
            this.addKeyframe(index, getTime(clientX));
        };
        drag(cursors[0].element, {
            dragstart: ({inputEvent}) => {
                inputEvent.stopPropagation();
            },
            drag: ({ clientX }) => {
                move(clientX);
            },
            container: window,
        });
        keyframesScrollAreas.forEach(({ element }) => {
            drag(element, {
                container: window,
                drag: ({ deltaX, deltaY, inputEvent }) => {
                    keyframesAreas[1].element.scrollLeft -= deltaX;
                    scrollArea.element.scrollTop -= deltaY;
                    inputEvent.preventDefault();
                },
                dragend: ({ isDrag, clientX, clientY, inputEvent }) => {
                    !isDrag && click(inputEvent, clientX, clientY);
                    dblCheck(isDrag, inputEvent, clientX, clientY, dblclick);
                },
            });
        });
    }
    private initDragValues() {
        let dragTarget: HTMLInputElement = null;
        let dragTargetValue: any;
        drag(this.ids.valuesArea.element, {
            container: window,
            dragstart: e => {
                dragTarget = e.inputEvent.target;
                dragTargetValue = dragTarget.value;

                console.log(this.keycon.altKey, getTarget(dragTarget, el => el.nodeName === "INPUT"));
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
    private addKeyframe(index: number, time: number) {
        const list = this.ids.keyframesList;
        const property = list[index].dataset.key;
        const {item, properties} = list[index].datas as PropertiesInfo;

        this.select(property, time);

        const value = ((this.ids.values[index].children as ElementStructure).element as HTMLInputElement).value;

        this.editKeyframe(index, value);
    }
    private remove(propertiesInfo: PropertiesInfo) {
        const {key, isItem, parentItem, item: targetItem, properties} = propertiesInfo;
        if (isItem) {
            let targetName: string = null;
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
        if (this.selectedProperty === key) {
            this.selectedProperty = "";
            this.selectedTime = -1;
        }
        this.update();
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

        console.log(properties);
        item.set(item.getIterationTime(), ...properties, value);
        this.update();
    }
    private restoreKeyframes() {
        this.scene.setTime(this.scene.getTime());
    }
    private edit(target: HTMLInputElement, value: any) {
        const parentEl = getTarget(target, el => hasClass(el, "value"));

        if (!parentEl) {
            return;
        }
        const values = this.ids.values.map(({element}) => element);
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
