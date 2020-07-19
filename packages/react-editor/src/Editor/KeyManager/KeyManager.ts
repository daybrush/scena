import KeyController from "keycon";
import Debugger from "../utils/Debugger";
import { checkInput } from "../utils/utils";

function check(e: any) {
    const inputEvent = e.inputEvent;
    const target = inputEvent.target;

    if (checkInput(target)) {
        return false;
    }
    return true;
}
export default class KeyManager {
    constructor(private console: Debugger) { }
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
        this.keycon.keydown(keys, this.addCallback("keydown", keys, callback, description));
    }
    public keyup(keys: string[], callback: (e: any) => any, description?: any) {
        this.keycon.keyup(keys, this.addCallback("keyup", keys, callback, description));
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
    private addCallback(type: string, keys: string[], callback: (e: any) => any, description?: string) {
        if (description) {
            this.keylist.push([
                keys,
                description,
            ]);
        }
        return (e: any) => {
            if (!this.isEnable || !check(e)) {
                return false;
            }
            const result = callback(e);

            if (result !== false && description) {
                this.console.log(`${type}: ${keys.join(" + ")}`, description);
            }
        };
    }
}
