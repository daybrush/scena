import * as React from "react";
import { prefix } from "../../utils";

export default class Menu extends React.Component<{
    type: string,
    selected?: boolean,
    icon: typeof React.Component,
    onSelected?: (e: { type: string }) => void,
}> {
    public render() {
        const { selected, icon } = this.props;
        return (
            <div className={prefix("menu", selected ? "selected" : "")} onClick={this.onSelected}>
                {React.createElement(icon)}
            </div>);
    }
    public onSelected = () => {
        const onSelected = this.props.onSelected;

        if (onSelected) {
            onSelected({ type: this.props.type });
        }
    }
}
