import * as React from "react";
import { prefix } from "../utils/utils";
import Editor from "../Editor";
import { EditorInterface } from "../types";
import Icon from "../Icons/Icon";
import { connectEditorContext } from "../decorators/ConnectEditorContext";

@connectEditorContext
export default abstract class Tab extends React.PureComponent {
    public static id: string;
    public static icon: typeof Icon;
    public abstract title: string;
    public abstract renderTab(): any;
    public eventList: Array<[string, any]> = [];
    public render() {
        return (
            <div className={prefix("tab-popup")}>
                <h2>{this.title}</h2>
                {this.renderTab()}
            </div>
        );
    }
    public addEvent(name: string, callback: any) {
        this.eventList.push([name, callback]);
        this.eventBus.on(name, callback);
    }
    public getMoveable() {
        return this.moveableManager.current!.getMoveable();
    }
    public componentWillUnmount() {
        const eventBus = this.eventBus;
        this.eventList.forEach(([name, callback]) => {
            eventBus.off(name, callback);
        });
    }
}
export default interface Tab extends EditorInterface {
    context: Editor;
};
