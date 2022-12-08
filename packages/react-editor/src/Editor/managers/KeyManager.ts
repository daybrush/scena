import KeyController from "keycon";
import Debugger from "../utils/Debugger";
import { inputChecker } from "../utils/utils";
import ActionManager from "./ActionManager";

export default class KeyManager {
    public keycon = new KeyController();
    public keylist: Array<[string[], string]> = [];
    public isEnable = true;
    constructor(private _actionManager: ActionManager) {

    }
    public enable() {
        this.isEnable = true;
    }
    public disable() {
        this.isEnable = false;
    }
    public actionDown(keys: string[], actionName: string) {
        this.keycon.keydown(keys, this.addCallback("keydown", keys, e => {
            this._actionManager.trigger(actionName, {
                inputEvent: e,
            });
        }, `action down: ${actionName}`));
    }
    public actionUp(keys: string[], actionName: string) {
        this.keycon.keyup(keys, this.addCallback("keyup", keys, e => {
            this._actionManager.trigger(actionName, {
                inputEvent: e,
            });
        }, `action up: ${actionName}`));
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
            if (!this.isEnable || !inputChecker(e)) {
                return false;
            }
            const result = callback(e);

            if (result !== false && description) {
                Debugger.groupLog("key", `${type}: ${keys.join(" + ")}`, description);
            }
        };
    }
}
