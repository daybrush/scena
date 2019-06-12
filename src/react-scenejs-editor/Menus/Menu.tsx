import * as React from "react";
import { prefix } from "../utils";

export default class Menus extends React.Component<{
    selected?: boolean,
}> {
    public render() {
        const { selected } = this.props;
        return (
            <div className={prefix("menu", selected ? "selected" : "")}>
                Cursor
            </div>);
    }
}
