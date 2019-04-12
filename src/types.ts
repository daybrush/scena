import { IObject } from "@daybrush/utils";

export interface Ids {
    timeArea: ElementStructure;
    scrollArea: ElementStructure;
    valuesArea: ElementStructure;
    timeline: ElementStructure;
    properties: ElementStructure[];
    values: ElementStructure[];
    keyframesList: ElementStructure[];
    keyframesInfoList: ElementStructure[][];
    cursors: ElementStructure[];
    keyframesAreas: ElementStructure[];
    propertiesAreas: ElementStructure[];
    keyframesScrollAreas: ElementStructure[];
    keyframesContainers: ElementStructure[];
    keytimesContainer: ElementStructure;
    lineArea: ElementStructure;
    prevBtn: ElementStructure;
    playBtn: ElementStructure;
    nextBtn: ElementStructure;
}
export interface ElementStructure {
    selector: string;
    id?: string | string[];
    memberof?: string;
    element?: HTMLElement;
    attr?: IObject<any>;
    dataset?: IObject<any>;
    style?: Partial<CSSStyleDeclaration>;
    html?: string;
    children?: undefined | ElementStructure | Array<ElementStructure | undefined>;
}
