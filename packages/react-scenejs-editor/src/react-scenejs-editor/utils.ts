
import Scene, { SceneItem } from "scenejs";
import {
    hasClass as hasClass2,
    addClass as addClass2,
    removeClass as removeClass2,
} from "@daybrush/utils";
import { prefixNames } from "framework-utils";
import { PREFIX } from "./consts";

export function prefix(...classNames: string[]) {
    return prefixNames(PREFIX, ...classNames);
}

export function findSceneItemByElementStack(element: HTMLElement | SVGElement, scene: Scene | SceneItem):
    [HTMLElement | SVGElement | null, Scene | SceneItem | null] {
    let target: HTMLElement | SVGElement | null = element;
    let item: Scene | SceneItem | null = null;

    while (target && !item) {
        item = findSceneItemByElement(target, scene);

        if (!item) {
            target = target.parentElement;
        }
    }
    if (!target || !item) {
        return [null, null];
    }
    return [target, item];
}
export function findSceneItemByElement(element: HTMLElement | SVGElement, scene: Scene | SceneItem) {
    let target: SceneItem | null = null;

    if (!scene) {
        return null;
    }
    if (isScene(scene)) {
        scene.forEach(item => {
            if (target) {
                return;
            }
            target = findSceneItemByElement(element, item);
        });
    } else {
        const elements = scene.getElements();

        if (elements.indexOf(element) > -1) {
            return scene;
        }
    }
    return target;
}

export function hasClass(target: Element, className: string) {
    return hasClass2(target, `${PREFIX}${className}`);
}
export function addClass(target: Element, className: string) {
    return addClass2(target, `${PREFIX}${className}`);
}
export function removeClass(target: Element, className: string) {
    return removeClass2(target, `${PREFIX}${className}`);
}
export function isScene(value: any): value is Scene {
    return value && !!(value.constructor as typeof Scene).prototype.getItem;
}
export function isSceneItem(value: any): value is SceneItem {
    return value && !!(value.constructor as typeof SceneItem).prototype.getFrame;
}
export function isFrame(value: any): value is Frame {
    return value && !!(value.constructor as typeof Frame).prototype.toCSS;
}
