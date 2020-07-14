import * as React from "react";
import { prefix } from "../utils/utils";
import MoveableManager from "../Viewport/MoveableMananger";

export default abstract class Tab extends React.PureComponent<{
    moveableManager: React.RefObject<MoveableManager>,
}> {
    public static id: string;
    public abstract title: string;
    public abstract renderTab(): any;
    public render() {
        return (
            <div className={prefix("tab")}>
                <h2>{this.title}</h2>
                {this.renderTab()}
            </div>
        );
    }
    public getMoveable() {
        return this.props.moveableManager.current!.getMoveable();
    }
}
