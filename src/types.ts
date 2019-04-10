import { IObject } from "@daybrush/utils";

export interface Ids<T> {
    timeArea: T;
    scrollArea: T;
    valuesArea: T;
    timeline: T;
    properties: T[];
    values: T[];
    keyframesList: T[];
    keyframesInfoList: T[][];
    cursors: T[];
    keyframesAreas: T[];
    propertiesAreas: T[];
    keyframesScrollAreas: T[];
    keyframesContainers: T[];
    keytimesContainer: T;
    lineArea: T;
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
