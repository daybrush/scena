import { PREFIX } from "./consts";

export function prefix(...classNames: string[]) {
    return classNames.map(name => name ? `${PREFIX}${name}` : "").join(" ");
}
