import { isUndefined, IObject } from "@daybrush/utils";
import * as React from "react";
import "./Input.css";

export default class Input<T = {}, U = {}> extends React.PureComponent<{
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
}
