// import * as React from "react";
import { MoveableManagerInterface, Renderer } from "react-moveable";
// import EditorManager from "../../EditorManager";

export interface DeleteButtonViewableProps {
    deleteButtonViewable?: boolean;
}
export const DeleteButtonViewable = {
    name: "deleteButtonViewable",
    props: ["deleteButtonViewable"],
    render(moveable: MoveableManagerInterface, React: Renderer) {
        const rect = moveable.getRect();
        const { pos2 } = moveable.state;

        const DeleteButton = moveable.useCSS(
            "div",
            `
        {
            position: absolute;
            left: 0px;
            top: 0px;
            will-change: transform;
            transform-origin: 0px 0px;
            width: 24px;
            height: 24px;
            background: #4af;
            background: var(--moveable-color);
            opacity: 0.9;
            border-radius: 4px;
        }
        :host:before, :host:after {
            content: "";
            position: absolute;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
            width: 16px;
            height: 2px;
            background: #fff;
            border-radius: 1px;
            cursor: pointer;
        }
        :host:after {
            transform: translate(-50%, -50%) rotate(-45deg);
        }
        `);
        // return (
        //     <EditorContext.Consumer key="delete-button-viewer">
        //         {(editor: Editor | null) => {
        //             return (
        //                 <DeleteButton
        //                     className={"moveable-delete-button"}
        //                     onClick={() => {
        //                         editor!.removeElements(editor!.getSelectedTargets());
        //                     }}
        //                     style={{
        //                         transform: `translate(${pos2[0]}px, ${pos2[1]}px) rotate(${rect.rotation}deg) translate(10px)`,
        //                     }}
        //                 />
        //             );
        //         }}
        //     </EditorContext.Consumer>
        // );
    },
} as const;
