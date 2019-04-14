import Scene, { SceneItem } from "scenejs";
import {
    getTimelineInfo, getTarget,
    hasClass, removeClass, addClass, makeStructure, flatObject,
    makeCompareStructure, splitProperty, getSceneItem, findElementIndexByPosition, applyStyle, findStructure
} from "./utils";
import { drag } from "@daybrush/drag";
import { CSS } from "./consts";
import { isObject, IObject, now, addEvent } from "@daybrush/utils";
import Axes, { PinchInput } from "@egjs/axes";
import { ElementStructure, Ids } from "./types";
import {
    updateKeyframesStructure,
    getKeyframesListStructure, getKeyframesScrollAreaChildrenStructure,
} from "./KeyframesStructure";
import { dblCheck } from "./dblcheck";
import { getKeytimesStructure, getLinesStructure } from "./KeytimesStructure";
import KeyController from "keycon";
import { getHeaderAreaStructure } from "./HeaderAreaStructure";
import { getScrollAreaStructure } from "./ScrollAreaStructure";
import { getControlAreaStructure } from "./ControlAreaStructure";

let isExportCSS = false;

export default class Timeline {
    private scene: Scene;
    private ids: Ids;
    private maxTime: number = 0;
    private axes: Axes;
    private selectedIndex: number = -1;
    private keycon: KeyController;
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
        return this.ids.timeline.element;
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
            playBtn.innerHTML = "pause";
        });
        scene.on("paused", () => {
            addClass(playBtn, "play");
            removeClass(playBtn, "pause");
            playBtn.innerHTML = "play";
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
            this.removeKeyframe(this.selectedIndex, this.scene.getTime());
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
            id: "timeline",
            children: [
                timelineCSS,
                getControlAreaStructure(),
                getHeaderAreaStructure(maxDuration, maxTime),
                getScrollAreaStructure(timelineInfo, maxDuration, maxTime),
            ],
        };

        this.ids = makeStructure<Ids>(structure, parentEl).ids;
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
        const keyframesScrollAreas = this.ids.keyframesScrollAreas;
        const headerArea = keyframesScrollAreas[0].element;
        const scrollArea = keyframesScrollAreas[1].element;
        const originalWidth = parseFloat(headerArea.style.width);

        const axes = new Axes({
            zoom: {
                range: [100, Infinity],
            },
        }, {}, {
                zoom: originalWidth,
            });
        axes.connect("zoom", new PinchInput(scrollArea, {
            scale: 0.7,
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
            const width = e.pos.zoom;

            keyframesScrollAreas.forEach(({ element }) => {
                element.style.width = `${width}%`;
            });

            if (e.inputEvent) {
                e.inputEvent.preventDefault();
            }
        });

        this.axes = axes;
        headerArea.addEventListener("wheel", e => {
            const delta = e.deltaY;

            axes.setBy({ zoom: delta / originalWidth * 5 });
            !e.deltaX && e.preventDefault();
        });

        addEvent(scrollArea, "wheel", e => {
            if (!this.keycon.altKey) {
                return;
            }
            e.preventDefault();
            const delta = e.deltaY;

            axes.setBy({ zoom: delta / originalWidth * 5 });
        });
    }
    private select(index: number) {
        const prevSelectedIndex = this.selectedIndex;
        const ids = this.ids;
        const values = ids.values;
        const properties = ids.properties;
        const keyframesList = ids.keyframesList;

        this.selectedIndex = index;

        if (prevSelectedIndex > -1) {
            removeClass(properties[prevSelectedIndex].element, "select");
            removeClass(values[prevSelectedIndex].element, "select");
            removeClass(keyframesList[prevSelectedIndex].element, "select");
        }

        if (index > -1) {
            addClass(properties[index].element, "select");
            addClass(values[index].element, "select");
            addClass(keyframesList[index].element, "select");
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
            let index = properties.indexOf(target);

            if (index === -1) {
                return;
            }
            // select
            if (!arrow) {
                this.select(index);
                return;
            }

            // fold
            if (target.getAttribute("data-object") === "0") {
                return;
            }
            const isFold = target.getAttribute("data-fold") === "1";

            function fold(isPrevFold) {
                const nextTarget = properties[index];
                const nextProperty = nextTarget.getAttribute("data-property");
                const isNextFold = nextTarget.getAttribute("data-fold") === "1";
                const isNextObject = nextTarget.getAttribute("data-object") === "1";

                if (target !== nextTarget) {
                    const {keyframesList, values} = ids;
                    const keyframes = keyframesList[index].element;
                    const value = values[index].element;

                    if (isFold) {
                        if (!isPrevFold)  {
                            removeClass(keyframes, "fold");
                            removeClass(value, "fold");
                            removeClass(nextTarget, "fold");
                        }
                    } else {
                        addClass(keyframes, "fold");
                        addClass(value, "fold");
                        addClass(nextTarget, "fold");
                    }
                }
                if (!isNextObject) {
                    return;
                }

                for (++index; index < length; ++index) {
                    const el = properties[index];

                    if (
                        // itemProperties
                        el.getAttribute("data-property").indexOf(nextProperty) > -1
                    ) {
                        // isChild
                        fold(!isPrevFold && isNextFold);
                    } else {
                        --index;
                        // not child
                        break;
                    }
                }
            }

            fold(isFold);
            target.setAttribute("data-fold", isFold ? "0" : "1");
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

            if (target) {
                scene.setTime(target.getAttribute("data-time"));
            } else if (!hasClass(e.target as Element, "keyframe_cursor")) {
                move(clientX);
            }
            const list = ids.keyframesList;
            const index = findElementIndexByPosition(
                list.map(({element}) => element),
                clientY,
            );

            this.select(index);
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
        drag(this.ids.valuesArea.element, {
            container: window,
            dragstart: e => {
                dragTarget = e.inputEvent.target;

                if (!this.keycon.altKey || !getTarget(dragTarget, el => el.nodeName === "INPUT")) {
                    return false;
                }
            },
            drag: e => {
                const value = dragTarget.value;

                console.log(value);

                const nextValue = value.replace(/\d+/g, num => {
                    return `${parseFloat(num) + 1}`;
                });

                dragTarget.value = nextValue;
            },
        });
    }
    private addKeyframe(index: number, time: number) {
        const list = this.ids.keyframesList;
        const scene = this.scene;
        const {item, properties} = splitProperty(scene, list[index].dataset.property);

        console.log(index, properties);
        this.editKeyframe(time, item.getNowValue(time, properties), index, true);
    }
    private removeKeyframe(index: number, time: number) {
        if (index === -1) {
            return;
        }
        const list = this.ids.keyframesList;
        const scene = this.scene;
        const {item, names, properties} = splitProperty(scene, list[index].dataset.property);

        if (properties.length) {
            item.remove(time, ...properties);
        } else {
            item.removeFrame(time);
        }
        this.updateKeyframes();
    }
    private updateKeytimes() {
        const maxTime = this.scene.getDuration() + 5;
        const currentMaxTime = this.maxTime;

        if (maxTime === currentMaxTime) {
            return;
        }

        this.maxTime = maxTime;
        const ids = this.ids;
        const keytimesContainer = ids.keytimesContainer;
        const lineArea = ids.lineArea;
        const nextKeytimes = getKeytimesStructure(maxTime);
        const nextLines = getLinesStructure(maxTime);

        // update keytimes
        makeCompareStructure(
            keytimesContainer,
            nextKeytimes,
        );
        // update lines
        makeCompareStructure(
            lineArea,
            nextLines,
        );
        const keyframesContainers = ids.keyframesContainers;

        // update keyframes style
        keyframesContainers.forEach(keyframesContainer => {
            const children = keyframesContainer.children as ElementStructure[];

            updateKeyframesStructure(children, maxTime);
        });

        this.moveCursor(this.scene.getTime());

        // zoom
        if (currentMaxTime && currentMaxTime < maxTime) {
            this.axes.setTo({
                zoom: this.axes.get(["zoom"]).zoom * maxTime / currentMaxTime,
            });
        }
    }
    private updateKeyframes() {
        const timelineInfo = getTimelineInfo(this.scene);
        const maxTime = this.maxTime;
        const ids = this.ids;
        const scrollArea = this.ids.keyframesScrollAreas[1];
        const nextKeyframesList = getKeyframesListStructure(timelineInfo, maxTime);
        const nextScrollAreaChildren = getKeyframesScrollAreaChildrenStructure(nextKeyframesList, maxTime);
        makeCompareStructure(
            scrollArea,
            nextScrollAreaChildren,
        );
        ids.lineArea = findStructure(".line_area", nextScrollAreaChildren, false);
        ids.keyframesContainers = findStructure(".keyframes_container", nextKeyframesList, true);
        ids.keyframesList = nextKeyframesList;

        this.updateKeytimes();
        this.scene.setTime(this.scene.getTime());
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
            names,
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
        this.updateKeyframes();
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
