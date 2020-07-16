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
export default class KeyManager {
    public keycon = new KeyController();
    public keylist: Array<[string[], string]> = [];
    public keydown(keys: string[], callback: (e: any) => any, description?: any) {
        this.keycon.keydown(keys, e => {
            if (!check(e)) {
                return false;
            }
            callback(e);
        });

        if (description) {
            this.keylist.push([
                keys,
                description,
            ]);
        }
    }
    public keyup(keys: string[], callback: (e: any) => any) {
        this.keycon.keyup(keys, e => {
            if (!check(e)) {
                return false;
            }
            callback(e);
        });
    }
    get altKey() {
        return this.keycon.altKey;
    }
    get shiftKey() {
        return this.keycon.shiftKey;
    }
    get metaKey() {
        return this.keycon.metaKey;
    }
    get ctrlKey() {
        return this.keycon.ctrlKey;
    }
    public destroy() {
        this.keycon.destroy();
    }
}
