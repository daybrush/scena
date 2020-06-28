import Component from "@egjs/component";
import { IObject } from "@daybrush/utils";

class Bus extends Component {
    private eventMap: IObject<number> = {};
    requestTrigger(name: string, params: IObject<any> = {}) {
        const eventMap = this.eventMap;
        cancelAnimationFrame(eventMap[name] || 0);

        eventMap[name] = requestAnimationFrame(() => {
            this.trigger(name, params);
        });
    }
}
const EventBus = new Bus();

export default EventBus;
