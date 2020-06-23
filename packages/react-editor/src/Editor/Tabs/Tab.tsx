import * as React from "react";
import { prefix } from "../../utils";
import Moveable from "react-moveable";

export default abstract class Tab extends React.PureComponent<{
    moveable: React.RefObject<Moveable>,
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
    public updateTargets() {
        return;
    }
    public updateRender() {
        return;
    }
}
