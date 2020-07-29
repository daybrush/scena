import { prefixNames } from "framework-utils";
import { PREFIX, DATA_SCENA_ELEMENT_ID } from "../consts";
import { EDITOR_PROPERTIES } from "../consts";
import { ScenaFunctionComponent, ScenaProps, ScenaComponent, ScenaJSXElement, ScenaFunctionJSXElement } from "../types";
import { IObject } from "@daybrush/utils";
import { isFunction, isObject } from "util";

export function prefix(...classNames: string[]) {
    return prefixNames(PREFIX, ...classNames);
}
export function getContentElement(el: HTMLElement): HTMLElement | null {
    if (el.contentEditable === "inherit") {
        return getContentElement(el.parentElement!);
    }
    if (el.contentEditable === "true")  {
        return el;
    }
    return null;
}

export function connectEditorProps(component: any) {
    const prototype = component.prototype;
    Object.defineProperty(prototype, "editor", {
        get: function () {
            return this.props.editor;
        },
    });
    EDITOR_PROPERTIES.forEach(name => {
        Object.defineProperty(prototype, name, {
            get: function () {
                return this.props.editor[name];
            },
        });
    })
};
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
export function checkImageLoaded(el: HTMLElement | SVGElement): Promise<any> {
    if (el.tagName.toLowerCase() !== "img") {
        return Promise.all([].slice.call(el.querySelectorAll("img")).map(el => checkImageLoaded(el)));
    }
    return new Promise(resolve => {
        if ((el as HTMLImageElement).complete) {
            resolve();
        } else {
            el.addEventListener("load", function loaded() {
                resolve();

                el.removeEventListener("load", loaded);
            })
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

export function makeScenaFunctionComponent<T = IObject<any>>(id: string, component: (props: ScenaProps & T) => React.ReactElement<any, any>): ScenaFunctionComponent<T> {
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

export function isNumber(value: any): value is number {
    return typeof value === "number";
}
