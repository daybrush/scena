import { isUndefined, IObject } from "@daybrush/utils";
import * as React from "react";
import "./Input.css";

export default class Input<T = {}, U = {}> extends React.PureComponent<{
    inputProps?: IObject<any>,
    onChange: (v: string | number) => any,
} & T, U> {
    protected input = React.createRef<HTMLInputElement | HTMLSelectElement>();
    public getValue() {
        return this.input.current!.value;
    }
    public setValue(value: number | string) {
        this.input.current!.value = `${isUndefined(value) ? "" : value}`;
    }
}
