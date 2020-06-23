import TextBox from "./TextBox";

export default class NumberBox extends TextBox {
    protected inputAttributes = {
        type: "number",
        min: 0,
        step: 0.1,
        pattern: "[0-9.]*",
    };
}
