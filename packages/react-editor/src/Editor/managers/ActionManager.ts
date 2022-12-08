import EventEmitter from "@scena/event-emitter";
import { IObject } from "@daybrush/utils";

export default class ActionManager extends EventEmitter {
    private eventMap: IObject<number> = {};
    requestTrigger(name: string, params: IObject<any> = {}) {
        const eventMap = this.eventMap;
        cancelAnimationFrame(eventMap[name] || 0);

        eventMap[name] = requestAnimationFrame(() => {
            this.trigger(name, params);
        });
    }
}
