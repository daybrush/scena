import Scene, { SceneItem } from "scenejs";
import {
    getTimelineInfo, getTarget,
    hasClass, removeClass, addClass,
    flatObject, splitProperty, findElementIndexByPosition,
    createElement, updateElement, findIndexByProperty, findStructure,
} from "./utils";
import { drag } from "@daybrush/drag";
import { CSS } from "./consts";
import { IObject, addEvent } from "@daybrush/utils";
import Axes, { PinchInput } from "@egjs/axes";
import { ElementStructure, Ids } from "./types";
import { dblCheck } from "./dblcheck";
import KeyController from "keycon";
import DataDOM from "data-dom";
import { getHeaderAreaStructure, getKeytimesAreaStructure } from "./HeaderAreaStructure";
import { getScrollAreaStructure } from "./ScrollAreaStructure";
import { getControlAreaStructure } from "./ControlAreaStructure";

let isExportCSS = false;

export default class Timeline {
    private scene: Scene;
    private maxTime: number = 0;
    private axes: Axes;
    private selectedProperty: string = "";
    private selectedTime: number = -1;
    private keycon: KeyController;
    private datadom: DataDOM<ElementStructure>;
    private structure: ElementStructure;
    private ids: Ids = {};
    constructor(scene: Scene, parentEl: HTMLElement) {
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

    // init
    private initController() {
        const ids = this.ids;
        const playBtn = this.ids.playBtn.element;
        const scene = this.scene;

        playBtn.addEventListener("click", e => {
            this.togglePlay();
            e.preventDefault();
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
    }
    private initKeyController() {
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
            this.removeKeyframe(this.selectedProperty, this.scene.getTime());
        })
        .keyup("esc", () => {
            this.finish();
        })
        .keyup("space", () => {
            this.togglePlay();
        });
    }
    private initStructure(scene: Scene, parentEl: HTMLElement) {
        const duration = Math.ceil(scene.getDuration());
        const timelineInfo = getTimelineInfo(scene);
        const maxDuration = Math.ceil(duration);
        const maxTime = maxDuration + 5;
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
                getScrollAreaStructure(ids, timelineInfo, 1, maxDuration, maxTime),
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

        if (prevSelectedProperty) {
            const prevSelectedIndex = findIndexByProperty(prevSelectedProperty, properties);

            removeClass(properties[prevSelectedIndex].element, "select");
            removeClass(values[prevSelectedIndex].element, "select");
            removeClass(keyframesList[prevSelectedIndex].element, "select");

            if (prevSelectedTime >= 0) {
                const keyframes = ids.keyframesContainers[prevSelectedIndex].children as ElementStructure[];

                keyframes.forEach(keyframe => {
                    if (keyframe.dataset.time === prevSelectedTime) {
                        removeClass(keyframe.element, "select");
                    }
                });
                this.selectedTime = -1;
            }
        }

        if (selectedProperty) {
            const selectedIndex = findIndexByProperty(selectedProperty, properties);
            addClass(properties[selectedIndex].element, "select");
            addClass(values[selectedIndex].element, "select");
            addClass(keyframesList[selectedIndex].element, "select");

            if (keyframeTime >= 0) {
                const keyframes = ids.keyframesContainers[selectedIndex].children as ElementStructure[];

                console.log(ids.keyframesContainers, selectedIndex);
                keyframes.forEach(keyframe => {
                    console.log(keyframe.dataset.time, keyframeTime);
                    if (keyframe.dataset.time === keyframeTime) {
                        addClass(keyframe.element, "select");
                    }
                });
                this.selectedTime = keyframeTime;
            }
        }
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
            const target = getTarget(e.target as HTMLElement, el => hasClass(el, "property"));

            if (!target) {
                return;
            }
            const index = properties.indexOf(target);

            if (index === -1) {
                return;
            }
            // select
            if (!arrow) {
                this.select(properties[index].dataset.property);
                return;
            }
        });
    }
    private setInputs(obj: IObject<any>) {
        const valuesArea = this.ids.valuesArea.element;
        for (const name in obj) {
            valuesArea.querySelector<HTMLInputElement>(`[data-property="${name}"] input`).value = obj[name];
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
            timeArea.element.innerHTML = `${Math.round(time * 100) / 100}`;
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
                this.select(list[index].dataset.property, time);
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
                this.edit(dragTarget, dragTarget.value, true);
            },
        });
    }
    private addKeyframe(index: number, time: number) {
        const list = this.ids.keyframesList;
        const scene = this.scene;
        const property = list[index].dataset.property;
        const {item, properties} = splitProperty(scene, property);

        this.editKeyframe(time, item.getNowValue(time, properties), index, true);
        this.select(property, time);
    }
    private removeKeyframe(property: string, time: number) {
        if (!property) {
            return;
        }
        const scene = this.scene;
        const {item, properties} = splitProperty(scene, property);

        if (properties.length) {
            item.remove(time, ...properties);
        } else {
            item.removeFrame(time);
        }
        this.update();
    }

    private update() {
        const scene = this.scene;
        const timelineInfo = getTimelineInfo(scene);
        const maxDuration = Math.ceil(scene.getDuration());
        const maxTime = maxDuration + 5;
        let zoom = this.axes.get(["zoom"]).zoom;
        const currentMaxTime = this.maxTime;
        this.maxTime = maxTime;
        const ids = this.ids;
        const prevKeytimesArea = ids.keyframesAreas[0];
        const nextZoom = currentMaxTime > 5 ? maxDuration / (currentMaxTime - 5) : 1;

        zoom = zoom * nextZoom;
        this.axes.axm.set({ zoom });
        // update keytimes
        this.datadom.update(
            prevKeytimesArea,
            getKeytimesAreaStructure(ids, zoom, maxDuration, maxTime),
        );

        const nextScrollAreaStructure = getScrollAreaStructure(
            ids, timelineInfo,
            this.axes.get(["zoom"]).zoom,
            maxDuration, this.maxTime,
        );

        this.datadom.update(
            ids.scrollArea,
            nextScrollAreaStructure,
        );
        scene.setTime(scene.getTime());
    }
    private editKeyframe(time: number, value: any, index: number, isForce?: boolean) {
        const ids = this.ids;
        const valuesStructure = ids.values;
        const isObjectData = ids.properties[index].dataset.object === "1";

        if (isObjectData) {
            return;
        }
        const property = valuesStructure[index].dataset.property as string;
        const scene = this.scene;
        const {
            properties,
            item,
        } = splitProperty(scene, property);

        if (!isForce) {
            const prevValue = (item as SceneItem).getNowValue(time, properties);

            if (`${prevValue}` === value) {
                return;
            }
        }
        item.set(time, ...properties, value);

        scene.setTime(time);
        this.update();
    }
    private restoreKeyframes() {
        this.scene.setTime(this.scene.getTime());
    }
    private edit(target: HTMLInputElement, value: any, isForce?: boolean) {
        const parentEl = getTarget(target, el => hasClass(el, "value"));

        if (!parentEl) {
            return;
        }
        const values = this.ids.values.map(({element}) => element);
        const index = values.indexOf(parentEl);

        if (index === -1) {
            return;
        }
        this.editKeyframe(this.scene.getTime(), value, index, isForce);
    }
    private initEditor() {
        const valuesArea = this.ids.valuesArea.element;

        new KeyController(valuesArea)
        .keydown(e => {
            e.inputEvent.stopPropagation();
        })
        .keyup(e => {
            e.inputEvent.stopPropagation();
        })
        .keyup("enter", e => {
            const target = e.inputEvent.target as HTMLInputElement;

            this.edit(target, target.value, true);
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
