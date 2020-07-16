import MoveableHelper from "moveable-helper";
import Memory from "./Memory";
import { Frame } from "scenejs";

export default class MoveableData extends MoveableHelper {
    public selectedTargets: Array<HTMLElement | SVGElement> = [];
    constructor(private memory: Memory) {
        super({
            createAuto: true,
        })
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
    public setProperty(names: string[], value: any) {
        this.getSelectedFrames().forEach(frame => {
            frame.set(...names, value);
        });
        this.renderFrames();
    }
    public removeProperty(name: string) {
        this.getSelectedTargets().forEach(target => {
            this.getFrame(target).remove(name);
            target.style.removeProperty(name);
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

}
