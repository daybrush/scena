import { PREFIX } from "./consts";
import Scene, { SceneItem } from "scenejs";

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

export function getTarget(target: Element, conditionCallback: (el: Element) => boolean): Element {
    let parentTarget = target;

    while (parentTarget && parentTarget !== document.body) {
        if (conditionCallback(parentTarget)) {
            return parentTarget;
        }
        parentTarget = parentTarget.parentNode as Element;
    }
    return null;
}
