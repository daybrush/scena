import Scene, { SceneItem } from "scenejs";
import {
    getTimelineInfo, toValue, getTarget,
    hasClass, removeClass, addClass, makeStructure, flatObject,
    makeCompareStructure, splitProperty, getSceneItem, findElementIndexByPosition, applyStyle
} from "./utils";
import { drag } from "@daybrush/drag";
import { CSS } from "./consts";
import { isObject, IObject, now } from "@daybrush/utils";
import Axes, { PinchInput } from "@egjs/axes";
import { ElementStructure, Ids } from "./types";
import { getKeyframesStructure, updateKeyframesStructure } from "./KeyframesStructure";
import { dblCheck } from "./dblcheck";
import { getKeytimesStructure, getLinesStructure } from "./KeytimesStructure";

let isExportCSS = false;

export default class Timeline {
    private scene: Scene;
    private structures: Ids<ElementStructure>;
    private elements: Ids<HTMLElement>;
    private propertiesNames: string[] = [];
    private maxTime: number = 0;
    private axes: Axes;
    private selectedIndex: number = -1;
    constructor(scene: Scene, parentEl: HTMLElement) {
        scene.finish();

        this.scene = scene;
        this.initElement(scene, parentEl);
        this.editor();
    }
    public getElement() {
        return this.elements.timeline;
    }
    private initElement(scene: Scene, parentEl: HTMLElement) {
        const duration = scene.getDuration();
        const timelineInfo = getTimelineInfo(scene);
        const maxDuration = Math.ceil(duration);
        const maxTime = maxDuration + 5;
        const propertiesNames = this.propertiesNames;
        const properties: ElementStructure[] = [];
        const values: ElementStructure[] = [];
        const keyframesList: ElementStructure[] = [];
        let timelineCSS: ElementStructure;

        this.maxTime = maxTime;
        if (!isExportCSS) {
            timelineCSS = {
                selector: "style.style",
                html: CSS,
            };
            isExportCSS = true;
        }

        for (const property in timelineInfo) {
            const propertyNames = property.split("///");
            const length = propertyNames.length;
            const times = timelineInfo[property];
            const id = propertyNames[length - 1];

            propertiesNames.push(property);
            properties.push({
                id: "properties[]",
                selector: ".property",
                dataset: {
                    id,
                    property,
                    parent: propertyNames[length - 2] || "",
                    object: "0",
                    item: propertyNames[0],
                },
                style: {
                    paddingLeft: `${10 + (length - 1) * 20}px`,
                },
                children: [
                    { selector: ".arrow"},
                    {
                        selector: "span",
                        html: id,
                    },
                ],
            });
            const isHasObject = times[0] && isObject(times[0][1]);
            values.push({
                id: "values[]",
                selector: ".value",
                dataset: {
                    property,
                    object: isHasObject ? "1" : "0",
                },
                children: {
                    id: "inputs[]",
                    selector: "input",
                    attr: {
                        value: times[0] ? times[0][1] : "",
                    },
                },
            });
            const parentProperty = propertyNames.slice(0, -1).join("///");
            properties.forEach(({dataset}) => {
                if (dataset.property === parentProperty) {
                    dataset.object = "1";
                }
            });
            const keyframes = getKeyframesStructure(times, maxTime);
            keyframesList.push({
                id: [
                    "keyframesList[]",
                    "keyframesInfoList[][]",
                ],
                selector: ".keyframes",
                dataset: {
                    property,
                },
                children: {
                    id: "keyframesContainers[]",
                    selector: ".keyframes_container",
                    children: keyframes,
                },
            });
        }
        const structure: ElementStructure = {
            selector: ".timeline",
            id: "timeline",
            children: [
                timelineCSS,
                {
                    selector: ".header_area",
                    children: [
                        {
                            id: "propertiesAreas[]",
                            selector: ".properties_area",
                            children: [
                                {
                                    selector: ".property.time_area",
                                    id: "timeArea",
                                    html: "0",
                                },
                            ],
                        },
                        {
                            selector: ".values_area",
                            children: {
                                selector: ".value",
                            },
                        },
                        {
                            id: "keyframesAreas[]",
                            selector: ".keyframes_area",
                            children: {
                                style: {
                                    minWidth: `${50 * maxTime}px`,
                                    width: `${(maxDuration ? maxTime / maxDuration : 1) * 100}%`,
                                },
                                id: "keyframesScrollAreas[]",
                                selector: ".keyframes_scroll_area",
                                children: {
                                    selector: ".keyframes",
                                    children: [
                                        {
                                            id: "keytimesContainer",
                                            selector: ".keyframes_container",
                                            children: getKeytimesStructure(maxTime),
                                        },
                                        {
                                            selector: ".keyframe_cursor",
                                            id: "cursors[]",
                                        },
                                    ],
                                },
                            },
                        },
                    ],
                },
                {
                    id: "scrollArea",
                    selector: ".scroll_area",
                    children: [
                        {
                            id: "propertiesAreas[]",
                            selector: ".properties_area",
                            children: [
                                {
                                    selector: ".properties_scroll_area",
                                    children: properties,
                                },
                            ],
                        },
                        {
                            id: "valuesArea",
                            selector: ".values_area",
                            children: values,
                        },
                        {
                            id: "keyframesAreas[]",
                            selector: ".keyframes_area",
                            children: {
                                style: {
                                    minWidth: `${50 * maxTime}px`,
                                    width: `${(maxDuration ? maxTime / maxDuration : 1) * 100}%`,
                                },
                                id: "keyframesScrollAreas[]",
                                selector: ".keyframes_scroll_area",
                                children: [
                                    ...keyframesList,
                                    {
                                        selector: ".keyframe_cursor",
                                        id: "cursors[]",
                                    },
                                    {
                                        id: "lineArea",
                                        selector: ".line_area",
                                        children: getLinesStructure(maxTime),
                                    },
                                ],
                            },
                        },
                    ],
                },
            ],
        };

        const {structures, elements} = makeStructure(structure, parentEl);

        this.structures = structures;
        this.elements = elements;
        this.syncScroll();
        this.wheelZoom();
        this.drag();
        this.fold();
    }
    private syncScroll() {
        const {
            keyframesAreas,
        } = this.elements;
        let isScrollKeyframe = false;

        keyframesAreas[0].addEventListener("scroll", () => {
            if (isScrollKeyframe) {
                isScrollKeyframe = false;
            } else {
                isScrollKeyframe = true;
                keyframesAreas[1].scrollLeft = keyframesAreas[0].scrollLeft;
            }
        });
        keyframesAreas[1].addEventListener("scroll", () => {
            if (isScrollKeyframe) {
                isScrollKeyframe = false;
            } else {
                isScrollKeyframe = true;
                keyframesAreas[0].scrollLeft = keyframesAreas[1].scrollLeft;
            }
        });
    }
    private wheelZoom() {
        const { keyframesScrollAreas } = this.elements;
        const originalWidth = parseFloat(keyframesScrollAreas[0].style.width);

        const axes = new Axes({
            zoom: {
                range: [100, Infinity],
            },
        }, {}, {
                zoom: originalWidth,
            });
        axes.connect("zoom", new PinchInput(keyframesScrollAreas[1], {
            scale: 0.7,
            hammerManagerOptions: {
                touchAction: "auto",
            },
        }));
        axes.on("hold", e => {
            console.log("hold");
            if (e.inputEvent) {
                e.inputEvent.preventDefault();
            }
        });
        axes.on("change", e => {
            const width = e.pos.zoom;

            keyframesScrollAreas.forEach(el => {
                el.style.width = `${width}%`;
            });

            if (e.inputEvent) {
                e.inputEvent.preventDefault();
            }
        });

        this.axes = axes;
        keyframesScrollAreas[0].addEventListener("wheel", e => {
            const delta = e.deltaY;

            axes.setBy({ zoom: delta / originalWidth * 5 });
            !e.deltaX && e.preventDefault();
        });
    }
    private select(index: number) {
        const prevSelectedIndex = this.selectedIndex;
        const values = this.structures.values;
        const properties = this.structures.properties;
        const keyframesList = this.structures.keyframesList;

        this.selectedIndex = index;

        if (prevSelectedIndex > -1) {
            removeClass(properties[prevSelectedIndex].element, "select");
            removeClass(values[prevSelectedIndex].element, "select");
            removeClass(keyframesList[prevSelectedIndex].element, "select");
        }

        if (index > -1) {
            addClass(properties[prevSelectedIndex].element, "select");
            addClass(values[prevSelectedIndex].element, "select");
            addClass(keyframesList[prevSelectedIndex].element, "select");
        }
    }
    private fold() {
        const {
            keyframesList,
            properties,
            values,
            propertiesAreas,
        } = this.elements;

        propertiesAreas[1].addEventListener("click", e => {
            const target = getTarget(e.target as HTMLElement, el => hasClass(el, "property"));

            if (!target || target.getAttribute("data-object") === "0") {
                return;
            }

            const length = properties.length;
            let index = properties.indexOf(target);

            if (index === -1) {
                return;
            }

            const isFold = target.getAttribute("data-fold") === "1";

            function fold(isPrevFold) {
                const nextTarget = properties[index];
                const nextProperty = nextTarget.getAttribute("data-property");
                const isNextFold = nextTarget.getAttribute("data-fold") === "1";
                const isNextObject = nextTarget.getAttribute("data-object") === "1";

                if (target !== nextTarget) {
                    if (isFold) {
                        if (!isPrevFold)  {
                            removeClass(keyframesList[index], "fold");
                            removeClass(values[index], "fold");
                            removeClass(nextTarget, "fold");
                        }
                    } else {
                        addClass(keyframesList[index], "fold");
                        addClass(values[index], "fold");
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
        const valuesArea = this.elements.valuesArea;
        for (const name in obj) {
            valuesArea.querySelector<HTMLInputElement>(`[data-property="${name}"] input`).value = obj[name];
        }
    }
    private moveCursor(time: number) {
        const {cursors} = this.elements;
        const maxTime = this.maxTime;
        const px = 15 - 30 * time / maxTime;
        const percent = 100 * time / maxTime;
        const left = `calc(${percent}% + ${px}px)`;

        cursors.forEach(cursor => {
            cursor.style.left = left;
        });
    }
    private drag() {
        const structures = this.structures;
        const {
            scrollArea,
            timeArea,
            cursors,
            keyframesAreas,
            keyframesScrollAreas,
        } = this.elements;
        const scene = this.scene;

        scene.on("animate", e => {
            const time = e.time;
            this.moveCursor(time);

            this.setInputs(flatObject(e.frames));
            timeArea.innerHTML = `${time}`;
        });
        const getTime = (clientX: number) => {
            const rect = keyframesScrollAreas[1].getBoundingClientRect();
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
            const list = structures.keyframesList;
            const index = findElementIndexByPosition(
                list.map(({element}) => element),
                clientY,
            );

            this.select(index);
            e.preventDefault();
        };
        const dblclick = (e, clientX, clientY) => {
            const list = this.structures.keyframesList;
            const index = findElementIndexByPosition(
                list.map(({element}) => element),
                clientY,
            );

            if (index === -1) {
                return;
            }
            const time = getTime(clientX);
            const {item, properties} = splitProperty(scene, list[index].dataset.property);

            this.editKeyframe(time, item.getNowValue(time, properties), index, true);
            this.updateKeytimes();
        };
        drag(cursors[0], {
            dragstart: ({inputEvent}) => {
                inputEvent.stopPropagation();
            },
            drag: ({ clientX }) => {
                move(clientX);
            },
            container: window,
        });
        keyframesScrollAreas.forEach(el => {
            drag(el, {
                container: window,
                drag: ({ deltaX, deltaY, inputEvent }) => {
                    keyframesAreas[1].scrollLeft -= deltaX;
                    scrollArea.scrollTop -= deltaY;
                    inputEvent.preventDefault();
                },
                dragend: ({ isDrag, clientX, clientY, inputEvent }) => {
                    !isDrag && click(inputEvent, clientX, clientY);
                    dblCheck(isDrag, inputEvent, clientX, clientY, dblclick);
                },
            });
        });
    }
    private updateKeytimes() {
        const maxTime = this.scene.getDuration() + 5;
        const currentMaxTime = this.maxTime;

        if (maxTime === currentMaxTime) {
            return;
        }

        this.maxTime = maxTime;
        const keytimesContainer = this.structures.keytimesContainer;
        const lineArea = this.structures.lineArea;
        const keytimes = keytimesContainer.children as ElementStructure[];
        const lines = lineArea.children as ElementStructure[];
        const nextKeytimes = getKeytimesStructure(maxTime);
        const nextLines = getLinesStructure(maxTime);

        makeCompareStructure(
            keytimes,
            nextKeytimes,
            keytimesContainer,
            ({dataset}) => (dataset.time),
            (prev, cur) => {
                applyStyle(cur.element, cur.style);
            },
        );
        makeCompareStructure(
            lines,
            nextLines,
            lineArea,
            (_, i) => i,
            (prev, cur) => {
                applyStyle(cur.element, cur.style);
            },
        );
        const keyframesContainers = this.structures.keyframesContainers;

        keyframesContainers.forEach(keyframesContainer => {
            const children = keyframesContainer.children as ElementStructure[];
            updateKeyframesStructure(children, maxTime);

            children.forEach(structure => {
                applyStyle(structure.element, structure.style);
            });
        });

        this.moveCursor(this.scene.getTime());

        if (currentMaxTime && currentMaxTime < maxTime) {
            this.axes.setTo({
                zoom: this.axes.get(["zoom"]).zoom * maxTime / currentMaxTime,
            });
        }
    }
    private updateKeyframes(names: string[], properties: string[], index: number) {
        const keyframesContainer = this.structures.keyframesContainers[index];
        const keyframes = keyframesContainer.children as ElementStructure[];
        const length = properties.length;
        const scene = this.scene;
        const item: SceneItem = getSceneItem(scene, names);
        const times = item.times.filter(time =>
            length ?
            item.getFrame(time).has(...properties) :
            true,
        );
        const delay = item.getDelay();
        const nextKeyframes = getKeyframesStructure(
            times.map(time => [delay + time, item.getFrame(time).get(...properties)]),
            this.maxTime,
        );

        makeCompareStructure(
            keyframes,
            nextKeyframes,
            keyframesContainer,
            ({dataset}) => (dataset.time),
        );

        if (length) {
            const nextProperties = properties.slice(0, -1);
            const nextProperty = [...names, ...nextProperties].join("///");
            const nextIndex = this.propertiesNames.indexOf(nextProperty);

            if (nextIndex !== -1) {
                this.updateKeyframes(names, nextProperties, nextIndex);
                return;
            }
        }
        scene.setTime(scene.getTime());
    }
    private editKeyframe(time: number, value: any, index: number, isForce?: boolean) {
        const valuesStructure = this.structures.values;
        const isObjectData = this.structures.properties[index].dataset.object === "1";

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
        this.updateKeyframes(names, properties, index);
    }
    private edit(target: HTMLInputElement, value: any, isForce?: boolean) {
        const parentEl = getTarget(target, el => hasClass(el, "value"));

        if (!parentEl) {
            return;
        }
        const values = this.elements.values;
        const index = values.indexOf(parentEl);

        if (index === -1) {
            return;
        }
        this.editKeyframe(this.scene.getTime(), value, index, isForce);
    }
    private editor() {
        const valuesArea = this.elements.valuesArea;

        valuesArea.addEventListener("keyup", e => {
            if (e.keyCode !== 13) {
                return;
            }
            const target = e.target as HTMLInputElement;

            this.edit(target, target.value, true);
        });
        valuesArea.addEventListener("focusout", e => {
            const target = e.target as HTMLInputElement;

            this.edit(target, target.value);
        });
    }
}
