import KeyController from "keycon";

function check(e: any) {
    const inputEvent = e.inputEvent;
    const target = inputEvent.target;
    const tagName = target.tagName;

    if (
        target.isContentEditable
        || tagName === "INPUT" || tagName === "TEXTAREA"
    ) {
        return false;
    }
    return true;
}
export function keydown(keys: string[], callback: (e: any) => any) {
    KeyController.global.keydown(keys, e => {
        if (!check(e)) {
            return false;
        }
        callback(e);
    });
}
export function keyup(keys: string[], callback: (e: any) => any) {
    KeyController.global.keyup(keys, e => {
        if (!check(e)) {
            return false;
        }
        callback(e);
    });
}
// KeyController.global.
