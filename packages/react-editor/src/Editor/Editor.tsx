import * as React from "react";
import InfiniteViewer from "react-infinite-viewer";
import Guides from "@scena/react-guides";
import Selecto, { Rect } from "react-selecto";
import Moveable from "react-moveable";
import keycon from "keycon";
import "./Editor.css";
import Menu from "./Menu/Menu";
import Viewport from "./Viewport/Viewport";
import { getContentElement } from "./utils/utils";
import Tabs from "./Tabs/Tabs";
import EventBus from "./utils/EventBus";
import { IObject } from "@daybrush/utils";
import MoveableData from "./utils/MoveableData";
import Memory from "./utils/Memory";
import KeyController from "keycon";


EventBus.on("setTargets", ({ targets }) => {
    Memory.set("targets", targets);
});


export class Editor extends React.Component {
    public state: {
        targets: Array<SVGElement | HTMLElement>,
        horizontalGuides: number[],
        verticalGuides: number[],
        selectedMenu: string,
        zoom: number,
    } = {
            targets: [],
            horizontalGuides: [],
            verticalGuides: [],
            zoom: 1,
            selectedMenu: "MoveTool",
        };
    public horizontalGuides = React.createRef<Guides>();
    public verticalGuides = React.createRef<Guides>();
    public infiniteViewer = React.createRef<InfiniteViewer>();
    public selecto = React.createRef<Selecto>();
    public menu = React.createRef<Menu>();
    public moveable = React.createRef<Moveable>();
    public viewport = React.createRef<Viewport>();
    public render() {
        const {
            horizontalGuides,
            verticalGuides,
            infiniteViewer,
            moveable,
            viewport,
            menu,
            selecto,
            state,
        } = this;
        const {
            selectedMenu,
            targets,
            zoom,
        } = state;

        return (
            <div className="editor">
                <Tabs moveable={moveable}></Tabs>
                <Menu ref={menu} onSelect={this.onMenuChange} />
                <div className="reset" onClick={e => {
                    infiniteViewer.current!.scrollCenter();
                }}></div>
                <Guides ref={horizontalGuides}
                    type="horizontal" className="guides horizontal" style={{}}
                    snapThreshold={5}
                    snaps={state.horizontalGuides}
                    displayDragPos={true}
                    dragPosFormat={v => `${v}px`}
                    zoom={zoom}
                    onChangeGuides={e => {
                        this.setState({
                            horizontalGuides: e.guides,
                        });
                    }}
                ></Guides>
                <Guides ref={verticalGuides}
                    type="vertical" className="guides vertical" style={{}}
                    snapThreshold={5}
                    snaps={state.verticalGuides}
                    displayDragPos={true}
                    dragPosFormat={v => `${v}px`}
                    zoom={zoom}
                    onChangeGuides={e => {
                        this.setState({
                            verticalGuides: e.guides,
                        });
                    }}
                ></Guides>
                <InfiniteViewer ref={infiniteViewer}
                    className="viewer"
                    usePinch={true}
                    pinchThreshold={50}
                    zoom={zoom}
                    onDragStart={e => {
                        const target = e.inputEvent.target;
                        this.checkBlur();

                        if (
                            target.nodeName === "A"
                            || moveable.current!.isMoveableElement(target)
                            || targets.some(t => t === target || t.contains(target))
                        ) {
                            e.stop();
                        }
                    }}
                    onDragEnd={e => {
                        if (!e.isDrag) {
                            selecto.current!.clickTarget(e.inputEvent);
                        }
                    }}
                    onAbortPinch={e => {
                        selecto.current!.triggerDragStart(e.inputEvent);
                    }}
                    onScroll={e => {
                        horizontalGuides.current!.scroll(e.scrollLeft);
                        horizontalGuides.current!.scrollGuides(e.scrollTop);

                        verticalGuides.current!.scroll(e.scrollTop);
                        verticalGuides.current!.scrollGuides(e.scrollLeft);
                    }}
                    onPinch={e => {
                        this.setState({
                            zoom: e.zoom,
                        });
                    }}
                >
                    <Viewport ref={viewport}>
                        <Moveable
                            ref={moveable}
                            targets={targets}
                            draggable={true}
                            resizable={true}
                            throttleResize={1}
                            clippable={selectedMenu === "Crop"}
                            dragArea={targets.length > 1 || selectedMenu !== "Text"}
                            checkInput={selectedMenu === "Text"}
                            rotatable={true}
                            snappable={true}
                            snapCenter={true}
                            roundable={true}
                            verticalGuidelines={state.verticalGuides}
                            horizontalGuidelines={state.horizontalGuides}
                            clipArea={true}
                            onDragStart={MoveableData.onDragStart}
                            onDrag={MoveableData.onDrag}
                            onDragGroupStart={MoveableData.onDragGroupStart}
                            onDragGroup={MoveableData.onDragGroup}

                            onScaleStart={MoveableData.onScaleStart}
                            onScale={MoveableData.onScale}
                            onScaleGroupStart={MoveableData.onScaleGroupStart}
                            onScaleGroup={MoveableData.onScaleGroup}

                            onResizeStart={MoveableData.onResizeStart}
                            onResize={MoveableData.onResize}
                            onResizeGroupStart={MoveableData.onResizeGroupStart}
                            onResizeGroup={MoveableData.onResizeGroup}

                            onRotateStart={MoveableData.onRotateStart}
                            onRotate={MoveableData.onRotate}
                            onRotateGroupStart={MoveableData.onRotateGroupStart}
                            onRotateGroup={MoveableData.onRotateGroup}

                            defaultClipPath={Memory.get("crop") || "inset"}
                            onClip={MoveableData.onClip}

                            onDragOriginStart={MoveableData.onDragOriginStart}
                            onDragOrigin={e => {
                                MoveableData.onDragOrigin(e);
                            }}

                            onRound={MoveableData.onRound}

                            onClick={e => {
                                const target = e.inputTarget as any;
                                if (e.isDouble && target.isContentEditable) {
                                    menu.current!.select("Text");
                                    const el = getContentElement(target);

                                    if (el) {
                                        el.focus();
                                    }
                                }
                            }}
                            onRender={e => {
                                EventBus.requestTrigger("render", e);
                            }}
                            onRenderGroup={e => {
                                EventBus.requestTrigger("renderGroup", e);
                            }}
                            onRenderEnd={e => {
                                EventBus.requestTrigger("render", e);
                            }}
                            onRenderGroupEnd={e => {
                                EventBus.requestTrigger("renderGroup", e);
                            }}
                        ></Moveable>
                    </Viewport>
                </InfiniteViewer>
                <Selecto
                    ref={selecto}
                    dragContainer={".viewer"}
                    hitRate={0}
                    selectableTargets={["[data-moveable]"]}
                    selectByClick={true}
                    selectFromInside={false}
                    toggleContinueSelect={["shift"]}
                    preventDefault={true}
                    scrollOptions={
                        infiniteViewer.current ? {
                            container: infiniteViewer.current.getContainer(),
                            threshold: 30,
                            throttleTime: 30,
                            getScrollPosition: () => {
                                const current = infiniteViewer.current!;
                                return [
                                    current.getScrollLeft(),
                                    current.getScrollTop(),
                                ];
                            },
                        } : undefined
                    }
                    onDragStart={e => {
                        const inputEvent = e.inputEvent;
                        const target = inputEvent.target;

                        this.checkBlur();
                        if (selectedMenu === "Text" && target.isContentEditable) {
                            const contentElement = getContentElement(target);

                            if (contentElement && contentElement.hasAttribute("data-moveable")) {
                                e.stop();
                                this.setTargets([contentElement]);
                            }
                        }
                        if (
                            inputEvent.type === "touchstart"
                            || moveable.current!.isMoveableElement(target)
                            || state.targets.some(t => t === target || t.contains(target))
                        ) {
                            e.stop();
                        }
                    }}
                    onScroll={({ direction }) => {
                        infiniteViewer.current!.scrollBy(direction[0] * 10, direction[1] * 10);
                    }}
                    onSelectEnd={({ isDragStart, selected, inputEvent, rect }) => {
                        if (isDragStart) {
                            inputEvent.preventDefault();
                        }
                        if (this.selectEndMaker(rect)) {
                            return;
                        }
                        this.setTargets(selected).then(() => {
                            if (!isDragStart) {
                                return;
                            }
                            moveable.current!.dragStart(inputEvent);
                        });
                    }}
                ></Selecto>
            </div>
        );
    }
    public promiseState(state: IObject<any>) {
        return new Promise(resolve => {
            this.setState(state, () => {
                resolve();
            });
        });
    }
    public setTargets(targets: Array<HTMLElement | SVGElement>) {
        return this.promiseState({
            targets,
        }).then(() => {
            EventBus.requestTrigger("setTargets", { targets });
        });
    }
    public appendJSX(jsx: any, name: string, frame: IObject<any> = {}) {
        return this.viewport.current!.appendJSX(jsx, name, frame).then(target => {
            this.setTargets([target]);

            return target;
        });
    }
    public appendElement(tag: any, props: IObject<any>, name: string, frame: IObject<any> = {}) {
        return this.viewport.current!.appendElement(tag, props, name, frame).then(target => {
            this.setTargets([target]);

            return target;
        });
    }

    public componentDidMount() {
        const {
            infiniteViewer,
        } = this;
        requestAnimationFrame(() => {
            infiniteViewer.current!.scrollCenter();
        });

        window.addEventListener("resize", this.onResize);
        keycon.setGlobal();
        window.addEventListener("wheel", e => {
            if (keycon.global.altKey) {
                e.preventDefault();
                this.setState({
                    zoom: Math.max(0.1, this.state.zoom + e.deltaY / 300),
                });
            }
        }, {
            passive: false,
        });
        const viewport = this.viewport.current!


        EventBus.on("selectLayers", (e: any) => {
            const selected = e.selected as string[];

            this.setTargets(selected.map(key => viewport.getInfo(key)!.el!));
        });
        EventBus.on("update", () => {
            this.forceUpdate();
        });
    }
    public componentWillUnmount() {
        EventBus.off();
        Memory.clear();
        KeyController.global.destroy();
    }
    private onMenuChange = (id: string) => {
        this.setState({
            selectedMenu: id,
        });
    }
    private selectEndMaker(rect: Rect) {
        const infiniteViewer = this.infiniteViewer.current!;
        const selectIcon = this.menu.current!.getSelected();
        const width = rect.width;
        const height = rect.height;

        if (!selectIcon || !selectIcon.maker || !width || !height) {
            return false;
        }
        const maker = selectIcon.maker();
        const scrollTop = -infiniteViewer.getScrollTop() + 30;
        const scrollLeft = -infiniteViewer.getScrollLeft() + 75;
        const top = rect.top - scrollTop;
        const left = rect.left - scrollLeft;


        const style = {
            top: `${top}px`,
            left: `${left}px`,
            position: "absolute",
            width: `${width}px`,
            height: `${height}px`,
            ...maker.style,
        } as any;
        this.appendElement(maker.tag, maker.props, `(${selectIcon.id})`, style).then(selectIcon.makeThen);
        return true;
    }
    private checkBlur() {
        const activeElement = document.activeElement;
        if (activeElement && (
            activeElement.tagName === "INPUT"
            || (activeElement as any).isContentEditable
        )) {
            (activeElement as any).blur();
        }
        EventBus.trigger("blur");
    }
    private onResize = () => {
        this.horizontalGuides.current!.resize();
        this.verticalGuides.current!.resize();
    }
}
