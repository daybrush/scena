import Scene from "scenejs";
import { getTimelineInfo, createElement, toValue, getTarget } from "./utils";
import { drag } from "@daybrush/drag";
import { CSS } from "./consts";
import { hasClass, toArray, isArray, addClass, removeClass } from "@daybrush/utils";
let isExportCSS = false;

/*
.timeline
    .stick_area
        .properties_area
            .properties
        .keyframes_area
            .keyframes_scroll_area
                .keyframes
                    .keyframes_container
                        .keytime * N
                .keyframe_cursor
    .scroll_area
        .properties_area
            .properties * N
        .keyframes_area
            .keyframes_scroll_area
                .keyframes * N
                    .keyframes_container
                        .keyframe * N

*/
export default class Timeline {
    private scene: Scene;
    private timelineEl: HTMLElement;
    private cursorHeaderEl: HTMLElement;
    private cursorEl: HTMLElement;
    private keyframesScrollAreaEl: HTMLElement;
    private keyframesHeaderScrollAreaEl: HTMLElement;
    private keyframesAreaEl: HTMLElement;
    private keyframesHeaderAreaEl: HTMLElement;
    private propertiesAreaEl: HTMLElement;
    constructor(scene: Scene, parentEl: HTMLElement) {
        scene.finish();

        this.scene = scene;
        this.initElement(scene, parentEl);
    }
    private initElement(scene: Scene, parentEl: HTMLElement) {
        const duration = scene.getDuration();
        const timelineInfo = getTimelineInfo(scene);
        const timelineEl = createElement(".timeline");
        if (!isExportCSS) {
            const timelineStyleEl = createElement("style.timeline_style", timelineEl);

            timelineStyleEl.innerHTML = CSS;
            isExportCSS = true;
        }
        const stickyAreaEl = createElement(".sticky_area", timelineEl);
        const propertiesHeaderAreaEl = createElement(".properties_area", stickyAreaEl);
        const keyframesHeaderAreaEl = createElement(".keyframes_area", stickyAreaEl);
        const propertyHeaderEl = createElement(".properties", propertiesHeaderAreaEl);
        const keyframesHeaderScrollAreaEl = createElement(".keyframes_scroll_area", keyframesHeaderAreaEl);
        const keyframesHeaderEl = createElement(".keyframes", keyframesHeaderScrollAreaEl);
        const keyframesHeadeerContainerEl = createElement(".keyframes_container", keyframesHeaderEl);
        const cursorHeaderEl = createElement(".keyframe_cursor", keyframesHeaderScrollAreaEl);
        const cursorEl = createElement(".keyframe_cursor");

        propertyHeaderEl.innerHTML = "Item Name";

        const scrollAreaEl = createElement(".scroll_area", timelineEl);
        const propertiesAreaEl = createElement(".properties_area", scrollAreaEl);
        const keyframesAreaEl = createElement(".keyframes_area", scrollAreaEl);
        const keyframesScrollAreaEl = createElement(".keyframes_scroll_area", keyframesAreaEl);
        const lineAreaEl = createElement(".line_area");
        const maxDuration = Math.ceil(duration);
        const maxTime = maxDuration;

        keyframesHeaderScrollAreaEl.style.minWidth = `${50 * maxTime}px`;
        keyframesScrollAreaEl.style.minWidth = `${50 * maxTime}px`;
        keyframesHeaderScrollAreaEl.style.width = `${(maxDuration ? maxTime / maxDuration : 1) * 100}%`;
        keyframesScrollAreaEl.style.width = `${(maxDuration ? maxTime / maxDuration : 1) * 100}%`;

        for (let i = 0; i <= maxTime; ++i) {
            const time = i;
            const keytimeEl = createElement(".keytime", keyframesHeadeerContainerEl);

            keytimeEl.style.width = `${100 / maxTime}%`;
            keytimeEl.innerHTML = `
          <span>${time}s</span>
          <div class="graduation start"></div>
          <div class="graduation quarter"></div>
          <div class="graduation half"></div>
          <div class="graduation quarter3"></div>
            `;

            const lineEl = createElement(".time_line", lineAreaEl);

            lineEl.style.left = `${100 / maxTime * i}%`;
        }
        for (const property in timelineInfo) {
            const properties = property.split("///");
            const length = properties.length;
            const times = timelineInfo[property];
            const propertyEl = createElement(".properties", propertiesAreaEl);
            const keyframesEl = createElement(".keyframes", keyframesScrollAreaEl);

            createElement(".arrow.unfold", propertyEl);
            const spanEl = createElement("span", propertyEl);
            const keyframesContainerEl = createElement(".keyframes_container", keyframesEl);
            const id = properties[length - 1];

            spanEl.innerHTML = id;
            propertyEl.style.paddingLeft = `${10 + (length - 1) * 20}px`;
            propertyEl.setAttribute("data-id", id);
            propertyEl.setAttribute("data-parent", properties[length - 2] || "");
            propertyEl.setAttribute("data-property", property);
            propertyEl.setAttribute("data-object", "0");

            keyframesEl.setAttribute("data-property", property);

            toArray(propertiesAreaEl.querySelectorAll(`[data-property="${properties.slice(0, -1).join("///").replace(/"/g, "\\\"")}"]`))
            .forEach(el => {
                el.setAttribute("data-object", "1");
            });
            propertyEl.setAttribute("data-item", properties[0]);
            times.forEach(([time, value], i) => {
                const keyframeEl = createElement(".keyframe", keyframesContainerEl);
                const valueText = toValue(value);

                keyframeEl.setAttribute("data-time", time);
                keyframeEl.setAttribute("data-value", valueText);
                keyframeEl.style.left = `${time / maxTime * 100}%`;
                keyframeEl.innerHTML = `${time} ${valueText}`;

                if (times[i + 1]) {
                    const [nextTime, nextValue] = times[i + 1];
                    const nextValueText = toValue(nextValue);

                    if (valueText === nextValueText) {
                        const keyframeLineEl = createElement(".keyframe_line", keyframesContainerEl);

                        keyframeLineEl.style.left = `${time / maxTime * 100}%`;
                        keyframeLineEl.style.width = `${(nextTime - time) / maxTime * 100}%`;
                    }
                }
            });
        }

        keyframesScrollAreaEl.appendChild(lineAreaEl);
        keyframesScrollAreaEl.appendChild(cursorEl);

        this.timelineEl = timelineEl;
        this.cursorEl = cursorEl;
        this.cursorHeaderEl = cursorHeaderEl;
        this.keyframesScrollAreaEl = keyframesScrollAreaEl;
        this.propertiesAreaEl = propertiesAreaEl;
        this.keyframesHeaderScrollAreaEl = keyframesHeaderScrollAreaEl;
        this.keyframesAreaEl = keyframesAreaEl;
        this.keyframesHeaderAreaEl = keyframesHeaderAreaEl;

        this.syncScroll();
        this.wheelZoom();
        this.drag();
        this.fold();

        parentEl && parentEl.appendChild(timelineEl);
    }
    private syncScroll() {
        const {keyframesHeaderAreaEl, keyframesAreaEl} = this;
        let isScrollKeyframe = false;

        keyframesHeaderAreaEl.addEventListener("scroll", () => {
            if (isScrollKeyframe) {
                isScrollKeyframe = false;
            } else {
                isScrollKeyframe = true;
                keyframesAreaEl.scrollLeft = keyframesHeaderAreaEl.scrollLeft;
            }
        });
        keyframesAreaEl.addEventListener("scroll", () => {
            if (isScrollKeyframe) {
                isScrollKeyframe = false;
            } else {
                isScrollKeyframe = true;
                keyframesHeaderAreaEl.scrollLeft = keyframesAreaEl.scrollLeft;
            }
        });
    }
    private wheelZoom() {
        const {keyframesHeaderScrollAreaEl, keyframesScrollAreaEl} = this;
        const originalWidth = parseFloat(keyframesHeaderScrollAreaEl.style.width);
        let width = originalWidth;

        keyframesHeaderScrollAreaEl.addEventListener("wheel", e => {
            const delta = e.deltaY;

            width = Math.max(width + delta / originalWidth * 5, 100);
            keyframesHeaderScrollAreaEl.style.width = `${width}%`;
            keyframesScrollAreaEl.style.width = `${width}%`;
        });
    }
    private fold() {
        const {propertiesAreaEl, keyframesScrollAreaEl} = this;

        function getFoldInfos(target, property) {
            const infos = [];
            let nextElementSibling = target.nextElementSibling;
            while (nextElementSibling) {
                const nextProperty = nextElementSibling.getAttribute("data-property");

                if (nextProperty.indexOf(property) !== 0) {
                    break;
                }
                infos.push(nextElementSibling);
                if (nextElementSibling.getAttribute("data-object") === "1") {
                    const nextInfos = getFoldInfos(nextElementSibling, nextProperty);

                    infos.push(nextInfos);

                    let nextInfo = nextInfos;
                    while (isArray(nextInfo)) {
                        nextInfo = nextInfos[nextInfos.length - 1];
                    }
                    nextElementSibling = nextInfo;
                }
                nextElementSibling = nextElementSibling.nextElementSibling;
            }
            return infos;
        }
        propertiesAreaEl.addEventListener("click", e => {
            const target = getTarget(e.target as Element, el => hasClass(el, "properties"));

            if (!target || target.getAttribute("data-object") === "0") {
                return;
            }
            const isFold = target.getAttribute("data-fold") === "1";
            const property = target.getAttribute("data-property");
            const infos = getFoldInfos(target, property);

            target.setAttribute("data-fold", isFold ? "" : "1");
            infos.forEach(function forEach(info, i, arr) {
                if (isArray(info)) {
                    const prevInfo = arr[i - 1];
                    const isPrevFold = prevInfo.getAttribute("data-fold") === "1";

                    if (!isFold || (isFold && !isPrevFold)) {
                        info.forEach(forEach);
                    }
                } else {
                    const infoProerpty = info.getAttribute("data-property").replace(/"/g, "\\\"");
                    const keyframeEl =
                        keyframesScrollAreaEl.querySelector(`.keyframes[data-property="${infoProerpty}"]`);
                    if (isFold) {
                        removeClass(keyframeEl, "fold");
                        removeClass(info, "fold");
                    } else {
                        addClass(keyframeEl, "fold");
                        addClass(info, "fold");
                    }
                }
            });
        });
    }
    private drag() {
        const {
            cursorEl,
            cursorHeaderEl,
            keyframesScrollAreaEl,
            keyframesHeaderScrollAreaEl,
            scene,
        } = this;

        scene.on("animate", e => {
            const time = e.time;
            const maxDuration = Math.ceil(scene.getDuration());
            const px = 15 - 30 * time / maxDuration;
            const percent = 100 * time / maxDuration;

            cursorEl.style.left = `calc(${percent}% + ${px}px)`;
            cursorHeaderEl.style.left = `calc(${percent}% + ${px}px)`;
        });
        function move(clientX: number) {
            const rect = keyframesScrollAreaEl.getBoundingClientRect();
            const scrollAreaWidth = rect.width - 30;
            const scrollAreaX = rect.left + 15;
            const x = Math.min(scrollAreaWidth, Math.max(clientX - scrollAreaX, 0));
            const percentage = x / scrollAreaWidth;

            scene.setTime(`${percentage * 100}%`);
        }
        drag(cursorHeaderEl, {
            drag: ({clientX}) => {
                move(clientX);
            },
            container: document.body,
        });
        keyframesHeaderScrollAreaEl.addEventListener("click", e => {
            move(e.clientX);
        });
        keyframesScrollAreaEl.addEventListener("click", e => {
            const target = getTarget(e.target as Element, el => hasClass(el, "keyframe"));

            if (target) {
                scene.setTime(target.getAttribute("data-time"));
            } else {
                move(e.clientX);
            }
            e.preventDefault();
        });
    }
}
