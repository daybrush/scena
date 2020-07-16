import * as React from "react";
import Moveable from "react-moveable";
import { getContentElement } from "../utils/utils";
import Editor from "../Editor";

export default class MoveableManager extends React.PureComponent<{
    editor: Editor,
    selectedTargets: Array<HTMLElement | SVGElement>;
    selectedMenu: string,
    verticalGuidelines: number[],
    horizontalGuidelines: number[],
}> {
    public moveable = React.createRef<Moveable>();
    public getMoveable() {
        return this.moveable.current!;
    }
    public render() {
        const {
            editor,
            verticalGuidelines,
            horizontalGuidelines,
            selectedTargets,
            selectedMenu,
        } = this.props;
        // const

        const {
            moveableData,
            keyManager,
            eventBus,
            selecto,
            memory,
        } = editor;
        const elementGuidelines = [...moveableData.getTargets()].filter(el => {
            return selectedTargets.indexOf(el) === -1;
        });
        const isShift = keyManager.shiftKey;
        return <Moveable
            ref={this.moveable}
            targets={selectedTargets}
            draggable={true}
            resizable={true}
            throttleResize={1}
            clippable={selectedMenu === "Crop"}
            dragArea={selectedTargets.length > 1 || selectedMenu !== "Text"}
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
                    editor.selectMenu("Text");
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
                eventBus.requestTrigger("render", e);
            }}
            onRenderGroup={e => {
                eventBus.requestTrigger("renderGroup", e);
            }}
            onRenderEnd={e => {
                eventBus.requestTrigger("render", e);
            }}
            onRenderGroupEnd={e => {
                eventBus.requestTrigger("renderGroup", e);
            }}
        ></Moveable>
    }
    public componentDidMount() {
        const keyManager = this.props.editor.keyManager;

        keyManager.keydown(["shift"], () => {
            this.forceUpdate();
        });
        keyManager.keyup(["shift"], () => {
            this.forceUpdate();
        });
    }
}
