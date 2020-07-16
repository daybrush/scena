import { prefixNames } from "framework-utils";
import { PREFIX, DATA_SCENA_ELEMENT_ID } from "../consts";
import { EDITOR_PROPERTIES } from "../consts";

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

export function getId(el: HTMLElement | SVGElement) {
    return el.getAttribute(DATA_SCENA_ELEMENT_ID)!;
}
export function getIds(els: Array<HTMLElement | SVGElement>): string[] {
    return els.map(el => getId(el));
}
