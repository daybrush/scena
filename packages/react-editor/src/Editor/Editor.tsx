import * as React from "react";
import InfiniteViewer from "react-infinite-viewer";
import Guides from "@scena/react-guides";
import Selecto, { Rect } from "react-selecto";
import keycon from "keycon";
import "./Editor.css";
import Menu from "./Menu/Menu";
import Viewport from "./Viewport/Viewport";
import { getContentElement, prefix } from "./utils/utils";
import Tabs from "./Tabs/Tabs";
import EventBus from "./utils/EventBus";
import { IObject } from "@daybrush/utils";
import Memory from "./utils/Memory";
import KeyController from "keycon";
import MoveableManager from "./Viewport/MoveableMananger";
import { keyup } from "./KeyManager/KeyManager";
import MoveableData, { getTargets } from "./utils/MoveableData";


EventBus.on("setTargets", ({ targets }) => {
    Memory.set("targets", targets);
});


export class Editor extends React.PureComponent<{
    width: number,
    height: number,
}> {
    public static defaultProps = {
        width: 400,
        height: 600,
    };
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
    public moveableManager = React.createRef<MoveableManager>();
    public viewport = React.createRef<Viewport>();
    public render() {
        const {
            horizontalGuides,
            verticalGuides,
            infiniteViewer,
            moveableManager,
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
        const {
            width,
            height,
        } = this.props;
        const horizontalSnapGuides = [0, height, height / 2, ...state.horizontalGuides];
        const verticalSnapGuides = [0, width, width / 2, ...state.verticalGuides];
        return (
            <div className={prefix("editor")}>
                <Tabs moveableManager={moveableManager}></Tabs>
                <Menu ref={menu} onSelect={this.onMenuChange} />
                <div className={prefix("reset")} onClick={e => {
                    infiniteViewer.current!.scrollCenter();
                }}></div>
                <Guides ref={horizontalGuides}
                    type="horizontal" className={prefix("guides", "horizontal")} style={{}}
                    snapThreshold={5}
                    snaps={horizontalSnapGuides}
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
                    type="vertical" className={prefix("guides", "vertical")} style={{}}
                    snapThreshold={5}
                    snaps={verticalSnapGuides}
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
                    className={prefix("viewer")}
                    usePinch={true}
                    pinchThreshold={50}
                    zoom={zoom}
                    onDragStart={e => {
                        const target = e.inputEvent.target;
                        this.checkBlur();

                        if (
                            target.nodeName === "A"
                            || moveableManager.current!.getMoveable().isMoveableElement(target)
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
                    <Viewport ref={viewport} style={{
                        width: `${width}px`,
                        height: `${height}px`,
                    }}>
                        <MoveableManager
                            ref={moveableManager}
                            targets={targets}
                            selectedMenu={selectedMenu}
                            selecto={selecto}
                            menu={menu}
                            verticalGuidelines={verticalSnapGuides}
                            horizontalGuidelines={horizontalSnapGuides}
                        ></MoveableManager>
                    </Viewport>
                </InfiniteViewer>
                <Selecto
                    ref={selecto}
                    dragContainer={".scena-viewer"}
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
                            (inputEvent.type === "touchstart" && e.isTrusted)
                            || moveableManager.current!.getMoveable().isMoveableElement(target)
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
                            moveableManager.current!.getMoveable().dragStart(inputEvent);
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
    public appendJSXs(jsxs: Array<{ jsx: any, name: string, frame: IObject<any> }>): Promise<Array<HTMLElement | SVGElement>> {
        return this.viewport.current!.appendJSXs(jsxs).then(targets => {
            this.setTargets([targets[0]]);

            return targets;
        });
    }
    public appendElements(elements: Array<{ tag: any, props: IObject<any>, name: string, frame: IObject<any> }>): Promise<Array<HTMLElement | SVGElement>> {
        return this.viewport.current!.appendElements(elements).then(targets => {
            this.setTargets([targets[0]]);

            return targets;
        });
    }
    public removeElements(targets: Array<HTMLElement | SVGElement>) {
        const currentTargets = getTargets();
        const nextTargets = currentTargets.filter(target => {
            return targets.indexOf(target) === -1;
        });
        targets.forEach(target => {
            MoveableData.removeFrame(target);
        });
        return this.setTargets(nextTargets).then(() => {
            this.viewport.current!.removeTargets(targets);
        });
    }
    public componentDidMount() {
        const {
            infiniteViewer,
        } = this;
        requestAnimationFrame(() => {
            infiniteViewer.current!.scrollCenter();
        });
        keycon.setGlobal();
        window.addEventListener("resize", this.onResize);
        window.addEventListener("wheel", this.onWheel, {
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

        keyup(["backspace"], () => {
            this.removeElements(getTargets());
        });
    }
    public componentWillUnmount() {
        EventBus.off();
        Memory.clear();
        KeyController.global.destroy();
        window.removeEventListener("resize", this.onResize);
        window.removeEventListener("wheel", this.onWheel);
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
        if (activeElement) {
            (activeElement as HTMLElement).blur();
        }
        const selection = document.getSelection()!;

        if (selection) {
            selection.removeAllRanges();
        }
        // if (activeElement && (
        //     activeElement.tagName === "INPUT" ||
        //     activeElement.tagName === "TEXTAREA"
        //     || (activeElement as any).isContentEditable
        // )) {


        // }
        EventBus.trigger("blur");
    }
    private onResize = () => {
        this.horizontalGuides.current!.resize();
        this.verticalGuides.current!.resize();
    }
    private onWheel = (e: any) => {
        if (keycon.global.altKey) {
            e.preventDefault();
            this.setState({
                zoom: Math.max(0.1, this.state.zoom + e.deltaY / 300),
            });
        }
    }
}
