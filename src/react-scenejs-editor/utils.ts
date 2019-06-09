import { PREFIX } from "./consts";
import { SceneItem } from "scenejs";

export function prefix(...classNames: string[]) {
    return classNames.map(name => `${PREFIX}${name}`).join(" ");
}

export function ref(target: any, name: string) {
    return (e: any) => {
        e && (target[name] = e);
    };
}

export function isSceneItem(value: any): value is SceneItem {
    return value && !!(value.constructor as typeof SceneItem).prototype.getFrame;
}
