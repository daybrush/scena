import * as React from "react";
import Tab from "../Tab";
import { prefix } from "../../utils/utils";
import Folder, { FileInfo } from "../Folder/Folder";
import Property from "./Property";
import File from "../Folder/File";
import "./FrameTab.css";
import { NameType } from "scenejs";

export default class FrameTab extends Tab {
    public static id = "Frame";
    public title = "Frame";
    public state: {
        selected: string[],
    } = {
        selected: [],
    };
    public renderTab() {
        const {
            selected,
        } = this.state;

        const frame = this.moveableData.getSelectedFrames()[0];

        if (!frame) {
            return;
        }
        return <div className={prefix("frame-tab")}>
            <Folder<NameType> name=""
                properties={frame.getOrders([]) || []}
                getId={v => v}
                getName={v => v}
                getChildren={(value, _, scope) => {
                    return frame.getOrders([...scope, value]) || [];
                }}
                scope={[]}
                selected={selected}
                isMove={true}
                isMoveChildren={true}
                checkMove={() => false}
                onMove={this.onMove}
                onSelect={this.onSelect}
                FileComponent={this.renderProperty} />
        </div>;
    }
    public componentDidMount() {
        this.addEvent("render", this.onRender as any);
        this.addEvent("setSelectedTargets", this.setTargets as any);
    }
    private renderProperty = ({ name, fullId, scope }: File["props"]) => {
        const frame = this.moveableData.getSelectedFrames()[0];

        return <Property name={name} fullId={fullId} scope={scope} value={frame.get(...fullId.split("///"))} onChange={this.onChange}></Property>;
    }
    private onSelect = (selected: string[]) => {
        this.setState({
            selected,
        })
    }
    private onMove = (selectedInfos: Array<FileInfo<any>>, parentInfo?: FileInfo<any>, prevInfo?: FileInfo<any>) => {
        const parentScope = parentInfo ? [...parentInfo.scope, parentInfo.id] : [];
        const frames = this.moveableData.getSelectedFrames();
        const frame = frames[0];
        const orders = (frame.getOrders(parentScope) || []).slice();

        const selectedProperty = selectedInfos[0].id;
        const selectedIndex = orders.indexOf(selectedProperty);

        if (selectedIndex !== -1) {
            orders.splice(selectedIndex, 1);
        }
        if (prevInfo) {
            const prevIndex = orders.indexOf(prevInfo.id);

            if (prevIndex === -1) {
                orders.push(selectedProperty);
            } else {
                orders.splice(prevIndex + 1, 0, selectedProperty);
            }
        } else {
            orders.splice(0, 0, selectedProperty);
        }
        this.editor.setOrders(parentScope, orders, true);
    }
    private onChange = (scope: string[], value: any) => {
        const frames = this.moveableData.getSelectedFrames();

        if (!frames.length) {
            return;
        }
        this.editor.setProperty(scope, value, true);
    }
    private onRender = () => {
        this.forceUpdate();
    }
    private setTargets = () => {
        const state = this.state;

        state.selected = [];
        this.forceUpdate();
    }
}
