export const PREFIX = `scenejs-editor-`;
export const SUPPORT_POINTER_EVENTS = "PointerEvent" in window || "MSPointerEvent" in window;
export const SUPPORT_TOUCH = "ontouchstart" in window;

export const CSS = `
.timeline * {
    box-sizing: border-box;
}
.timeline {
  position: relative;
  width: 100%;
  font-size: 0;
  background: #000;
  display: flex;
  flex-direction: column;
}
.header-area, .scroll-area {
   width: 100%;
   position: relative;
  display: flex;
  -webkit-align-items: flex-start;
  align-items: flex-start;
}
.header-area {
  position: relative;
  z-index: 10;
  top: 0;
  height: 30px;
  min-height: 30px;
}
.header-area .keyframes {
  padding: 0px;
}
.header-area .properties-area,
.header-area .keyframes-area,
.header-area .values-area,
.header-area .keyframes-scroll-area {
    height: 100%;
}
.header-area .keyframes-scroll-area {
    overflow: hidden;
}
.header-area .property, .header-area .value, .header-area .keyframes {
  height: 100%;
}
.header-area .property {
    line-height: 30px;
}
.value .add {
    text-align: center;
    color: #fff;
    line-height: 30px;
    font-weight: bold;
    font-size: 20px;
    cursor: pointer;
}
.header-area .keyframes-area::-webkit-scrollbar {
    display: none; // Safari and Chrome
}
.header-area .keyframe-cursor {
    position: absolute;
    border-top: 10px solid #4af;
    border-left: 6px solid transparent;
    border-right: 6px solid transparent;
    width: 0;
    height: 0;
    bottom: 0;
    top: auto;
    background: none;
    cursor: pointer;
}
.control-area .keyframes {
    padding-left: 10px;
}
.play-control-area {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
}
.play-control-area .control {
    position: relative;
    display: inline-block;
    vertical-align: middle;
    color: white;
    margin: 0px 15px;
    cursor: pointer;
}
.play {
    border-left: 14px solid white;
    border-top: 8px solid transparent;
    border-bottom: 8px solid transparent;
}
.pause {
    border-left: 4px solid #fff;
    border-right: 4px solid #fff;
    width: 14px;
    height: 16px;
}
.prev {
    border-right: 10px solid white;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
}
.prev:before {
    position: absolute;
    content: "";
    width: 3px;
    height: 10px;
    top: 0;
    right: 100%;
    transform: translate(0, -50%);
    background: white;
}
.next {
    border-left: 10px solid white;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
}
.next:before {
    position: absolute;
    content: "";
    width: 3px;
    height: 10px;
    top: 0;
    transform: translate(0, -50%);
    background: white;
}
.keytime {
  position: relative;
  display: inline-block;
  height: 100%;
  font-size: 13px;
  font-weight: bold;
  color: #777;
}
.keytime:last-child {
  max-width: 0px;
}
.keytime span {
  position: absolute;
  line-height: 1;
  bottom: 12px;
  display: inline-block;
  transform: translate(-50%);
  color: #eee;
}
.keytime .graduation {
  position: absolute;
  bottom: 0;
  width: 1px;
  height: 10px;
  background: #666;
  transform: translate(-50%);
}
.keytime .graduation.half {
  left: 50%;
  height: 7px;
}
.keytime .graduation.quarter {
  left: 25%;
  height: 5px;
}
.keytime .graduation.quarter3 {
  left: 75%;
  height: 5px;
}
.scroll-area {
  position: relative;
  width: 100%;
  height: calc(100% - 60px);
  overflow: auto;
}
.properties-area, .keyframes-area, .values-area {
  display: inline-block;
  position: relative;
  font-size: 16px;
  overflow: auto;
}

.properties-area::-webkit-scrollbar, .keyframes-area::-webkit-scrollbar {
    display: none; // Safari and Chrome
}
.properties-area {
  width: 30%;
  max-width: 200px;
  box-sizing: border-box;
}
.values-area {
    width: 50px;
    min-width: 50px;
    display: inline-block;
    border-right: 1px solid #666;
    box-sizing: border-box;
}
.value input {
    appearance: none;
    -webkit-appearance: none;
    outline: none;
    position: relative;
    display: block;
    width: 100%;
    height: 100%;
    background: transparent;
    color: #4af;
    font-weight: bold;
    background: none;
    border: 0;
    box-sizing: border-box;
    text-align: center;
}
.value {

}
.alt .value input {
    cursor: ew-resize;
}
.value[data-object="1"] input {
    display: none;
}
.properties-scroll-area {
  display: inline-block;
  min-width: 100%;
}
.keyframes-area {
  flex: 1;
}
.keyframes-scroll-area {
  position: relative;
  min-width: 300px;
}
.keyframes, .property, .value {
  position: relative;
  height: 30px;
  line-height: 30px;
  border-bottom: 1px solid #555;
  box-sizing: border-box;
  white-space: nowrap;
  background: rgba(90, 90, 90, 0.7);
  z-index: 1;
}

.property {
  padding-left: 10px;
  box-sizing: border-box;
  font-size: 13px;
  font-weight: bold;
  color: #eee;
}
.property .remove {
    position: absolute;
    display: inline-block;
    cursor: pointer;
    width: 18px;
    height: 18px;
    top: 0;
    bottom: 0;
    right: 10px;
    margin: auto;
    border-radius: 50%;
    border: 2px solid #fff;
    vertical-align: middle;
    display: none;
    margin-left: 10px;
    box-sizing: border-box;
}
.property .remove:before, .property .remove:after {
    position: absolute;
    content: "";
    width: 8px;
    height: 2px;
    border-radius: 1px;
    background: #fff;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    margin: auto;
}
.property .remove:before {
    transform: rotate(45deg);
}
.property .remove:after {
    transform: rotate(-45deg);
}
.property:hover .remove {
    display: inline-block;
}

[data-item="1"], [data-item="1"] .add {
    height: 30px;
    line-height: 30px;
}
.time-area {
    position: absolute;
    top: 0;
    left: 10px;
    font-size: 13px;
    color: #4af;
    line-height: 30px;
    font-weight: bold;
    height: 100%;
    line-height: 30px;
    border: 0;
    background: transparent;
    outline: 0;
}
.time-area:after {
    content: "s";
}
.property .arrow {
    position: relative;
    display: inline-block;
    width: 20px;
    height: 25px;
    cursor: pointer;
    vertical-align: middle;
}
.property .arrow:after {
    content: "";
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    margin: auto;
    width: 0;
    height: 0;
    border-top: 6px solid #eee;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
}
.property[data-fold="1"] .arrow:after {
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    border-right: 0;
    border-left: 6px solid #eee;
}
.property[data-object="0"] .arrow {
    display: none;
}
.property.fold, .keyframes.fold, .value.fold {
    display: none;
}
.property.select, .value.select, .keyframes.select {
    background: rgba(120, 120, 120, 0.7);
}
.keyframes {

}
.keyframe-delay {
  position: absolute;
  top: 3px;
  bottom: 3px;
  left: 0;
  background: #4af;
  opacity: 0.2;
  z-index: 0;
}
.keyframe-group {
    position: absolute;
    top: 3px;
    bottom: 3px;
    left: 0;
    background: #4af;
    opacity: 0.6;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-left-color: rgba(255, 255, 255, 0.2);
    border-top-color: rgba(255, 255, 255, 0.2);
    z-index: 0;
}
.keyframe-line {
  position: absolute;
  height: 8px;
  top: 0;
  bottom: 0;
  margin: auto;
  background: #666;
  z-index: 0;
}
.keyframe {
  position: absolute;
  font-size: 0px;
  width: 12px;
  height: 12px;
  top: 0px;
  bottom: 0px;
  margin: auto;
  background: #fff;
  border: 2px solid #383838;
  border-radius: 2px;
  box-sizing: border-box;
  transform: translate(-50%) rotate(45deg);
  z-index: 1;
  cursor: pointer;
}
.keyframe[data-no="1"] {
    opacity: 0.2;
}
.select .keyframe {
    border-color: #555;
}
.keyframe.select {
    background: #4af;
}
.keyframes-container, .line-area {
  position: relative;
  width: calc(100% - 30px);
  left: 15px;
  height: 100%;
}
.line-area {
  position: absolute;
  top: 0;
  z-index: 0;
}
.keyframe-cursor {
  position: absolute;
  top: 0;
  z-index: 1;
  background: #4af;
  width: 1px;
  height: 100%;
  left: 15px;
  transform: translate(-50%);
}
.scroll-aare .keyframe-cursor {
  pointer-events: none;
}
.division-line {
  position: absolute;
  background: #333;
  width: 1px;
  height: 100%;
  transform: translate(-50%);
}
`.replace(/\.([^{,\s\d.]+)/g, `.${PREFIX}$1`);

export const DURATION = "duration";
export const FILL_MODE = "fillMode";
export const DIRECTION = "direction";
export const ITERATION_COUNT = "iterationCount";
export const DELAY = "delay";
export const EASING = "easing";
export const PLAY_SPEED = "playSpeed";
export const EASING_NAME = "easingName";
export const ITERATION_TIME = "iterationTime";
export const PAUSED = "paused";
export const ENDED = "ended";
export const TIMEUPDATE = "timeupdate";
export const ANIMATE = "animate";
export const PLAY = "play";
export const RUNNING = "running";
export const ITERATION = "iteration";
export const START_ANIMATION = "startAnimation";
export const PAUSE_ANIMATION = "pauseAnimation";
export const ALTERNATE = "alternate";
export const REVERSE = "reverse";
export const ALTERNATE_REVERSE = "alternate-reverse";
export const NORMAL = "normal";
export const INFINITE = "infinite";
export const PLAY_STATE = "playState";
export const PLAY_CSS = "playCSS";
export const PREV_TIME = "prevTime";
export const TICK_TIME = "tickTime";
export const CURRENT_TIME = "currentTime";
export const SELECTOR = "selector";
export const TRANSFORM_NAME = "transform";
