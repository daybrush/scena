import { isUndefined, IObject } from "@daybrush/utils";
import * as React from "react";

export default class Input<T extends IObject<any> = {}> extends React.Component<{
    value: any,
    setCallback: (value: any) => void,
} & T> {
    protected input!: HTMLInputElement | HTMLSelectElement;
    public componentDidMount() {
        this.setValue();
    }
    public componentDidUpdate() {
        this.setValue();
    }
    public getValue() {
        return this.input.value;
    }
    protected setValue() {
        const value = this.props.value;

        this.input.value = isUndefined(value) ? "" : value;
    }
}
