import { TimelineProps, TimelineState } from "./types";
import ControlArea from "./HeaderArea/ControlArea";
import HeaderArea from "./HeaderArea/HeaderArea";
import ScrollArea from "./ScrollArea/ScrollArea";
import * as React from "react";
import { CSS, SUPPORT_TOUCH, SUPPORT_POINTER_EVENTS } from "./consts";
import {
    prefix,
    numberFormat,
    ref,
    getTarget, findElementIndexByPosition,
    hasClass, flatObject, isScene
} from "./utils";
import Axes, { PinchInput } from "@egjs/axes";
import KeyController from "keycon";
import Scene, { SceneItem } from "scenejs";
import { drag } from "@daybrush/drag";
import { dblCheck } from "./dblcheck";
import { getTimelineInfo } from "./TimelineInfo";
import { IObject, find, isUndefined } from "@daybrush/utils";
import PureProps from "react-pure-props";

let isExportCSS = false;

export default class Timeline extends PureProps<TimelineProps, TimelineState> {
    public static defaultProps = {
        keyboard: true,
    };
    public headerArea!: HeaderArea;
    public controlArea!: ControlArea;
    public scrollArea!: ScrollArea;
    public values: IObject<any> = {};
    public state: TimelineState = {
        alt: false,
        zoom: 1,
        maxDuration: 0,
        maxTime: 0,
        timelineInfo: {},
        selectedProperty: "",
        selectedTime: -1,
        init: false,
        updateTime: false,
    };
    private isExportCSS = false;
    private axes!: Axes;
    private keycon!: KeyController;
    constructor(props: any) {
        super(props);
        if (isExportCSS) {
            isExportCSS = true;
            this.isExportCSS = true;
        }

        this.state = { ...this.state, ...this.initScene(this.props.scene, false) };

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
            className,
            keyboard,
            onSelect,
            ...attributes
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
            <div
                className={prefix("timeline" + (alt ? " alt" : "")) + (className ? ` ${className}` : "")}
                {...attributes}>
                {this.renderStyle()}
                <ControlArea
                    ref={ref(this, "controlArea")}
                    scene={scene}
                    select={this.select}
                    prev={this.prev}
                    next={this.next}
                    setTime={this.setTime}
                    togglePlay={this.togglePlay}
                />
                <HeaderArea
                    ref={ref(this, "headerArea")}
                    scene={scene}
                    add={this.add}
                    axes={this.axes!}
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
                    keycon={this.keycon!}
                    axes={this.axes!}
                    maxDuration={maxDuration}
                    zoom={zoom}
                    maxTime={maxTime}
                    update={this.update}
                    select={this.select}
                    selectedProperty={selectedProperty}
                    selectedTime={selectedTime}
                    timelineInfo={timelineInfo}
                />
            </div>
        );
    }
    public componentDidMount() {
        this.initWheelZoom();
        this.initScroll();
        this.initDragKeyframes();
        this.initKeyController();
    }
    public componentDidUpdate(prevProps: TimelineProps, prevState: TimelineState) {
        const state = this.state;

        if (state.init) {
            state.init = false;
            this.scrollArea.foldAll();
        }
        if (prevProps.scene !== this.props.scene) {
            this.releaseScene(prevProps.scene);

            this.setState(this.initScene(this.props.scene, true));
        }
        if (state.updateTime) {
            state.updateTime = false;
            this.setTime();
        }
    }
    public componentWillUnmount() {
        if (this.isExportCSS) {
            isExportCSS = false;
        }
    }
    public update = (isInit: boolean = false) => {
        const scene = this.props.scene;

        if (!scene) {
            return;
        }
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
            updateTime: true,
            init: isInit,
        });

        this.axes.axm.set({ zoom: nextZoom });
    }
    public prev = () => {
        const scene = this.props.scene;

        scene && this.setTime(scene.getTime() - 0.05);
    }
    public next = () => {
        const scene = this.props.scene;

        scene && this.setTime(scene.getTime() + 0.05);
    }
    public finish = () => {
        const scene = this.props.scene;

        scene && scene.finish();
    }
    public togglePlay = () => {
        const scene = this.props.scene;
        if (!scene) {
            return;
        }
        if (scene.getPlayState() === "running") {
            scene.pause();
        } else {
            scene.play();
        }
    }
    public getValues() {
        return this.values;
    }
    private renderStyle() {
        if (!this.isExportCSS) {
            return <style>{CSS}</style>;
        }
    }
    private add = (item: Scene | SceneItem = this.props.scene!, properties: string[] = []) => {
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
    private setTime = (time?: number) => {
        const scene = this.props.scene;

        if (!scene) {
            return;
        }
        const direction = scene.getDirection();

        scene.pause();

        if (isUndefined(time)) {
            time = scene.getTime();
        }
        if (direction === "normal" || direction === "alternate") {
            scene.setTime(time);
        } else {
            scene.setTime(scene.getDuration() - time!);
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
    private moveCursor(time: number) {
        const maxTime = this.state.maxTime;
        const px = 15 - 30 * time / maxTime;
        const percent = 100 * time / maxTime;
        const left = `calc(${percent}% + ${px}px)`;

        this.scrollArea.keyframesArea.cursor.getElement().style.left = left;
        this.headerArea.keytimesArea.cursor.getElement().style.left = left;
    }
    private setInputs(obj: IObject<any>) {
        this.values = obj;
        const valuesArea = this.scrollArea.valuesArea.getElement();
        for (const name in obj) {
            valuesArea.querySelector<HTMLInputElement>(`[data-id="${name}"] input`)!.value = obj[name];
        }
    }
    private select = (property: string, time: number = -1, isNotUpdate?: boolean) => {
        const scene = this.props.scene;
        if (!scene) {
            return;
        }
        scene.pause();
        const state = this.state;

        if (this.props.onSelect) {
            const {
                selectedProperty: prevSelectedProperty,
                selectedTime: prevSelectedTime,
                timelineInfo,
            } = state;
            const propertiesInfo = timelineInfo[property]!;
            const selectedItem = property ? propertiesInfo.item : this.props.scene!;
            const selectedName = property ? propertiesInfo.names.join("///") : "";

            this.props.onSelect({
                selectedItem,
                selectedName,
                selectedProperty: property,
                selectedTime: time,
                prevSelectedProperty,
                prevSelectedTime,
            });
        }
        if (isNotUpdate) {
            state.selectedProperty = property;
            state.selectedTime = time;
        } else {
            this.setState({
                selectedProperty: property,
                selectedTime: time,
            });
        }
    }
    private editKeyframe = (index: number, value: any) => {
        const propertiesInfo = this.scrollArea.propertiesArea.properties[index].props.propertiesInfo;
        const isObjectData = propertiesInfo.isParent;

        if (isObjectData) {
            return;
        }
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
        const item = propertiesInfo.item!;

        item.remove(item.getIterationTime(), ...properties);
        this.update();
    }
    private addKeyframe(index: number, time: number) {
        const keyframesList = this.scrollArea.keyframesArea.keyframesList!;
        const {
            id,
        } = keyframesList[index].props;

        this.select(id, time);

        const inputElement = this.scrollArea.valuesArea.values[index].inputElement!;

        if (inputElement) {
            this.editKeyframe(index, inputElement.value);
        }
    }
    private animate = (e: any) => {
        const time = e.time;
        const minute = numberFormat(Math.floor(time / 60), 2);
        const second = numberFormat(Math.floor(time % 60), 2);
        const milisecond = numberFormat(Math.floor((time % 1) * 100), 3, true);

        this.moveCursor(time);
        this.setInputs(flatObject(e.frames || e.frame.get()));
        this.controlArea.timeArea.getElement().value = `${minute}:${second}:${milisecond}`;
    }
    private initScene(scene?: Scene | SceneItem, isInit?: boolean) {
        if (!scene) {
            return {
                timelineInfo: {},
                maxTime: 0,
                maxDuration: 0,
                zoom: 1,
                init: false,
            };
        }
        scene.finish();
        scene.on("animate", this.animate);
        const duration = Math.ceil(scene.getDuration());

        return {
            timelineInfo: getTimelineInfo(scene),
            maxTime: duration,
            maxDuration: duration,
            zoom: 1,
            init: isInit || false,
        };
    }
    private releaseScene(scene?: Scene | SceneItem) {
        if (!scene) {
            return;
        }
        scene.off("animate", this.animate);
    }
    private initWheelZoom() {
        const scrollArea = this.scrollArea.getElement();
        const axes = this.axes!;

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
        const click = (e: MouseEvent, clientX: number, clientY: number) => {
            const target = getTarget(e.target as HTMLElement, el => hasClass(el, "keyframe"));
            const time = target ? parseFloat(target.getAttribute("data-time") || "") : this.getTime(clientX);

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
        const dblclick = (e: MouseEvent, clientX: number, clientY: number) => {
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
        let dragItem: Scene | SceneItem | null;
        let dragDelay: number = 0;
        let dragTarget: HTMLElement | null;
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
                        const keyframesElement = getTarget(dragTarget, el => hasClass(el, "keyframes"))!;
                        const id = keyframesElement.getAttribute("data-id")!;
                        const property = find(properties, p => p.props.id === id)!;
                        const propertiesInfo = property.props.propertiesInfo;

                        dragItem = propertiesInfo.item;
                        dragDelay = dragItem.getDelay();
                    }
                },
                drag: ({ distX, deltaX, deltaY, inputEvent }) => {
                    if (dragTarget) {
                        dragItem!.setDelay(Math.max(dragDelay + this.getDistTime(distX), 0));
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
                    dragDelay = 0;
                    !isDrag && click(inputEvent, clientX, clientY);
                    dblCheck(isDrag, inputEvent, clientX, clientY, dblclick);
                },
            });
        });
    }
    private initKeyController() {
        window.addEventListener("blur", () => {
            if (this.state.alt === true) {
                this.setState({ alt: false });
            }
        });

        if (this.props.keyboard) {
            this.keycon!.keydown("space", ({ inputEvent }) => {
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
}
