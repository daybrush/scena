import MoveableHelper from "moveable-helper";
import Memory from "./Memory";
import { Frame, NameType } from "scenejs";
import { getId } from "./utils";

export default class MoveableData extends MoveableHelper {
    public selectedTargets: Array<HTMLElement | SVGElement> = [];
    constructor(private memory: Memory) {
        super({
            createAuto: true,
            useBeforeRender: true,
        });
    }
    public setSelectedTargets(targets: Array<HTMLElement | SVGElement>) {
        this.selectedTargets = targets;
    }
    public getSelectedTargets() {
        return this.selectedTargets;
    }
    public getSelectedFrames(): Frame[] {
        return this.getSelectedTargets().map(target => this.getFrame(target));
    }
    public renderFrames() {
        this.getSelectedTargets().forEach((target: any) => {
            this.render(target);
        });
    }
    public setOrders(scope: string[], orders: NameType[]) {
        return this.setValue(frame => {
            frame.setOrders(scope, orders);
        });
    }
    public setProperty(names: string[], value: any) {
        return this.setValue(frame => {
            frame.set(...names, value);
        });
    }
    public removeProperties(...names: string[]) {
        return this.setValue((frame, target) => {
            names.forEach(name => {
                frame.remove(name);
                target.style.removeProperty(name);
            });
        });
    }
    public getProperties(properties: string[][], defaultValues: any[]) {
        const frames = this.getSelectedFrames();
        const memory = this.memory;

        if (!frames.length) {
            return properties.map((property, i) => memory.get(property.join("///")) || defaultValues[i]);
        }

        return properties.map((property, i) => {
            const frameValues = frames.map(frame => frame.get(...property));

            return frameValues.filter(color => color)[0] || defaultValues[i];
        });
    }
    private setValue(callback: (frame: Frame, target: HTMLElement | SVGElement) => void) {
        const targets = this.getSelectedTargets();

        const infos = targets.map(target => {
            const frame = this.getFrame(target);
            const prevOrders = frame.getOrderObject();
            const prev = frame.get();

            callback(frame, target);
            const next = frame.get();
            const nextOrders = frame.getOrderObject();

            return { id: getId(target), prev, prevOrders, next, nextOrders };

        });
        this.renderFrames();

        return infos;
    }

}
