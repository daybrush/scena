import * as React from "react";
import { ChromePicker, ColorResult } from "react-color";
import Input from "./Input";
import { ref, prefix } from "../utils";
import TextBox from "./TextBox";

export default class ColorBox extends Input<{
    options: string[],
}, {
    isFocus: boolean,
}> {
    public state = {
        isFocus: false,
    };
    private textBox!: TextBox;
    public render() {
        const { value } = this.props;
        return (
            <div className={prefix("color")} onClick={this.onClick}>
                <TextBox
                    ref={ref(this, "textBox")}
                    value={value}
                    setCallback={this.setCallback}
                    onFocus={this.onFocus} />
                {this.renderPicker()}
            </div>
        );
    }
    public componentDidMount() {
        super.componentDidMount();

        window.addEventListener("blur", this.onBlur);
        window.addEventListener("click", this.onBlur);
    }
    public componentWillUnmount() {
        window.removeEventListener("blur", this.onBlur);
        window.removeEventListener("click", this.onBlur);
    }
    public renderPicker() {
        if (this.state.isFocus) {
            return (
                <div className={prefix("picker")}>
                    <ChromePicker color="" onChangeComplete={this.onChangeComplete} />
                </div>
            );
        } else {
            return;
        }
    }
    public setValue() {
        return;
    }
    protected setCallback = () => {
        this.props.setCallback(this.textBox.getValue());
    }
    private onChangeComplete = (e: ColorResult) => {
        const rgba = e.rgb;
        const value = `rgba(${[rgba.r, rgba.g, rgba.b, rgba.a].join(",")})`;
        this.textBox.setValue(value);
        this.props.setCallback(value);
    }
    private onClick = (e: any) => {
        e.stopPropagation();
    }
    private onFocus = () => {
        this.setState({
            isFocus: true,
        });
    }
    private onBlur = (e: any) => {
        if (this.state.isFocus) {
            this.setState({
                isFocus: false,
            });
        }
    }
}
