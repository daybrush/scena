import EventEmitter, { EventListener, EventHash } from "@scena/event-emitter";
import { IObject, isString } from "@daybrush/utils";
import Debugger from "../utils/Debugger";

interface ActionEvent {
    inputEvent?: Event;
    stopLog(): void;
    [key: string]: any;
}
interface ActionEvents {
    [key: string]: ActionEvent;
}
export default class ActionManager extends EventEmitter<ActionEvents> {
    private _eventMap: IObject<number> = {};
    private _registered: IObject<boolean> = {};

    public on<Name extends keyof ActionEvents, Param = ActionEvents[Name]>(
        eventName: Name, listener: EventListener<Param, this>): this;
    public on(events: EventHash<ActionEvents, this>): this;
    public on(eventName: any, listener?: any) {

        if (isString(eventName)) {
            this._registered[eventName] = true;
        }
        return super.on(eventName, listener);
    }
    public requestAct(name: string, param: Partial<ActionEvent> = {}) {
        const eventMap = this._eventMap;

        cancelAnimationFrame(eventMap[name] || 0);

        eventMap[name] = requestAnimationFrame(() => {
            this.act(name, param);
        });
    }
    public act(actionName: string, param: Partial<ActionEvent> = {}) {
        let isStopLog = false;

        const result = this.emit(actionName, {
            ...param,
            stopLog() {
                isStopLog = true;
            },
        });

        if (!isStopLog && this._registered[actionName]) {
            Debugger.groupLog("action", `Act: ${actionName}`);
        }
        return result;
    }
}
