import { TimelineInfo } from "../types";
import Value from "./Value";
import * as React from "react";
import { prefix, refs, checkFolded } from "../utils";
import ElementComponent from "./ElementComponent";
import { IObject } from "@daybrush/utils";

export default class ValuesArea extends ElementComponent<{
    timelineInfo: TimelineInfo,
    selectedProperty: string,
}, {
    foldedInfo: IObject<boolean>,
}> {
    public values: Value[] = [];
    public state = {
        foldedInfo: {},
    };
    public render() {
        const { timelineInfo, selectedProperty } = this.props;
        const { foldedInfo } = this.state;
        const values: JSX.Element[] = [];

        for (const id in timelineInfo) {
            const propertiesInfo = timelineInfo[id];
            const selected = selectedProperty === id;
            const folded = checkFolded(foldedInfo, propertiesInfo.keys);

            values.push(<Value
                ref={refs(this, "values", values.length)}
                folded={folded}
                selected={selected}
                id={id} propertiesInfo={propertiesInfo} />);
        }

        return (
            <div className={prefix("values-area")}>
                {values}
            </div>
        );
    }
}
