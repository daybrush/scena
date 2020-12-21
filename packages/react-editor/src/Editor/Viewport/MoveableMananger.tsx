import * as React from "react";
import Moveable, { MoveableManagerInterface } from "react-moveable";
import { getContentElement, getId } from "../utils/utils";
import Editor from "../Editor";
import { EditorInterface } from "../types";
import { IObject } from "@daybrush/utils";
import { diff } from "@egjs/list-differ";
import { connectEditorContext } from "../decorators/ConnectEditorContext";
import { DimensionViewableProps, DimensionViewable } from "./ables/DimensionViewable";
import { DelteButtonViewable, DelteButtonViewableProps } from "./ables/DeleteButtonViewable";

function restoreRender(id: string, state: IObject<any>, prevState: IObject<any>, orders: any, editor: Editor) {
    const el = editor.viewport.current!.getElement(id);

    if (!el) {
        console.error("No Element");
        return false;
    }
    const moveableData = editor.moveableData;
    const frame = moveableData.getFrame(el);;

    frame.clear();
    frame.set(state);
    frame.setOrderObject(orders);

    const result = diff(Object.keys(prevState), Object.keys(state));
    const { removed, prevList } = result;

    removed.forEach(index => {
        el.style.removeProperty(prevList[index]);
    });
    moveableData.render(el);
    return true;
}
function undoRender({ id, prev, next, prevOrders }: IObject<any>, editor: Editor) {
    if (!restoreRender(id, prev, next, prevOrders, editor)) {
        return;
    }
    editor.moveableManager.current!.updateRect();
    editor.eventBus.trigger("render");
}
function redoRender({ id, prev, next, nextOrders }: IObject<any>, editor: Editor) {
    if (!restoreRender(id, next, prev, nextOrders, editor)) {
        return;
    }
    editor.moveableManager.current!.updateRect();
    editor.eventBus.trigger("render");
}
function undoRenders({ infos }: IObject<any>, editor: Editor) {
    infos.forEach(({ id, prev, next, prevOrders }: IObject<any>) => {
        restoreRender(id, prev, next, prevOrders, editor);
    });
    editor.moveableManager.current!.updateRect();
    editor.eventBus.trigger("render");
}
function redoRenders({ infos }: IObject<any>, editor: Editor) {
    infos.forEach(({ id, next, prev, nextOrders }: IObject<any>) => {
        restoreRender(id, next, prev, nextOrders, editor);
    });
    editor.moveableManager.current!.updateRect();
    editor.eventBus.trigger("render");
}

@connectEditorContext
export default class MoveableManager extends React.PureComponent<{
    selectedTargets: Array<HTMLElement | SVGElement>;
    selectedMenu: string,
    verticalGuidelines: number[],
    horizontalGuidelines: number[],
    zoom: number,
}> {
    public moveable = React.createRef<Moveable>();
    public getMoveable() {
        return this.moveable.current!;
    }
    public render() {
        const {
            verticalGuidelines,
            horizontalGuidelines,
            selectedTargets,
            selectedMenu,
            zoom,
        } = this.props;
        // const

        if (!selectedTargets.length) {
            return this.renderViewportMoveable();
        }
        const moveableData = this.moveableData;
        const memory = this.memory;
        const elementGuidelines = [document.querySelector(".scena-viewport")]; //[...moveableData.getTargets()].filter(el => {
        //     return selectedTargets.indexOf(el) === -1;
        // });

        console.log(verticalGuidelines, horizontalGuidelines);
        const isShift = this.keyManager.shiftKey;

        return <Moveable<DimensionViewableProps & DelteButtonViewableProps>
            ables={[DimensionViewable, DelteButtonViewable]}
            ref={this.moveable}
            targets={selectedTargets}
            dimensionViewable={true}
            deleteButtonViewable={true}
            draggable={true}
            resizable={true}
            pinchable={["rotatable"]}
            zoom={1 / zoom}
            throttleResize={1}
            clippable={selectedMenu === "Crop"}
            passDragArea={selectedMenu === "Text"}
            checkInput={selectedMenu === "Text"}
            throttleDragRotate={isShift ? 45 : 0}
            keepRatio={selectedTargets.length > 1 ? true : isShift}
            rotatable={true}
            snappable={true}
            snapCenter={true}
            snapGap={false}
            roundable={true}
            verticalGuidelines={verticalGuidelines}
            horizontalGuidelines={horizontalGuidelines}
            elementGuidelines={elementGuidelines as any}
            clipArea={true}
            clipVerticalGuidelines={[0, "50%", "100%"]}
            clipHorizontalGuidelines={[0, "50%", "100%"]}
            clipTargetBounds={true}

            onBeforeRenderStart={moveableData.onBeforeRenderStart}
            onBeforeRenderGroupStart={moveableData.onBeforeRenderGroupStart}
            onDragStart={moveableData.onDragStart}
            onDrag={moveableData.onDrag}
            onDragGroupStart={moveableData.onDragGroupStart}
            onDragGroup={moveableData.onDragGroup}

            onScaleStart={moveableData.onScaleStart}
            onScale={moveableData.onScale}
            onScaleGroupStart={moveableData.onScaleGroupStart}
            onScaleGroup={moveableData.onScaleGroup}

            onResizeStart={moveableData.onResizeStart}
            onResize={moveableData.onResize}
            onResizeGroupStart={moveableData.onResizeGroupStart}
            onResizeGroup={moveableData.onResizeGroup}

            onRotateStart={moveableData.onRotateStart}
            onRotate={moveableData.onRotate}
            onRotateGroupStart={moveableData.onRotateGroupStart}
            onRotateGroup={moveableData.onRotateGroup}

            defaultClipPath={memory.get("crop") || "inset"}
            onClip={moveableData.onClip}

            onDragOriginStart={moveableData.onDragOriginStart}
            onDragOrigin={e => {
                moveableData.onDragOrigin(e);
            }}

            onRound={moveableData.onRound}

            onClick={e => {
                const target = e.inputTarget as any;

                if (e.isDouble && target.isContentEditable) {
                    this.selectMenu("Text");
                    const el = getContentElement(target);

                    if (el) {
                        el.focus();
                    }
                } else {
                    this.getSelecto().clickTarget(e.inputEvent, e.inputTarget);
                }
            }}
            onClickGroup={e => {
                this.getSelecto().clickTarget(e.inputEvent, e.inputTarget);
            }}
            onRenderStart={e => {
                e.datas.prevData = moveableData.getFrame(e.target).get();
            }}
            onRender={e => {
                e.datas.isRender = true;
                this.eventBus.requestTrigger("render");
            }}
            onRenderEnd={e => {
                this.eventBus.requestTrigger("render");

                if (!e.datas.isRender) {
                    return;
                }
                this.historyManager.addAction("render", {
                    id: getId(e.target),
                    prev: e.datas.prevData,
                    next: moveableData.getFrame(e.target).get(),
                });
            }}
            onRenderGroupStart={e => {
                e.datas.prevDatas = e.targets.map(target => moveableData.getFrame(target).get());
            }}
            onRenderGroup={e => {
                this.eventBus.requestTrigger("renderGroup", e);
                e.datas.isRender = true;
            }}
            onRenderGroupEnd={e => {
                this.eventBus.requestTrigger("renderGroup", e);

                if (!e.datas.isRender) {
                    return;
                }
                const prevDatas = e.datas.prevDatas;
                const infos = e.targets.map((target, i) => {
                    return {
                        id: getId(target),
                        prev: prevDatas[i],
                        next: moveableData.getFrame(target).get(),
                    }
                });
                this.historyManager.addAction("renders", {
                    infos,
                });
            }}
        ></Moveable>
    }
    public renderViewportMoveable() {
        const moveableData = this.moveableData;
        const viewport = this.getViewport();
        const target = viewport ? viewport.viewportRef.current! : null;

        return <Moveable
            ref={this.moveable}
            // rotatable={true}
            target={target}
            origin={false}
            onRotateStart={moveableData.onRotateStart}
            onRotate={moveableData.onRotate}
        ></Moveable>
    }
    public componentDidMount() {
        this.historyManager.registerType("render", undoRender, redoRender);
        this.historyManager.registerType("renders", undoRenders, redoRenders);
        this.keyManager.keydown(["shift"], () => {
            this.forceUpdate();
        });
        this.keyManager.keyup(["shift"], () => {
            this.forceUpdate();
        });
    }
    public updateRect() {
        this.getMoveable().updateRect();
    }
}
export default interface MoveableManager extends EditorInterface { }
