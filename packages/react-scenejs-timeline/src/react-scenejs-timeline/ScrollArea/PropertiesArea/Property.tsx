import { PropertiesInfo } from "../../types";
import * as React from "react";
import { prefix } from "../../utils";
import ElementComponent from "../../utils/ElementComponent";

export default class Property extends ElementComponent<{
    id: string,
    propertiesInfo: PropertiesInfo,
    selected: boolean,
    folded: number,
}> {
    public render() {
        const {
            id,
            selected,
            folded,
            propertiesInfo: {
                keys: propertyNames,
                isItem,
                isParent,
            },
        } = this.props;
        const length = propertyNames.length;
        const name = propertyNames[length - 1] as string;

        return (
            <div className={prefix("property" + (folded === 1 ? " fold" : "") + (selected ? " select" : ""))}
                data-id={id}
                data-name={name}
                data-object={isParent ? 1 : 0}
                data-item={isItem ? 1 : 0}
                data-fold={folded === 2 ? 1 : 0}
                style={{
                    paddingLeft: `${10 + (length - 1) * 20}px`,
                }}>
                <div className={prefix("arrow")}></div>
                <span>{name}</span>
                <div className={prefix("remove")}></div>
            </div>
        );
    }
}
