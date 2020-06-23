import * as React from "react";
import { prefix } from "../../utils";

export default abstract class Icon extends React.PureComponent<{
    selected?: boolean,
    onSelect: (id: string) => any;
}> {
    public static id: string;
    public abstract renderIcon(): any;
    public render() {
        return (
            <div className={prefix("icon", this.props.selected ? "selected" : "")}
                onClick={this.onClick}>
                {this.renderIcon()}
            </div>
        );
    }
    public onClick = () => {
        this.props.onSelect((this.constructor as any).id);
    }
}
