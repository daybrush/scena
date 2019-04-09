import { PREFIX } from "./consts";
import Scene, { SceneItem, Frame } from "scenejs";
import {
    hasClass as hasClass2,
    addClass as addClass2,
    removeClass as removeClass2,
    isString,
    IObject,
    isObject,
} from "@daybrush/utils";
import { ElementStructure } from "./types";

export function createElement(selector: string, parentEl?: Element) {
    const classNames = selector.match(/\.([^.#\s])+/g) || [];
    const tag = (selector.match(/^[^.#\s]+/g) || [])[0] || "div";
    const id = (selector.match(/#[^.#\s]+/g) || [])[0] || "";
    const el = document.createElement(tag);

    id && (el.id = id.replace(/^#/g, ""));
    el.className = classNames.map(name => `${PREFIX}${name.replace(/^\./g, "")}`).join(" ");

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
            const nextObj = flatObject(value.constructor.name === "Frame" ? (value as Frame).get() : value);

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

export function makeStructure<T, U>(
    structure: ElementStructure,
    parentEl?: Element,
    obj: {
        structures: IObject<any>,
        elements: IObject<any>
    } = {structures: {}, elements: {}},
): {structures: T, elements: U} {
    const {selector, id, attr, dataset, children, style, html} = structure;
    const el = createElement(selector);

    if (id) {
        if (id.indexOf("[]") > -1) {
            const objId = id.replace("[]", "");

            if (!obj.structures[objId]) {
                obj.structures[objId] = [];
                obj.elements[objId] = [];
            }
            obj.structures[objId].push(structure);
            obj.elements[objId].push(el);
        } else {
            obj.elements[id] = el;
            obj.structures[id] = structure;
        }
    }
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
        for (const name in style) {
            el.style[name] = style[name];
        }
    }
    if (html) {
        el.innerHTML = html;
    }
    if (children) {
        ([] as Array<string | ElementStructure>).concat(children).filter(child => child).forEach(child => {
            if (isString(child)) {
                makeStructure({ selector: child }, el, obj);
            } else {
                makeStructure(child, el, obj);
            }
        });
    }
    parentEl && parentEl.appendChild(el);

    return (obj as any);
}
