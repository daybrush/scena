import { IObject } from "@daybrush/utils";

export interface Ids<T> {
    timeArea: T;
    scrollArea: T;
    valuesArea: T;
    timeline: T;
    properties: T[];
    values: T[];
    keyframesList: T[];
    cursors: T[];
    keyframesAreas: T[];
    propertiesAreas: T[];
    keyframesScrollAreas: T[];
}
export interface ElementStructure {
    selector: string;
    id?: string;
    attr?: IObject<any>;
    dataset?: IObject<any>;
    style?: Partial<CSSStyleDeclaration>;
    html?: string;
    children?: undefined | string | ElementStructure | Array<ElementStructure | undefined | string>;
}
