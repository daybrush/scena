import { IObject } from "@daybrush/utils";
import { DataStructure } from "data-dom";

export interface Ids {
    timeArea?: ElementStructure;
    scrollArea?: ElementStructure;
    valuesArea?: ElementStructure;
    timeline?: ElementStructure;
    properties?: ElementStructure[];
    values?: ElementStructure[];
    keyframesList?: ElementStructure[];
    cursors?: ElementStructure[];
    keyframesAreas?: ElementStructure[];
    propertiesAreas?: ElementStructure[];
    keyframesScrollAreas?: ElementStructure[];
    keyframesContainers?: ElementStructure[];
    keytimesContainer?: ElementStructure;
    lineArea?: ElementStructure;
    prevBtn?: ElementStructure;
    playBtn?: ElementStructure;
    nextBtn?: ElementStructure;
}
export interface ElementStructure extends DataStructure {
    selector: string;
    attr?: IObject<any>;
    dataset?: IObject<any>;
    style?: Partial<CSSStyleDeclaration>;
    html?: string;
}
