import MoveableHelper from "moveable-helper";
import Memory from "./Memory";
import { Frame } from "scenejs";

const MoveableData = MoveableHelper.create({
    createAuto: true,
});
export default MoveableData;

export function getTargets(): HTMLElement[] {
    const targets = Memory.get("targets");

    return targets || [];
}
export function getSelectedFrames(): Frame[] {

    return getTargets().map((target: any) => MoveableData.getFrame(target));
}

export function renderFrames() {
    getTargets().forEach((target: any) => {
        MoveableData.render(target);
    });
}

export function setProperty(names: string[], value: any) {
    getSelectedFrames().forEach(frame => {
        frame.set(...names, value);
    });
    renderFrames();
}

export function getProperties(properties: string[][], defaultValues: any[]) {
    const frames = getSelectedFrames();

    if (!frames.length) {
        return properties.map((property, i) => Memory.get(property.join("///")) || defaultValues[i]);
    }

    return properties.map((property, i) => {
        const frameValues = frames.map(frame => frame.get(...property));

        return frameValues.filter(color => color)[0] || defaultValues[i];
    });
}
