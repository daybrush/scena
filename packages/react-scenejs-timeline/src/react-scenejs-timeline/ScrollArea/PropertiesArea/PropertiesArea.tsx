import { TimelineInfo } from "../../types";
import Property from "./Property";
import * as React from "react";
import { prefix, refs, checkFolded } from "../../utils";
import ElementComponent from "../../utils/ElementComponent";
import { IObject } from "@daybrush/utils";

export default class PropertiesArea extends ElementComponent<{
    timelineInfo: TimelineInfo,
    selectedProperty: string,
}, {
    foldedInfo: IObject<boolean>,
}> {
    public properties: Property[] = [];
    public state = {
        foldedInfo: {},
    };
    public render() {
        const { timelineInfo, selectedProperty } = this.props;
        const { foldedInfo } = this.state;
        const properties: JSX.Element[] = [];

        this.properties = [];
        for (const id in timelineInfo) {
            const propertiesInfo = timelineInfo[id];
            const selected = selectedProperty === id;
            const folded = checkFolded(foldedInfo, propertiesInfo.keys);

            properties.push(
                <Property
                    ref={refs(this, "properties", properties.length)}
                    selected={selected}
                    folded={folded}
                    id={id} propertiesInfo={propertiesInfo} />,
            );
        }

        return (
            <div className={prefix("properties-area")}>
                <div className={prefix("properties-scroll-area")}>
                    {properties}
                </div>
            </div>
        );
    }
}
