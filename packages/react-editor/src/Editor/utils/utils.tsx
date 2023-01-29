import React from "react";
import { KeyControllerEvent } from "keycon";
import { prefixNames } from "framework-utils";
import { PREFIX, DATA_SCENA_ELEMENT_ID } from "../consts";
import {
    ScenaFunctionComponent, ScenaProps, ScenaComponent,
    ScenaJSXElement, ScenaFunctionJSXElement, ScenaElementLayerGroup, ScenaElementLayer,
} from "../types";
import { IObject, splitComma, isArray, isFunction, isObject, splitUnit } from "@daybrush/utils";
import { Frame } from "scenejs";
import { getElementInfo } from "react-moveable";
import { fromTranslation, matrix3d } from "@scena/matrix";


export function prefix(...classNames: Array<string | undefined | false>) {
    return prefixNames(PREFIX, ...classNames as string[]);
}

export function getContentElement(el: HTMLElement): HTMLElement | null {
    if (el.contentEditable === "inherit") {
        return getContentElement(el.parentElement!);
    }
    if (el.contentEditable === "true") {
        return el;
    }
    return null;
}

export function between(val: number, min: number, max: number) {
    return Math.min(Math.max(min, val), max);
}

export function getId(el: HTMLElement | SVGElement) {
    return el.getAttribute(DATA_SCENA_ELEMENT_ID)!;
}
export function getIds(els: Array<HTMLElement | SVGElement>): string[] {
    return els.map(el => getId(el));
}

export function checkInput(target: HTMLElement | SVGElement) {
    const tagName = target.tagName.toLowerCase();

    return (target as HTMLElement).isContentEditable || tagName === "input" || tagName === "textarea";
}

export function inputChecker(e: KeyControllerEvent) {
    const inputEvent = e.inputEvent;
    const target = inputEvent.target as HTMLElement;

    if (!target || checkInput(target)) {
        return false;
    }
    return true;
}
export function keyChecker(e: KeyControllerEvent) {
    if (inputChecker(e)) {
        e.inputEvent.preventDefault();
    }
}

export function checkImageLoaded(el: HTMLElement | SVGElement): Promise<any> {
    if (el.tagName.toLowerCase() !== "img") {
        return Promise.all([].slice.call(el.querySelectorAll("img")).map(el => checkImageLoaded(el)));
    }
    return new Promise<void>(resolve => {
        if ((el as HTMLImageElement).complete) {
            resolve();
        } else {
            el.addEventListener("load", function loaded() {
                resolve();

                el.removeEventListener("load", loaded);
            });
        }
    });
}

export function getParnetScenaElement(el: HTMLElement | SVGElement): HTMLElement | SVGElement | null {
    if (!el) {
        return null;
    }
    if (el.hasAttribute(DATA_SCENA_ELEMENT_ID)) {
        return el;
    }
    return getParnetScenaElement(el.parentElement as HTMLElement | SVGElement);
}

export function makeScenaFunctionComponent<T = IObject<any>>(
    id: string,
    component: (props: ScenaProps & T) => React.ReactElement<any, any>,
): ScenaFunctionComponent<T> {
    (component as ScenaFunctionComponent<T>).scenaComponentId = id;

    return component as ScenaFunctionComponent<T>;
}

export function getScenaAttrs(el: HTMLElement | SVGElement) {
    const attributes = el.attributes;
    const length = attributes.length;
    const attrs: IObject<any> = {};

    for (let i = 0; i < length; ++i) {
        const { name, value } = attributes[i];

        if (name === DATA_SCENA_ELEMENT_ID || name === "style") {
            continue;
        }
        attrs[name] = value;
    }

    return attrs;
}

export function isScenaFunction(value: any): value is ScenaComponent {
    return isFunction(value) && "scenaComponentId" in value;
}

export function isScenaElement(value: any): value is ScenaJSXElement {
    return isObject(value) && !isScenaFunction(value);
}

export function isScenaFunctionElement(value: any): value is ScenaFunctionJSXElement {
    return isScenaElement(value) && isFunction(value.type);
}

export function setMoveMatrix(frame: Frame, moveMatrix: number[]) {
    const transformOrders = [...(frame.getOrders(["transform"]) || [])];

    if (`${transformOrders[0]}`.indexOf("matrix3d") > -1) {
        const matrix = frame.get("transform", transformOrders[0]);
        const prevMatrix = isArray(matrix)
            ? matrix
            : splitComma(matrix).map(v => parseFloat(v));

        frame.set("transform", transformOrders[0], matrix3d(moveMatrix, prevMatrix));
    } else if (frame.has("transform", "matrix3d")) {
        let num = 1;
        while (frame.has("transform", `matrix3d${++num}`)) { }

        frame.set("transform", `matrix3d${num}`, [...moveMatrix]);
        frame.setOrders(["transform"], [`matrix3d${num}`, ...transformOrders]);
    } else {
        frame.set("transform", "matrix3d", [...moveMatrix]);
        frame.setOrders(["transform"], ["matrix3d", ...transformOrders]);
    }
}

export function getOffsetOriginMatrix(el: HTMLElement | SVGElement, container: HTMLElement) {
    const stack = getElementInfo(el, container);
    const origin = stack.targetOrigin;
    const translation = fromTranslation([origin[0], origin[1], origin[2] || 0], 4);

    return matrix3d(stack.offsetMatrix as any, translation);
}


export function flattenLayerGroup(group: ScenaElementLayerGroup): ScenaElementLayer[] {
    const layers: ScenaElementLayer[] = [];

    group.children.forEach(child => {
        if (child.type === "group") {
            layers.push(...flattenLayerGroup(child));
        } else {
            layers.push(child);
        }
    });
    return layers;
}

export function isArrayEquals(arr1: any[], arr2: any[]) {
    return arr1.length === arr2.length && arr1.every((el, i) => el === arr2[i]);
}

export function isDeepArrayEquals(arr1: any[], arr2: any[]): boolean {
    return arr1.length === arr2.length && arr1.every((value1, i) => {
        const value2 = arr2[i];
        const isArray1 = isArray(value1);
        const isArray2 = isArray(value2);
        if (isArray1 && isArray2) {
            return isDeepArrayEquals(value1, value2);
        } else if (!isArray1 && !isArray2) {
            return value1 === value2;
        }
        return false;
    });
}

export function isArrayContains(arr1: any[], arr2: any[]) {
    return arr1.every((el, i) => el === arr2[i]);
}


export function getPureValue(value?: string | number | null) {
    return splitUnit(`${value || 0}`).value;
}
