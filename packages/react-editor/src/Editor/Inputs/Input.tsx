import { IObject } from "@daybrush/utils";
import * as React from "react";
import "./Input.css";

export default class Input<T = {}, U = {}, I extends HTMLElement = HTMLElement> extends React.PureComponent<{
    value?: any;
    updateValue?: boolean;
    inputProps?: IObject<any>,
    onChange: (v: any) => any,
} & T, U> {
    public input = React.createRef<I>();
    public getValue(): any {
        return;
    }
    public setValue(value: any) {
    }
    public componentDidMount() {
        const props = this.props;

        props.updateValue && this.setValue(props.value);
    }
    public componentDidUpdate() {
        const props = this.props;

        props.updateValue && this.setValue(props.value);
    }
}
