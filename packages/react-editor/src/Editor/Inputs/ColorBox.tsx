import * as React from "react";
import Input from "./Input";
import { IObject, } from "@daybrush/utils";
import { prefix } from "../utils/utils";
import ColorPicker from "./ColorPicker";
import TextBox from "./TextBox";
import "./ColorBox.css";

export default class ColorBox extends Input<{}, {}, HTMLDivElement> {
    protected inputAttributes: IObject<any> = {};
    protected colorInput = React.createRef<ColorPicker>();
    protected textInput = React.createRef<TextBox>();
    public state = {
        display: "none",
        color: "#fff",
    };
    public render() {
        return (
            <div className={prefix("color-input")} ref={this.input} onBlur={this.onBlur}>
                <div className={prefix("color-background")} style={{
                    backgroundColor: this.state.color,
                }} onClick={this.onClick}></div>
                <TextBox
                    ref={this.textInput}
                    onChange={this.onChange}
                    inputProps={{
                        onFocus: this.onFocus,
                    }}
                ></TextBox>
                {this.renderPicker()}
            </div>
        );
    }
    public renderPicker() {
        const {
            display,
        } = this.state;

        if (display === "none") {
            return;
        }
        return <div className={prefix("color-picker")}
            onMouseDown={this.onDragStart} onTouchStart={this.onDragStart}
            style={{
                display,
            }}>
            <ColorPicker
                ref={this.colorInput}
                onChange={this.onChange} />
        </div>;
    }
    public setValue(v: string) {
        this.setState({
            color: v,
        })
        this.textInput.current!.setValue(v);
        if (this.colorInput.current!) {
            this.colorInput.current!.setValue(v);
        }
    }
    public getValue() {
        return this.textInput.current!.getValue();
    }
    public onFocus = () => {
        this.setState({
            display: "block",
        });
    }
    public onBlur = (e: any) => {
        const relatedTarget = e.nativeEvent.relatedTarget;

        if (this.input.current!.contains(relatedTarget)) {
            return;
        }
        this.setState({
            display: "none",
        });
    }
    private onChange = (v: string) => {
        this.props.onChange(v);
    }
    private onDragStart = (e: any) => {
        if (e.target.tagName === "INPUT") {
            return;
        }
        e.preventDefault();
    }
    private onClick = (e: any) => {
        this.textInput.current!.input.current!.focus();
    }
}
