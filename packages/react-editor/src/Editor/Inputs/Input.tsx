import { isUndefined, IObject } from "@daybrush/utils";
import * as React from "react";
import "./Input.css";

export default class Input<T = {}, U = {}> extends React.PureComponent<{
    value?: any;
    updateValue?: boolean;
    inputProps?: IObject<any>,
    onChange: (v: any) => any,
} & T, U> {
    protected input = React.createRef<HTMLInputElement | HTMLSelectElement>();
    public getValue(): any {
        return this.input.current!.value;
    }
    public setValue(value: any) {
        this.input.current!.value = `${isUndefined(value) ? "" : value}`;
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
