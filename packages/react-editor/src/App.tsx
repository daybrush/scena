import * as React from "react";
import InfiniteViewer from "react-infinite-viewer";
import Guides from "@scena/react-guides";
import Selecto from "react-selecto";
import Moveable from "react-moveable";
import keycon from "keycon";
import "./App.css";
import Menu from "./Editor/Menu/Menu";
import Viewport from "./Editor/Viewport/Viewport";
import { getContentElement } from "./utils";
import Tabs from "./Editor/Tabs/Tabs";
import EventBus from "./Editor/EventBus";
import { IObject } from "@daybrush/utils";
import MoveableData from "./Editor/MoveableData";

class App extends React.Component {
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

        (window as any).a = this;

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
                        <p className="logo"><img src="https://daybrush.com/infinite-viewer/images/logo.png" data-moveable /></p>
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
                            verticalGuidelines={state.verticalGuides}
                            horizontalGuidelines={state.horizontalGuides}

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

                            defaultClipPath={"circle"}
                            onClip={MoveableData.onClip}

                            onDragOriginStart={MoveableData.onDragOriginStart}
                            onDragOrigin={e => {
                                console.log(e);
                                MoveableData.onDragOrigin(e);
                            }}

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

                        if (
                            selectedMenu === "Text"
                            && target.isContentEditable
                        ) {
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
                    onSelect={e => {
                        console.log(e.rect);
                    }}
                    onScroll={({ direction }) => {
                        infiniteViewer.current!.scrollBy(direction[0] * 10, direction[1] * 10);
                    }}
                    onSelectEnd={({ isDragStart, selected, inputEvent, rect }) => {
                        if (isDragStart) {
                            inputEvent.preventDefault();
                        }
                        if (selectedMenu === "Text") {
                            const container = document.querySelector(".viewport")!.getBoundingClientRect();

                            const top = rect.top - container.top;
                            const left = rect.left - container.left;
                            const width = rect.width;
                            const height = rect.height;

                            if (width && height) {
                                const style = {
                                    top: `${top}px`,
                                    left: `${left}px`,
                                    position: "absolute",
                                    width: `${width}px`,
                                    height: `${height}px`,
                                } as any;
                                viewport.current!.appendElement("div", {
                                    contentEditable: true,
                                }, style).then(target => {
                                    this.setTargets([target]);
                                    target.focus();
                                });
                                return;
                            }
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
    public componentDidMount() {
        const {
            horizontalGuides,
            verticalGuides,
            infiniteViewer,
        } = this;
        requestAnimationFrame(() => {
            infiniteViewer.current!.scrollCenter();
        });

        window.addEventListener("resize", () => {
            horizontalGuides.current!.resize();
            verticalGuides.current!.resize();
        });
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
    }
    private onMenuChange = (id: string) => {
        this.setState({
            selectedMenu: id,
        });
    }
}

export default App;
