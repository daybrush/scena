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
} from "@daybrush/utils";
import { ElementStructure } from "./types";
import { sync } from "resolve";

export function applyStyle(el: HTMLElement, style: IObject<any>) {
    for (const name in style) {
        el.style[name] = style[name];
    }
}
export function createElement(structure: ElementStructure, parentEl?: Element) {
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
    parentEl && parentEl.appendChild(el);
    return el;
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

export function makeStructure<T>(
    structure: ElementStructure,
    parentEl?: Element,
    ids: IObject<any> = {},
): {structure: ElementStructure, ids: T} {
    const {id, memberof, children} = structure;
    const el = createElement(structure);

    if (id) {
        [].concat(id).forEach(nextId => {
            const isArrayId = nextId.indexOf("[]") > -1;
            const isDoubleArrayId = isArrayId && nextId.indexOf("[][]") > -1;

            if (isArrayId) {
                const objId = nextId.replace(/\[\]/g, "");

                if (!ids[objId]) {
                    ids[objId] = [];
                }
                if (isDoubleArrayId) {
                    ids[objId].push([]);
                } else {
                    ids[objId].push(structure);
                }
            } else {
                ids[nextId] = structure;
            }
        });
    }
    if (memberof) {
        if (!ids[memberof]) {
            ids[memberof] = [[]];
        }
        ids[memberof][ids[memberof].length - 1].push(structure);
    }

    if (children) {
        ([] as Array<string | ElementStructure>).concat(children).filter(child => child).forEach(child => {
            if (isString(child)) {
                makeStructure({ selector: child }, el, ids);
            } else {
                makeStructure(child, el, ids);
            }
        });
    }
    parentEl && parentEl.appendChild(el);

    structure.element = el;
    return {structure, ids} as {structure: ElementStructure, ids: T};
}
export function compare(
    prevArr: any,
    nextArr: any,
    callback: any,
    syncCallback: any,
) {
    const prevKeys: Array<number | string> = prevArr.map(callback);
    const nextKeys: Array<number | string> = nextArr.map(callback);
    const prevKeysObject: IObject<number> = {};
    const nextKeysObject = {};
    const added = [];
    const removed = [];

    prevKeys.forEach((key, i) => {
        prevKeysObject[key] = i;
    });
    nextKeys.forEach((key, i) => {
        if (!(key in prevKeysObject)) {
            added.push(i);
        } else {
            syncCallback(prevArr[prevKeysObject[key]], nextArr[i]);
        }
        nextKeysObject[key] = i;
    });
    prevKeys.forEach((key, i) => {
        if (!(key in nextKeysObject)) {
            removed.push(i);
        }
    });

    return {added, removed};
}
export function makeCompareStructure(
    prevStructure: ElementStructure,
    nextStructures: ElementStructure[],
    callback: any,
    syncCallback?: any,
) {
    const parentElement = prevStructure.element;
    const prevStructures = prevStructure.children;

    const {added, removed} = compare(
        prevStructures,
        nextStructures,
        callback,
        (prev, next) => {
            next.element = prev.element;
            syncCallback && syncCallback(prev, next);
        },
    );
    removed.reverse().forEach(index => {
        parentElement.removeChild(prevStructures[index].element);
    });
    added.forEach(index => {
        const {structure: { element }} = makeStructure(
            nextStructures[index],
        );

        parentElement.insertBefore(
            element,
            nextStructures[index + 1] && nextStructures[index + 1].element,
        );
    });

    prevStructure.children = nextStructures;
}
export function isScene(value: any): value is Scene {
    return value.constructor.name === "Scene";
}
export function isSceneItem(value: any): value is SceneItem {
    return value.constructor.name === "SceneItem";
}
export function isFrame(value: any): value is Frame {
    return value.constructor.name === "Frame";
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
