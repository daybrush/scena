import { IObject } from "@daybrush/utils";

export interface Ids {
    timeArea: HTMLElement;
    scrollArea: HTMLElement;
    valuesArea: HTMLElement;
    timeline: HTMLElement;
    properties: HTMLElement[];
    values: HTMLElement[];
    keyframesList: HTMLElement[];
    cursors: HTMLElement[];
    keyframesAreas: HTMLElement[];
    propertiesAreas: HTMLElement[];
    keyframesScrollAreas: HTMLElement[];
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
