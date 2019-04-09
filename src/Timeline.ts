import Scene from "scenejs";
import {
    getTimelineInfo, toValue, getTarget,
    hasClass, removeClass, addClass, makeStructure, flatObject
} from "./utils";
import { drag } from "@daybrush/drag";
import { CSS } from "./consts";
import { isObject, IObject } from "@daybrush/utils";
import Axes, { PinchInput } from "@egjs/axes";
import { ElementStructure, Ids } from "./types";

let isExportCSS = false;

export default class Timeline {
    private scene: Scene;
    private maxTime: number;
    private structures: Ids<ElementStructure>;
    private elements: Ids<HTMLElement>;
    constructor(scene: Scene, parentEl: HTMLElement) {
        scene.finish();

        this.scene = scene;
        this.initElement(scene, parentEl);
    }
    public getElement() {
        return this.elements.timeline;
    }
    private initElement(scene: Scene, parentEl: HTMLElement) {
        const duration = scene.getDuration();
        const timelineInfo = getTimelineInfo(scene);
        const maxDuration = Math.ceil(duration);
        const maxTime =  Math.max(maxDuration, 10);
        const keytimes: ElementStructure[] = [];
        const properties: ElementStructure[] = [];
        const values: ElementStructure[] = [];
        const lines: ElementStructure[] = [];
        const keyframesList: ElementStructure[] = [];
        let timelineCSS: ElementStructure;

        if (!isExportCSS) {
            timelineCSS = {
                selector: "style.style",
                html: CSS,
            };
            isExportCSS = true;
        }
        this.maxTime = maxTime;

        for (let i = 0; i <= maxTime; ++i) {
            const time = i;
            keytimes.push({
                selector: ".keytime",
                style: {
                    width: `${100 / maxTime}%`,
                },
                children: [
                    {
                        selector: "span",
                        html: `${time}s`,
                    },
                    ".graduation.start",
                    ".graduation.quarter",
                    ".graduation.half",
                    ".graduation.quarter3",
                ],
            });

            lines.push({
                selector: ".division_line",
                style: {
                    left: `${100 / maxTime * i}%`,
                },
            });
        }
        for (const property in timelineInfo) {
            const propertyNames = property.split("///");
            const length = propertyNames.length;
            const times = timelineInfo[property];
            const id = propertyNames[length - 1];

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
                    ".arrow",
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
            const keyframeLines: ElementStructure[] = [];
            const keyframes = times.map(([time, value], i) => {
                const valueText = toValue(value);

                if (times[i + 1]) {
                    const [nextTime, nextValue] = times[i + 1];
                    const nextValueText = toValue(nextValue);

                    if (valueText === nextValueText) {
                        keyframeLines.push({
                            selector: ".keyframe_line",
                            style: {
                                left: `${time / maxTime * 100}%`,
                                width: `${(nextTime - time) / maxTime * 100}%`,
                            },
                        });
                    }
                }

                return {
                    selector: ".keyframe",
                    dataset: {
                        time,
                        value: valueText,
                    },
                    style: {
                        left: `${time / maxTime * 100}%`,
                    },
                    html: `${time} ${valueText}`,
                };
            });
            keyframesList.push({
                id: "keyframesList[]",
                selector: ".keyframes",
                dataset: {
                    property,
                },
                children: {
                    selector: ".keyframes_container",
                    children: [
                        ...keyframes,
                        ...keyframeLines,
                    ],
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
                                            selector: ".keyframes_container",
                                            children: keytimes,
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
                                        selector: ".line_area",
                                        children: lines,
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
        keyframesScrollAreas[0].addEventListener("wheel", e => {
            const delta = e.deltaY;

            axes.setBy({ zoom: delta / originalWidth * 5 });
            !e.deltaX && e.preventDefault();
        });
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
    private drag() {
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
            const maxDuration = Math.ceil(scene.getDuration());
            const maxTime = this.maxTime;
            const px = 15 - 30 * time / maxTime;
            const percent = 100 * time / maxTime;
            const left = `calc(${percent}% + ${px}px)`;

            this.setInputs(flatObject(e.frames));
            timeArea.innerHTML = `${time}`;
            cursors.forEach(cursor => {
                cursor.style.left = left;
            });
        });
        const move = (clientX: number) => {
            const rect = keyframesScrollAreas[1].getBoundingClientRect();
            const scrollAreaWidth = rect.width - 30;
            const scrollAreaX = rect.left + 15;
            const x = Math.min(scrollAreaWidth, Math.max(clientX - scrollAreaX, 0));
            const percentage = x / scrollAreaWidth;
            let time = this.maxTime * percentage;

            time = Math.ceil(time * 20) / 20;
            scene.setTime(time);
        };
        function click(e, clientX) {
            const target = getTarget(e.target as HTMLElement, el => hasClass(el, "keyframe"));

            if (target) {
                scene.setTime(target.getAttribute("data-time"));
            } else if (!hasClass(e.target as Element, "keyframe_cursor")) {
                move(clientX);
            }
            e.preventDefault();
        }
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
                dragend: ({ isDrag, clientX, inputEvent }) => {
                    !isDrag && click(inputEvent, clientX);
                },
            });
        });

    }
}
