import { PREFIX } from "./consts";
import Scene, { SceneItem, Frame } from "scenejs";
import {
    hasClass as hasClass2,
    addClass as addClass2,
    removeClass as removeClass2,
    IObject,
    isObject,
    findIndex,
} from "@daybrush/utils";
import ElementComponent from "./utils/ElementComponent";

export function numberFormat(num: number, count: number, isRight?: boolean) {
    const length = `${num}`.length;
    const arr = [];

    if (isRight) {
        arr.push(num);
    }
    for (let i = length; i < count; ++i) {
        arr.push(0);
    }
    if (!isRight) {
        arr.push(num);
    }
    return arr.join("");
}
export function applyStyle(el: HTMLElement, style: IObject<any>) {
    for (const name in style) {
        el.style[name as any] = style[name as any];
    }
}
export function keys(value: object) {
    const arr = [];
    for (const name in value) {
        arr.push(name);
    }
    return arr;
}
export function toValue(value: any): any {
    if (isObject(value)) {
        if (Array.isArray(value)) {
            return `[${value.join(", ")}]`;
        }
        return `{${keys(value).map(k => `${k}: ${toValue(value[k])}`).join(", ")}}`;
    }
    return value;
}
export function flatObject(obj: IObject<any>, newObj: IObject<any> = {}) {

    for (const name in obj) {
        const value = obj[name];

        if (isObject(value)) {
            const nextObj = flatObject(isFrame(value) ? value.get() : value);

            for (const nextName in nextObj) {
                newObj[`${name}///${nextName}`] = nextObj[nextName];
            }
        } else {
            newObj[name] = value;
        }
    }
    return newObj;
}

export function getTarget<T extends HTMLElement>(target: T, conditionCallback: (el: Element) => boolean): T | null {
    let parentTarget = target;

    while (parentTarget && parentTarget !== document.body) {
        if (conditionCallback(parentTarget)) {
            return parentTarget;
        }
        parentTarget = parentTarget.parentNode as T;
    }
    return null;
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
    return !!(value.constructor as typeof Scene).prototype.getItem;
}
export function isSceneItem(value: any): value is SceneItem {
    return !!(value.constructor as typeof SceneItem).prototype.getFrame;
}
export function isFrame(value: any): value is Frame {
    return !!(value.constructor as typeof Frame).prototype.toCSS;
}
export function splitProperty(scene: Scene, property: string) {
    const names = property.split("///");
    const length = names.length;
    let item: Scene | SceneItem = scene;
    let i;

    for (i = 0; i < length; ++i) {
        if (isSceneItem(item)) {
            break;
        }
        item = scene.getItem(names[i]);
    }
    return {
        item: item as SceneItem,
        names: names.slice(0, i),
        properties: names.slice(i),
    };
}
export function getSceneItem(scene: Scene, names: string[]): SceneItem {
    return names.reduce<any>(
        (nextScene, name) => nextScene.getItem(name),
        scene,
    );
}

export function findElementIndexByPosition(elements: HTMLElement[], pos: number): number {
    return findIndex(elements, el => {
        const box = el.getBoundingClientRect();
        const top = box.top;
        const bottom = top + box.height;

        return top <= pos && pos < bottom;
    });
}

export function prefix(className: string) {
    return className.split(" ").map(name => `${PREFIX}${name}`).join(" ");
}
export function ref(target: any, name: string) {
    return (e: any) => {
        e && (target[name] = e);
    };
}
export function refs(target: any, name: string, i: number) {
    return (e: any) => {
        e && (target[name][i] = e);
    };
}

export function checkFolded(foldedInfo: IObject<any>, names: any[]) {
    const index = findIndex(names, (name, i) => foldedInfo[names.slice(0, i + 1).join("///") + "///"]);

    if (index > -1) {
        if (index === names.length - 1) {
            return 2;
        }
        return 1;
    } else {
        return 0;
    }
}

export function fold(
    target: ElementComponent<any, { foldedInfo: IObject<boolean> }>,
    foldedProperty: string,
    isNotUpdate?: boolean,
) {
    const id = foldedProperty + "///";
    const foldedInfo = target.state.foldedInfo;

    foldedInfo[id] = !foldedInfo[id];
    if (!isNotUpdate) {
        target.setState({
            foldedInfo: { ...foldedInfo },
        });
    }
}
