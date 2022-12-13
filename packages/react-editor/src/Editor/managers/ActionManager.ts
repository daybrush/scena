import EventEmitter, { TargetParam } from "@scena/event-emitter";
import { IObject } from "@daybrush/utils";
import Debugger from "../utils/Debugger";

interface ActionEvent {
    inputEvent?: Event;
}
interface ActionEvents {
    [key: string]: ActionEvent;
}
export default class ActionManager extends EventEmitter<ActionEvents> {
    private eventMap: IObject<number> = {};
    requestTrigger(name: string, params: IObject<any> = {}) {
        const eventMap = this.eventMap;
        cancelAnimationFrame(eventMap[name] || 0);

        eventMap[name] = requestAnimationFrame(() => {
            this.act(name, params);
        });
    }
    public act(actionName: string, param: ActionEvent = {}) {
        Debugger.groupLog("action", `Act: ${actionName}`);
        return this.emit(actionName, param);
    }
}
