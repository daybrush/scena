import { now } from "@daybrush/utils";

let prevTime = 0;
let prevX = -1;
let prevY = -1;

export function dblCheck(isDrag, e, clientX, clientY, callback) {
    const currentTime = now();

    if (!isDrag) {
        if (
            prevX === clientX &&
            prevY === clientY &&
            currentTime - prevTime <= 500
        ) {
            callback(e, clientX, clientY);
        }
        prevX = clientX;
        prevY = clientY;
        prevTime = currentTime;
    }
}
