import KeyController from "keycon";
import Debugger from "../utils/Debugger";

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
    constructor(private console: Debugger) {}
    public keycon = new KeyController();
    public keylist: Array<[string[], string]> = [];
    public isEnable = true;

    public enable() {
        this.isEnable = true;
    }
    public disable() {
        this.isEnable = false;
    }
    public keydown(keys: string[], callback: (e: any) => any, description?: any) {
        this.keycon.keydown(keys, e => {
            if (!this.isEnable || !check(e)) {
                return false;
            }

            if (description) {
                this.console.log(`keydown: ${keys.join(" + ")}`, description);
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
    public keyup(keys: string[], callback: (e: any) => any, description?: any) {
        this.keycon.keyup(keys, e => {
            if (!this.isEnable || !check(e)) {
                return false;
            }
            if (description) {
                this.console.log(`keyup: ${keys.join(" + ")}`, description);
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
