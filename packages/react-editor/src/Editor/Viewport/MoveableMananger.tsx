import * as React from "react";
import Moveable from "react-moveable";
import MoveableData from "../utils/MoveableData";
import Memory from "../utils/Memory";
import { getContentElement } from "../utils/utils";
import EventBus from "../utils/EventBus";
import Menu from "../Menu/Menu";
import Selecto from "react-selecto";
import { keydown, keyup } from "../KeyManager/KeyManager";
import KeyController from "keycon";

export default class MoveableManager extends React.PureComponent<{
    selectedMenu: string,
    targets: Array<HTMLElement | SVGElement>,
    menu: React.RefObject<Menu>,
    selecto: React.RefObject<Selecto>,
    verticalGuidelines: number[],
    horizontalGuidelines: number[],
}> {
    public moveable = React.createRef<Moveable>();
    public getMoveable() {
        return this.moveable.current!;
    }
    public render() {
        const {
            selectedMenu, targets, menu, selecto,
            verticalGuidelines,
            horizontalGuidelines,
        } = this.props;
        // const

        const elementGuidelines = [...MoveableData.getTargets()].filter(el => {
            return targets.indexOf(el) === -1;
        });
        const isShift = KeyController.global.shiftKey;
        return <Moveable
            ref={this.moveable}
            targets={targets}
            draggable={true}
            resizable={true}
            throttleResize={1}
            clippable={selectedMenu === "Crop"}
            dragArea={targets.length > 1 || selectedMenu !== "Text"}
            checkInput={selectedMenu === "Text"}
            throttleDragRotate={isShift ? 45 : 0}
            keepRatio={isShift}
            rotatable={true}
            snappable={true}
            snapCenter={true}
            snapGap={false}
            roundable={true}
            verticalGuidelines={verticalGuidelines}
            horizontalGuidelines={horizontalGuidelines}
            elementGuidelines={elementGuidelines}
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
            onClickGroup={e => {
                selecto.current!.clickTarget(e.inputEvent, e.inputTarget);
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
    }
    public componentDidMount() {
        keydown(["shift"], () => {
            this.forceUpdate();
        });
        keyup(["shift"], () => {
            this.forceUpdate();
        });
    }
}
