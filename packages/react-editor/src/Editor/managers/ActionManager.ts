import EventEmitter from "@scena/event-emitter";
import { IObject } from "@daybrush/utils";

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
            this.emit(name, params);
        });
    }
}
