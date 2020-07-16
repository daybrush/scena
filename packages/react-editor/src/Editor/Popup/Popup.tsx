import * as React from "react";
import { prefix, connectEditorProps } from "../utils/utils";
import "./Popup.css";
import Editor from "../Editor";
import { EditorInterface } from "../types";
import KeyManager from "../KeyManager/KeyManager";

@connectEditorProps
export default class Popup extends React.PureComponent<{
    editor: Editor,
    onClose: () => any,
}> {
    public overlayElement = React.createRef<HTMLDivElement>();
    public popupKeyManager = new KeyManager(this.console);
    public render() {
        return <div ref={this.overlayElement} className={prefix("overlay")} onClick={this.onClick}>
            <div className={prefix("popup")}>
                <div className={prefix("close")} onClick={this.props.onClose}></div>
                {this.props.children}
            </div>
        </div>;
    }
    public componentDidMount() {
        this.keyManager.disable();
        this.popupKeyManager.keyup(["esc"], () => {
            this.props.onClose();
        });
    }
    public componentWillUnmount() {
        this.keyManager.enable();
        this.popupKeyManager.destroy();
    }
    public onClick = (e: any) => {
        e.stopPropagation();
        if (e.target === this.overlayElement.current) {
            this.props.onClose();
        }
    }
}


export default interface Popup extends EditorInterface {}
