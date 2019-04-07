export const PREFIX = `scenejs_timeline_`;

export const FOLD_CLASS = `${PREFIX}fold`;
export const CSS = `
.timeline {
  position: relative;
  font-size: 0;
  background: #000;
}
.sticky_area, .scroll_area {
   width: 100%;
   position: relative;
  display: flex;
  -webkit-align-items: flex-start;
  align-items: flex-start;
}
.sticky_area {
  position: relative;
  z-index: 10;
  top: 0;
  height: 30px;
}
.sticky_area .keyframes {
  padding: 0px;
}
.sticky_area .properties_area,
.sticky_area .properties,
.sticky_area .keyframes_area,
.sticky_area .keyframes_scroll_area,
.sticky_area .keyframes {
  height: 100%;
}
.sticky_area .keyframes_area::-webkit-scrollbar {
    display: none; // Safari and Chrome
}
.sticky_area .keyframe_cursor {
    position: absolute;
    border-top: 10px solid #f55;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    width: 0;
    height: 0;
    bottom: 0;
    top: auto;
    background: none;
    cursor: pointer;
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
  display: inline-block;
  transform: translate(-50%);
  color: #eee;
}
.keytime .graduation {
  position: absolute;
  bottom: 0;
  width: 1px;
  height: 10px;
  background: #999;
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
.scroll_area {
  position: relative;
  width: 100%;
  height: calc(100% - 30px);
  overflow: auto;
}
.properties_area, .keyframes_area {
  display: inline-block;
  position: relative;
  font-size: 16px;
  overflow: auto;
}
.properties_area {
  width: 30%;
  max-width: 200px;
  border-right: 1px solid #999;
  box-sizing: border-box;
}
.keyframes_area {
  flex: 1;
}
.keyframes_scroll_area {
  position: relative;
  min-width: 300px;
}
.keyframes, .properties {
  position: relative;
  height: 25px;
  border-bottom: 1px solid #777;
  box-sizing: border-box;
  white-space: nowrap;
  background: rgba(73, 73, 73, 0.7);
  z-index: 1;
}
.properties:nth-child(2n), .keyframes:nth-child(2n) {
  background: rgba(90, 90, 90, 0.7);
}
.properties {
  line-height: 25px;
  padding-left: 10px;
  box-sizing: border-box;
  font-size: 13px;
  font-weight: bold;
  color: #eee;
}

.properties .arrow {
    position: relative;
    display: inline-block;
    margin-right: 5px;
    width: 0;
    vertical-align: middle;
}
.properties .arrow {
    border-top: 6px solid #eee;
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
}
.properties[data-fold="1"] .arrow {
    border-top: 4px solid transparent;
    border-bottom: 4px solid transparent;
    border-right: 0;
    border-left: 6px solid #eee;
    margin-left: 2px;
}
.properties[data-object="0"] .arrow {
    display: none;
}
.properties.fold, .keyframes.fold {
    display: none;
}
.keyframes {

}
.keyframe_line {
  position: absolute;
  height: 8px;
  top: 0;
  bottom: 0;
  margin: auto;
  background: #aaa;
  z-index: 0;
}
.keyframe {
  position: absolute;
  font-size: 0px;
  width: 8px;
  height: 8px;
  top: 0px;
  bottom: 0px;
  margin: auto;
  background: #fff;
  border: 2px solid #333;
  border-radius: 2px;
  transform: translate(-50%) rotate(45deg);
  z-index: 1;
  cursor: pointer;
}
.keyframes_container, .line_area {
  position: relative;
  width: calc(100% - 30px);
  left: 15px;
  height: 100%;
}
.line_area {
  position: absolute;
  top: 0;
  z-index: 0;
}
.keyframe_cursor {
  position: absolute;
  top: 0;
  z-index: 1;
  background: #f55;
  width: 1px;
  height: 100%;
  left: 15px;
  transform: translate(-50%);
}
.division_line {
  position: absolute;
  background: #333;
  width: 1px;
  height: 100%;
  transform: translate(-50%);
}
`.replace(/\.([^{,\s\d.]+)/g, `.${PREFIX}$1`);
