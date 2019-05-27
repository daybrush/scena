import { PropertiesInfo } from "../../types";
import * as React from "react";
import { prefix, ref } from "../../utils";
import Scene, { SceneItem } from "scenejs";
import ElementComponent from "../../utils/ElementComponent";

export default class Value extends ElementComponent<{
    id: string,
    propertiesInfo: PropertiesInfo,
    folded: number,
    selected: boolean,
    add: (item: Scene | SceneItem, properties: string[]) => any,
}> {
    public inputElement!: HTMLInputElement;
    public render() {
        const {
            id,
            selected,
            folded,
            propertiesInfo: {
                isItem,
                isParent,
            },
        } = this.props;
        return (
            <div className={prefix("value" + (folded === 1 ? " fold" : "") + (selected ? " select" : ""))}
                data-id={id}
                data-object={isParent ? 1 : 0}
                data-item={isItem ? 1 : 0}>
                {this.renderValue()}
            </div>
        );
    }
    public renderValue() {
        const { isParent } = this.props.propertiesInfo;
        if (isParent) {
            return (
                <div className={prefix("add")} onClick={this.add}>+</div>
            );
        } else {
            return (
                <input ref={ref(this, "inputElement")}></input>
            );
        }
    }
    private add = () => {
        const {
            add,
            propertiesInfo: {
                item,
                properties,
            },
        } = this.props;
        add(item, properties);
    }
}
