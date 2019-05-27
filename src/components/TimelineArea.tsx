import { TimelineInfo, PropertiesInfo } from "../types";
import ControlArea from "./ControlArea";
import HeaderArea from "./HeaderArea";
import ScrollArea from "./ScrollArea";
import * as React from "react";
import { CSS, SUPPORT_TOUCH, SUPPORT_POINTER_EVENTS } from "../consts";
import {
    prefix,
    numberFormat,
    ref,
    getTarget, findElementIndexByPosition,
    find, hasClass, flatObject, fold, isScene
} from "../utils";
import Axes, { PinchInput } from "@egjs/axes";
import KeyController from "keycon";
import Scene, { SceneItem } from "scenejs";
import { drag } from "@daybrush/drag";
import { dblCheck } from "../dblcheck";
import { getTimelineInfo } from "../TimelineInfo";
import { IObject, removeClass } from "@daybrush/utils";

let isExportCSS = false;

export default class TimelineArea extends React.Component<{
    scene: Scene | SceneItem,
    style?: React.CSSProperties,
}, {
    zoom: number,
    alt: boolean,
    maxDuration: number,
    maxTime: number,
    timelineInfo: TimelineInfo,
    selectedProperty: string,
    selectedTime: number
}> {
    public headerArea: HeaderArea;
    public controlArea: ControlArea;
    public scrollArea: ScrollArea;
    public state = {
        alt: false,
        zoom: 1,
        maxDuration: 0,
        maxTime: 0,
        timelineInfo: null,
        selectedProperty: "",
        selectedTime: -1,
    };
    private isExportCSS = false;
    private axes: Axes;
    private keycon: KeyController;
    constructor(props: any) {
        super(props);
        if (isExportCSS) {
            isExportCSS = true;
            this.isExportCSS = true;
        }

        const scene = this.props.scene;

        scene.finish();
        const duration = Math.ceil(scene.getDuration());

        this.state.timelineInfo = getTimelineInfo(this.props.scene);
        this.state.maxTime = duration;
        this.state.maxDuration = duration;

        this.keycon = new KeyController()
            .keydown("alt", () => {
                this.setState({ alt: true });
            })
            .keyup("alt", () => {
                this.setState({ alt: false });
            });

        this.axes = new Axes(
            {
                zoom: {
                    range: [1, Infinity],
                },
            },
            {},
            { zoom: 1 },
        );
    }


    public render() {
        const {
            scene,
        } = this.props;
        const {
            zoom,
            alt,
            maxDuration,
            maxTime,
            timelineInfo,
            selectedProperty,
            selectedTime,
        } = this.state;

        return (
            <div className={prefix("timeline" + (alt ? " alt" : ""))} style={this.props.style}>
                {this.renderStyle()}
                <ControlArea
                    ref={ref(this, "controlArea")}
                    scene = {scene}
                    select = {this.select}
                    prev = {this.prev}
                    next = {this.next}
                    setTime = {this.setTime}
                    togglePlay={this.togglePlay}
                    />
                <HeaderArea
                    ref={ref(this, "headerArea")}
                    add={this.add}
                    axes={this.axes}
                    move={this.move}
                    maxDuration={maxDuration}
                    zoom={zoom}
                    maxTime={maxTime}
                    timelineInfo={timelineInfo} />
                <ScrollArea
                    ref={ref(this, "scrollArea")}
                    add={this.add}
                    setTime={this.setTime}
                    editKeyframe={this.editKeyframe}
                    keycon={this.keycon}
                    axes={this.axes}
                    maxDuration={maxDuration}
                    zoom={zoom}
                    maxTime={maxTime}
                    selectedProperty={selectedProperty}
                    selectedTime={selectedTime}
                    timelineInfo={timelineInfo} />
            </div>
        );
    }
    public componentDidMount() {
        this.initWheelZoom();
        this.initScroll();
        this.initScene();
        this.initDragKeyframes();
        this.initClickProperty();
        this.initFold();
        this.initKeyController();
    }
    public componentDidUpdate() {
        this.setTime();
    }
    public prev = () => {
        this.setTime(this.props.scene.getTime() - 0.05);
    }
    public next = () => {
        this.setTime(this.props.scene.getTime() + 0.05);
    }
    public finish = () => {
        this.props.scene.finish();
    }
    public togglePlay = () => {
        const scene = this.props.scene;
        if (scene.getPlayState() === "running") {
            scene.pause();
        } else {
            scene.play();
        }
    }
    private renderStyle() {
        if (!this.isExportCSS) {
            return <style>{CSS}</style>;
        }
    }
    private add = (item: Scene | SceneItem = this.props.scene, properties: string[] = []) => {
        if (isScene(item)) {
            this.newItem(item);
        } else {
            this.newProperty(item, properties);
        }
    }
    private newItem(scene: Scene) {
        const name = prompt("Add Item");

        if (!name) {
            return;
        }
        scene.newItem(name);
        this.update();
    }
    private newProperty(item: SceneItem, properties: string[]) {
        const property = prompt("Add Property");

        if (!property) {
            return;
        }
        item.set(item.getIterationTime(), ...properties, property, "");
        this.update();
    }
    private getDistTime = (
        distX: number,
        rect: ClientRect
            = this.scrollArea.keyframesArea.scrollAreaElement.getBoundingClientRect(),
    ) => {
        const scrollAreaWidth = rect.width - 30;
        const percentage = Math.min(scrollAreaWidth, distX) / scrollAreaWidth;
        const time = this.state.maxTime * percentage;

        return Math.round(time * 20) / 20;
    }
    private setTime = (time: number = this.props.scene.getTime()) => {
        const scene = this.props.scene;
        const direction = scene.getDirection();

        scene.pause();

        if (direction === "normal" || direction === "alternate") {
            scene.setTime(time);
        } else {
            scene.setTime(scene.getDuration() - time);
        }
    }
    private getTime = (clientX: number) => {
        const rect = this.scrollArea.keyframesArea.scrollAreaElement.getBoundingClientRect();
        const scrollAreaX = rect.left + 15;
        const x = Math.max(clientX - scrollAreaX, 0);

        return this.getDistTime(x, rect);
    }
    private move = (clientX: number) => {
        this.setTime(this.getTime(clientX));
    }
    private update() {
        const scene = this.props.scene;
        const maxDuration = Math.ceil(scene.getDuration());
        const maxTime = Math.max(this.state.maxTime, maxDuration);
        const currentMaxTime = this.state.maxTime;
        const zoom = this.axes.get(["zoom"]).zoom;
        const nextZoomScale = currentMaxTime > 1 ? maxTime / currentMaxTime : 1;
        const nextZoom = Math.max(1, zoom * nextZoomScale);

        this.setState({
            timelineInfo: getTimelineInfo(scene),
            maxTime,
            maxDuration,
        });

        this.axes.axm.set({ zoom: nextZoom });
    }

    private moveCursor(time: number) {
        const maxTime = this.state.maxTime;
        const px = 15 - 30 * time / maxTime;
        const percent = 100 * time / maxTime;
        const left = `calc(${percent}% + ${px}px)`;

        this.scrollArea.keyframesArea.cursor.getElement().style.left = left;
        this.headerArea.keytimesArea.cursor.getElement().style.left = left;
    }
    private setInputs(obj: IObject<any>) {
        const valuesArea = this.scrollArea.valuesArea.getElement();
        for (const name in obj) {
            valuesArea.querySelector<HTMLInputElement>(`[data-id="${name}"] input`).value = obj[name];
        }
    }
    private select = (property: string, time: number = -1) => {
        this.props.scene.pause();
        this.setState({
            selectedProperty: property,
            selectedTime: time,
        });
    }
    private editKeyframe = (index: number, value: any) => {
        const isObjectData
            = this.scrollArea.propertiesArea.properties[index].props.propertiesInfo.isParent;

        if (isObjectData) {
            return;
        }
        const propertiesInfo =
            this.scrollArea.keyframesArea.keyframesList[index].props.propertiesInfo;
        const item = propertiesInfo.item;
        const properties = propertiesInfo.properties;

        item.set(item.getIterationTime(), ...properties, value);
        this.update();
    }
    private removeKeyframe(property: string) {
        const propertiesInfo = this.state.timelineInfo[property];
        if (!property || !propertiesInfo || isScene(propertiesInfo.item)) {
            return;
        }

        const properties = propertiesInfo.properties;
        const item = propertiesInfo.item;

        item.remove(item.getIterationTime(), ...properties);
        this.update();
    }
    private addKeyframe(index: number, time: number) {
        const keyframesList = this.scrollArea.keyframesArea.keyframesList;
        const {
            id,
        } = keyframesList[index].props;

        this.select(id, time);

        const inputElement = this.scrollArea.valuesArea.values[index].inputElement;

        if (inputElement) {
            this.editKeyframe(index, inputElement.value);
        }
    }
    private removeProperty(propertiesInfo: PropertiesInfo) {
        const { key, isItem, parentItem, item: targetItem, properties } = propertiesInfo;
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
        if (this.state.selectedProperty === key) {
            this.state.selectedProperty = "";
            this.state.selectedTime = -1;
        }
        this.update();
    }
    private initScene() {
        this.props.scene.on("animate", e => {
            const time = e.time;
            this.moveCursor(time);
            this.setInputs(flatObject(e.frames || e.frame.get()));
            const minute = numberFormat(Math.floor(time / 60), 2);
            const second = numberFormat(Math.floor(time % 60), 2);
            const milisecond = numberFormat(Math.floor((time % 1) * 100), 3, true);

            this.controlArea.timeArea.getElement().value = `${minute}:${second}:${milisecond}`;
        });
    }
    private initWheelZoom() {
        const scrollArea = this.scrollArea.getElement();
        const axes = this.axes;

        if (SUPPORT_TOUCH || SUPPORT_POINTER_EVENTS) {
            axes.connect("zoom", new PinchInput(scrollArea, {
                scale: 0.1,
                hammerManagerOptions: {
                    touchAction: "auto",
                },
            }));
        }
        axes.on("hold", e => {
            if (e.inputEvent) {
                e.inputEvent.preventDefault();
            }
        });
        axes.on("change", e => {
            if (e.pos.zoom === this.state.zoom) {
                return;
            }
            this.setState({
                zoom: e.pos.zoom,
            });

            if (e.inputEvent) {
                e.inputEvent.preventDefault();
            }
        });

        this.axes = axes;
    }
    private fold(index: number) {
        const {
            propertiesArea,
            valuesArea,
            keyframesArea,
        } = this.scrollArea;
        const selectedProperty = propertiesArea.properties[index];
        const foldedId = selectedProperty.props.id;

        console.log(foldedId);

        fold(propertiesArea, foldedId);
        fold(valuesArea, foldedId);
        fold(keyframesArea, foldedId);
    }
    private initClickProperty() {
        this.scrollArea.propertiesArea.getElement().addEventListener("click", e => {
            const isClickArrow = getTarget(e.target as HTMLElement, el => hasClass(el, "arrow"));
            const isClickRemove = getTarget(e.target as HTMLElement, el => hasClass(el, "remove"));
            const target = getTarget(e.target as HTMLElement, el => hasClass(el, "property"));

            if (!target) {
                return;
            }
            const properties = this.scrollArea.propertiesArea.properties;
            const index = this.scrollArea.propertiesArea.properties
                .map(property => property.getElement())
                .indexOf(target);

            if (index === -1) {
                return;
            }
            const selectedProperty = properties[index];

            if (isClickRemove) {
                this.removeProperty(selectedProperty.props.propertiesInfo);
            } else {
                this.select(selectedProperty.props.id);

                if (isClickArrow) {
                    this.fold(index);
                }
            }
        });
    }
    private initScroll() {
        let isScrollKeyframe = false;

        const headerKeyframesArea = this.headerArea.keytimesArea.getElement();
        const scrollKeyframesArea = this.scrollArea.keyframesArea.getElement();

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
    private initDragKeyframes() {
        const click = (e, clientX, clientY) => {
            const target = getTarget(e.target as HTMLElement, el => hasClass(el, "keyframe"));
            const time = target ? parseFloat(target.getAttribute("data-time")) : this.getTime(clientX);

            this.setTime(time);
            const list = this.scrollArea.keyframesArea.keyframesList;
            const index = findElementIndexByPosition(
                list.map(keyframes => keyframes.getElement()),
                clientY,
            );

            if (index > -1) {
                this.select(list[index].props.id, time);
            }
            e.preventDefault();
        };
        const dblclick = (e, clientX, clientY) => {
            const list = this.scrollArea.keyframesArea.keyframesList;
            const index = findElementIndexByPosition(
                list.map(keyframes => keyframes.getElement()),
                clientY,
            );

            if (index === -1) {
                return;
            }
            this.addKeyframe(index, this.getTime(clientX));
        };
        const keytimesScrollArea = this.headerArea.keytimesArea.scrollAreaElement;
        const keyframesScrollArea = this.scrollArea.keyframesArea.scrollAreaElement;
        let dragItem: Scene | SceneItem = null;
        let dragDelay: number = 0;
        let dragTarget: HTMLElement = null;
        [
            keytimesScrollArea,
            keyframesScrollArea,
        ].forEach(element => {
            drag(element, {
                container: window,
                dragstart: ({ inputEvent }) => {
                    dragTarget = getTarget(inputEvent.target, el => hasClass(el, "keyframe-group"));
                    if (dragTarget) {
                        const properties = this.scrollArea.propertiesArea.properties;
                        const keyframesElement = getTarget(dragTarget, el => hasClass(el, "keyframes"));
                        const id = keyframesElement.getAttribute("data-id");
                        const property = find(properties, p => p.props.id === id);
                        const propertiesInfo = property.props.propertiesInfo;

                        dragItem = propertiesInfo.item;
                        dragDelay = dragItem.getDelay();
                    }
                },
                drag: ({ distX, deltaX, deltaY, inputEvent }) => {
                    if (dragTarget) {
                        dragItem.setDelay(Math.max(dragDelay + this.getDistTime(distX), 0));
                        this.update();
                    } else {
                        this.scrollArea.keyframesArea.getElement().scrollLeft -= deltaX;
                        this.scrollArea.getElement().scrollTop -= deltaY;
                        inputEvent.preventDefault();
                    }
                },
                dragend: ({ isDrag, clientX, clientY, inputEvent }) => {
                    dragTarget = null;
                    dragItem = null;
                    dragDelay = null;
                    !isDrag && click(inputEvent, clientX, clientY);
                    dblCheck(isDrag, inputEvent, clientX, clientY, dblclick);
                },
            });
        });
    }
    private initFold() {
        // fold all
        this.scrollArea.propertiesArea.properties.forEach((property, i) => {
            const { keys, isParent } = property.props.propertiesInfo;

            if (keys.length === 1 && isParent) {
                console.log(property.props.id, i);
                this.fold(i);
            }
        });
    }
    private initKeyController() {
        window.addEventListener("blur", () => {
            this.setState({ alt: false });
        });

        // if (props.keyboard) {
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
                this.removeKeyframe(this.state.selectedProperty);
            })
            .keyup("esc", () => {
                this.finish();
            })
            .keyup("space", () => {
                this.togglePlay();
            });
    }
}
