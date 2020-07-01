import * as React from "react";
import { prefix } from "../../utils";
import { IObject } from "@daybrush/utils";


export interface Maker {
    tag: string,
    props: IObject<any>,
    style: IObject<any>,
}
export default abstract class Icon extends React.PureComponent<{
    selected?: boolean,
    onSelect: (id: string) => any;
}> {
    public static id: string;
    public static maker?: Maker;
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
