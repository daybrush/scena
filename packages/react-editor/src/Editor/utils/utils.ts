import { prefixNames } from "framework-utils";
import { PREFIX } from "../../consts";

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
