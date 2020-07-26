import * as React from "react";
import * as ReactDOM from "react-dom";
import Icon from "./Icon";
import { prefix } from "../utils/utils";
import Popup from "../Popup/Popup";

export default class KeyboardIcon extends Icon {
    public static id = "Shortcuts";
    public keys = ["s"];
    public state = {
        renderPopup: false,
    }
    public renderIcon() {
        return (
            <div className={prefix("i")}>
                <div className={prefix("keyboard")}>
                    <div className={prefix("key")}></div>
                    <div className={prefix("key")}></div>
                    <div className={prefix("key")}></div>
                    <div className={prefix("key")}></div>
                    <div className={prefix("key")}></div>
                    <div className={prefix("key")}></div>
                    <div className={prefix("key")}></div>
                    <div className={prefix("space")}></div>
                </div>
                {this.state.renderPopup && this.renderPopup()}
            </div>
        );
    }
    public renderPopup() {
        return ReactDOM.createPortal(<Popup editor={this.editor} onClose={this.onClose}>
            <h2>Shortcuts</h2>
            <ul className={prefix("key-list")}>
                {this.keyManager.keylist.map(([keys, description]) => {
                    return <li key={keys.join("+")}>
                        <p className={prefix("key-description")}>{description} <strong>{keys.map(key => <span key={key}>{key}</span>)}</strong></p>
                    </li>
                })}
            </ul>
        </Popup>, this.editor.editorElement.current!);
    }
    public onClick = () => {
        this.setState({
            renderPopup: true,
        })
    }
    public onClose = () => {
        this.setState({
            renderPopup: false,
        })
    }
}
