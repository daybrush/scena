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
