import * as ReactDOM from "react-dom";
import { OnDrag } from "@daybrush/drag";

export function findDOMRef(component: any, name: string) {
    return (e: any) => {
        e && (component[name] = ReactDOM.findDOMNode(e));
    };
}

export function getTranslateName(type: "vertical" | "horizontal", isReverse?: boolean) {
    const isHorizontal = type === "horizontal";

    return `translate${(!isReverse && isHorizontal) || (isReverse && !isHorizontal) ? "Y" : "X"}`;
}
export function measureSpeed(e: OnDrag) {
    const { deltaX, deltaY, datas } = e;
    const time = Date.now();
    const prevSpeed = datas.speed;

    if (!prevSpeed) {
        datas.speed = [0, 0];
        datas.time = time;
        return;
    }
    const dt = time - datas.time;
    datas.speed = [prevSpeed[0] / 2 + deltaX / dt, prevSpeed[1] / 2 + deltaY / dt];
}

export function getDuration(speed: number[], a: number) {
    const normalSpeed = Math.sqrt(speed[0] * speed[0] + speed[1] * speed[1]);

    return Math.abs(normalSpeed / a);
} 
export function getDestPos(speed: number[], a: number) {
    const duration = getDuration(speed, a);

	return [
		speed[0] / 2 * duration,
		speed[1] / 2 * duration,
	];
}
