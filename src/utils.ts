import { PREFIX } from "./consts";
import Scene, { SceneItem, Frame } from "scenejs";
import {
    hasClass as hasClass2,
    addClass as addClass2,
    removeClass as removeClass2,
    isString,
    IObject,
    isObject,
    isArray,
    isUndefined,
} from "@daybrush/utils";
import { ElementStructure } from "./types";

export function applyStyle(el: HTMLElement, style: IObject<any>) {
    for (const name in style) {
        el.style[name] = style[name];
    }
}
export function findIndexByProperty(selectedProperty: string, structures: ElementStructure[]) {
    return structures.findIndex(
        ({dataset: {property}}) => property === selectedProperty,
    );
}

export function createElement(structure: ElementStructure) {
    const {selector, dataset, attr, style, html} = structure;

    const classNames = selector.match(/\.([^.#\s])+/g) || [];
    const tag = (selector.match(/^[^.#\s]+/g) || [])[0] || "div";
    const id = (selector.match(/#[^.#\s]+/g) || [])[0] || "";
    const el = document.createElement(tag);

    id && (el.id = id.replace(/^#/g, ""));
    el.className = classNames.map(name => `${PREFIX}${name.replace(/^\./g, "")}`).join(" ");

    if (dataset) {
        for (const name in dataset) {
            el.setAttribute(`data-${name}`, dataset[name]);
        }
    }
    if (attr) {
        for (const name in attr) {
            el.setAttribute(name, attr[name]);
        }
    }
    if (style) {
        applyStyle(el, style);
    }
    if (html) {
        el.innerHTML = html;
    }
    return el;
}
export function updateElement(prevStructure: ElementStructure, nextStructure: ElementStructure) {
    const {dataset, attr, style, html, element} = nextStructure;
    if (dataset) {
        for (const name in dataset) {
            element.setAttribute(`data-${name}`, dataset[name]);
        }
    }
    if (attr) {
        for (const name in attr) {
            element.setAttribute(name, attr[name]);
        }
    }
    style && applyStyle(element, style);
    if (prevStructure.html !== nextStructure.html) {
        element.innerHTML = html;
    }
}
export function keys(value: object) {
    const arr = [];
    for (const name in value) {
        arr.push(name);
    }
    return arr;
}
export function toValue(value: any) {
    const type = typeof value;
    if (type === "object") {
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
export function getTimelineInfo(scene: Scene) {
  const timelineInfo = {};
  scene.forEach((item: SceneItem) => {
    const delay = item.getDelay();
    const times = item.times;

    times.forEach(time => {
      const frame = item.getFrame(time);
      (function forEach(...objs: any[]) {
        const length = objs.length;
        const lastObj = objs[length - 1];
        const properties = objs.slice(0, -1);

        const name = properties.join("///");

        if (name) {
            if (!timelineInfo[name]) {
                timelineInfo[name] = [];
            }
            const info = timelineInfo[name];

            info.push([delay + time, lastObj]);
        }

        if (typeof lastObj === "object") {
            Object.keys(lastObj).forEach(name2 => {
                forEach(...properties, name2, lastObj[name2]);
            });
        }
      })(item.getId(), frame.get());
    });
  });
  return timelineInfo;
}

export function getTarget(target: HTMLElement, conditionCallback: (el: Element) => boolean): HTMLElement {
    let parentTarget = target;

    while (parentTarget && parentTarget !== document.body) {
        if (conditionCallback(parentTarget)) {
            return parentTarget;
        }
        parentTarget = parentTarget.parentNode as HTMLElement;
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
export function findStructure(
    selector: string,
    structure: ElementStructure | ElementStructure[],
    multi: true,
    arr?: ElementStructure[],
): ElementStructure[];
export function findStructure(
    selector: string,
    structure: ElementStructure | ElementStructure[],
    multi?: false,
    arr?: ElementStructure[],
): ElementStructure;
export function findStructure(
    selector: string,
    structure: ElementStructure | ElementStructure[],
    multi: true | false,
    arr?: ElementStructure[],
): ElementStructure | ElementStructure[];
export function findStructure(
    selector: string,
    structure: ElementStructure | ElementStructure[],
    multi: boolean = false,
    arr: ElementStructure[] = [],
): ElementStructure | ElementStructure[] {
    if (isArray(structure)) {
        const length = structure.length;

        for (let i = 0; i < length; ++i) {
            findStructure(selector, structure[i], multi, arr);
        }
    } else {
        if (structure.selector === selector) {
            arr.push(structure);
        }
        if (!multi && arr.length) {
            return arr[0];
        }
        if (structure.children) {
            findStructure(selector, structure.children, multi, arr);
        }
    }
    return multi ? arr : arr[0];
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
    const length = elements.length;

    for (let index = 0; index < length; ++index) {
        const el = elements[index];
        const box = el.getBoundingClientRect();
        const top = box.top;
        const bottom = top + box.height;

        if (top <= pos && pos < bottom) {
            return index;
        }
    }
    return -1;
}
