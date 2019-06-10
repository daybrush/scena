import { isUndefined, IObject } from "@daybrush/utils";
import * as React from "react";

export default class Input<T extends IObject<any> = {}, U extends IObject<any> = {}> extends React.Component<{
    value: any,
    setCallback: (value: any) => void,
} & T, U> {
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
    public setValue(value = this.props.value) {
        this.input.value = isUndefined(value) ? "" : value;
    }
}
