/*
Copyright (c) 2019 
name: @scenejs/timeline
license: ISC
author: 
repository: git+https://github.com/daybrush/scenejs-timeline.git
version: 0.0.1
*/
import { drag } from '@daybrush/drag';
import { hasClass, isArray, removeClass, addClass, toArray } from '@daybrush/utils';
import Axes, { PinchInput } from '@egjs/axes';

var PREFIX = "scenejs_timeline_";
var FOLD_CLASS = PREFIX + "fold";
var CSS = "\n.timeline {\n  position: relative;\n  font-size: 0;\n  background: #000;\n}\n.sticky_area, .scroll_area {\n   width: 100%;\n   position: relative;\n  display: flex;\n  -webkit-align-items: flex-start;\n  align-items: flex-start;\n}\n.sticky_area {\n  position: relative;\n  z-index: 10;\n  top: 0;\n  height: 30px;\n}\n.sticky_area .keyframes {\n  padding: 0px;\n}\n.sticky_area .properties_area,\n.sticky_area .properties,\n.sticky_area .keyframes_area,\n.sticky_area .keyframes_scroll_area,\n.sticky_area .keyframes {\n  height: 100%;\n}\n.sticky_area .keyframes_area::-webkit-scrollbar {\n    display: none; // Safari and Chrome\n}\n.sticky_area .keyframe_cursor {\n    position: absolute;\n    border-top: 10px solid #f55;\n    border-left: 5px solid transparent;\n    border-right: 5px solid transparent;\n    width: 0;\n    height: 0;\n    bottom: 0;\n    top: auto;\n    background: none;\n    cursor: pointer;\n}\n.keytime {\n  position: relative;\n  display: inline-block;\n  height: 100%;\n  font-size: 13px;\n  font-weight: bold;\n  color: #777;\n}\n.keytime:last-child {\n  max-width: 0px;\n}\n.keytime span {\n  display: inline-block;\n  transform: translate(-50%);\n  color: #eee;\n}\n.keytime .graduation {\n  position: absolute;\n  bottom: 0;\n  width: 1px;\n  height: 10px;\n  background: #999;\n  transform: translate(-50%);\n}\n.keytime .graduation.half {\n  left: 50%;\n  height: 7px;\n}\n.keytime .graduation.quarter {\n  left: 25%;\n  height: 5px;\n}\n.keytime .graduation.quarter3 {\n  left: 75%;\n  height: 5px;\n}\n.scroll_area {\n  position: relative;\n  width: 100%;\n  height: calc(100% - 30px);\n  overflow: auto;\n}\n.properties_area, .keyframes_area {\n  display: inline-block;\n  position: relative;\n  font-size: 16px;\n  overflow: auto;\n}\n.properties_area {\n  width: 30%;\n  max-width: 200px;\n  border-right: 1px solid #999;\n  box-sizing: border-box;\n}\n.keyframes_area {\n  flex: 1;\n}\n.keyframes_scroll_area {\n  position: relative;\n  min-width: 300px;\n}\n.keyframes, .properties {\n  position: relative;\n  height: 25px;\n  border-bottom: 1px solid #777;\n  box-sizing: border-box;\n  white-space: nowrap;\n  background: rgba(73, 73, 73, 0.7);\n  z-index: 1;\n}\n.properties:nth-child(2n), .keyframes:nth-child(2n) {\n  background: rgba(90, 90, 90, 0.7);\n}\n.properties {\n  line-height: 25px;\n  padding-left: 10px;\n  box-sizing: border-box;\n  font-size: 13px;\n  font-weight: bold;\n  color: #eee;\n}\n\n.properties .arrow {\n    position: relative;\n    display: inline-block;\n    margin-right: 5px;\n    width: 0;\n    vertical-align: middle;\n}\n.properties .arrow {\n    border-top: 6px solid #eee;\n    border-left: 4px solid transparent;\n    border-right: 4px solid transparent;\n}\n.properties[data-fold=\"1\"] .arrow {\n    border-top: 4px solid transparent;\n    border-bottom: 4px solid transparent;\n    border-right: 0;\n    border-left: 6px solid #eee;\n    margin-left: 2px;\n}\n.properties[data-object=\"0\"] .arrow {\n    display: none;\n}\n.properties.fold, .keyframes.fold {\n    display: none;\n}\n.keyframes {\n\n}\n.keyframe_line {\n  position: absolute;\n  height: 8px;\n  top: 0;\n  bottom: 0;\n  margin: auto;\n  background: #aaa;\n  z-index: 0;\n}\n.keyframe {\n  position: absolute;\n  font-size: 0px;\n  width: 8px;\n  height: 8px;\n  top: 0px;\n  bottom: 0px;\n  margin: auto;\n  background: #fff;\n  border: 2px solid #333;\n  border-radius: 2px;\n  transform: translate(-50%) rotate(45deg);\n  z-index: 1;\n  cursor: pointer;\n}\n.keyframes_container, .line_area {\n  position: relative;\n  width: calc(100% - 30px);\n  left: 15px;\n  height: 100%;\n}\n.line_area {\n  position: absolute;\n  top: 0;\n  z-index: 0;\n}\n.keyframe_cursor {\n  position: absolute;\n  top: 0;\n  z-index: 1;\n  background: #f55;\n  width: 1px;\n  height: 100%;\n  left: 15px;\n  transform: translate(-50%);\n}\n.division_line {\n  position: absolute;\n  background: #333;\n  width: 1px;\n  height: 100%;\n  transform: translate(-50%);\n}\n".replace(/\.([^{,\s\d.]+)/g, "." + PREFIX + "$1");

function createElement(selector, parentEl) {
  var classNames = selector.match(/\.([^.#\s])+/g) || [];
  var tag = (selector.match(/^[^.#\s]+/g) || [])[0] || "div";
  var id = (selector.match(/#[^.#\s]+/g) || [])[0] || "";
  var el = document.createElement(tag);
  id && (el.id = id.replace(/^#/g, ""));
  el.className = classNames.map(function (name) {
    return "" + PREFIX + name.replace(/^\./g, "");
  }).join(" ");
  parentEl && parentEl.appendChild(el);
  return el;
}
function keys(value) {
  var arr = [];

  for (var name in value) {
    arr.push(name);
  }

  return arr;
}
function toValue(value) {
  var type = typeof value;

  if (type === "object") {
    if (Array.isArray(value)) {
      return "[" + value.join(", ") + "]";
    }

    return "{" + keys(value).map(function (k) {
      return k + ": " + toValue(value[k]);
    }).join(", ") + "}";
  }

  return value;
}
function getTimelineInfo(scene) {
  var timelineInfo = {};
  scene.forEach(function (item) {
    var delay = item.getDelay();
    var times = item.times;
    times.forEach(function (time) {
      var frame = item.getFrame(time);

      (function forEach() {
        var objs = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          objs[_i] = arguments[_i];
        }

        var length = objs.length;
        var lastObj = objs[length - 1];
        var properties = objs.slice(0, -1);
        var name = properties.join("///");

        if (name) {
          if (!timelineInfo[name]) {
            timelineInfo[name] = [];
          }

          var info = timelineInfo[name];
          info.push([delay + time, lastObj]);
        }

        if (typeof lastObj === "object") {
          Object.keys(lastObj).forEach(function (name2) {
            forEach.apply(void 0, properties.concat([name2, lastObj[name2]]));
          });
        }
      })(item.getId(), frame.get());
    });
  });
  return timelineInfo;
}
function getTarget(target, conditionCallback) {
  var parentTarget = target;

  while (parentTarget && parentTarget !== document.body) {
    if (conditionCallback(parentTarget)) {
      return parentTarget;
    }

    parentTarget = parentTarget.parentNode;
  }

  return null;
}

var isExportCSS = false;
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

var Timeline =
/*#__PURE__*/
function () {
  function Timeline(scene, parentEl) {
    scene.finish();
    this.scene = scene;
    this.initElement(scene, parentEl);
  }

  var __proto = Timeline.prototype;

  __proto.getElement = function () {
    return this.timelineEl;
  };

  __proto.initElement = function (scene, parentEl) {
    var duration = scene.getDuration();
    var timelineInfo = getTimelineInfo(scene);
    var timelineEl = createElement(".timeline");

    if (!isExportCSS) {
      var timelineStyleEl = createElement("style.timeline_style", timelineEl);
      timelineStyleEl.innerHTML = CSS;
      isExportCSS = true;
    }

    var stickyAreaEl = createElement(".sticky_area", timelineEl);
    var propertiesHeaderAreaEl = createElement(".properties_area", stickyAreaEl);
    var keyframesHeaderAreaEl = createElement(".keyframes_area", stickyAreaEl);
    var propertyHeaderEl = createElement(".properties", propertiesHeaderAreaEl);
    var keyframesHeaderScrollAreaEl = createElement(".keyframes_scroll_area", keyframesHeaderAreaEl);
    var keyframesHeaderEl = createElement(".keyframes", keyframesHeaderScrollAreaEl);
    var keyframesHeadeerContainerEl = createElement(".keyframes_container", keyframesHeaderEl);
    var cursorHeaderEl = createElement(".keyframe_cursor", keyframesHeaderScrollAreaEl);
    var cursorEl = createElement(".keyframe_cursor");
    propertyHeaderEl.innerHTML = "Item Name";
    var scrollAreaEl = createElement(".scroll_area", timelineEl);
    var propertiesAreaEl = createElement(".properties_area", scrollAreaEl);
    var keyframesAreaEl = createElement(".keyframes_area", scrollAreaEl);
    var keyframesScrollAreaEl = createElement(".keyframes_scroll_area", keyframesAreaEl);
    var lineAreaEl = createElement(".line_area");
    var maxDuration = Math.ceil(duration);
    var maxTime = maxDuration;
    keyframesHeaderScrollAreaEl.style.minWidth = 50 * maxTime + "px";
    keyframesScrollAreaEl.style.minWidth = 50 * maxTime + "px";
    keyframesHeaderScrollAreaEl.style.width = (maxDuration ? maxTime / maxDuration : 1) * 100 + "%";
    keyframesScrollAreaEl.style.width = (maxDuration ? maxTime / maxDuration : 1) * 100 + "%";

    for (var i = 0; i <= maxTime; ++i) {
      var time = i;
      var keytimeEl = createElement(".keytime", keyframesHeadeerContainerEl);
      keytimeEl.style.width = 100 / maxTime + "%";
      createElement("span", keytimeEl).innerHTML = time + "s";
      createElement(".graduation.start", keytimeEl);
      createElement(".graduation.quarter", keytimeEl);
      createElement(".graduation.half", keytimeEl);
      createElement(".graduation.quarter3", keytimeEl);
      createElement(".division_line", lineAreaEl).style.left = 100 / maxTime * i + "%";
    }

    var _loop_1 = function (property) {
      var properties = property.split("///");
      var length = properties.length;
      var times = timelineInfo[property];
      var propertyEl = createElement(".properties", propertiesAreaEl);
      var keyframesEl = createElement(".keyframes", keyframesScrollAreaEl);
      createElement(".arrow.unfold", propertyEl);
      var spanEl = createElement("span", propertyEl);
      var keyframesContainerEl = createElement(".keyframes_container", keyframesEl);
      var id = properties[length - 1];
      spanEl.innerHTML = id;
      propertyEl.style.paddingLeft = 10 + (length - 1) * 20 + "px";
      propertyEl.setAttribute("data-id", id);
      propertyEl.setAttribute("data-parent", properties[length - 2] || "");
      propertyEl.setAttribute("data-property", property);
      propertyEl.setAttribute("data-object", "0");
      keyframesEl.setAttribute("data-property", property);
      toArray(propertiesAreaEl.querySelectorAll("[data-property=\"" + properties.slice(0, -1).join("///").replace(/"/g, "\\\"") + "\"]")).forEach(function (el) {
        el.setAttribute("data-object", "1");
      });
      propertyEl.setAttribute("data-item", properties[0]);
      times.forEach(function (_a, i) {
        var time = _a[0],
            value = _a[1];
        var keyframeEl = createElement(".keyframe", keyframesContainerEl);
        var valueText = toValue(value);
        keyframeEl.setAttribute("data-time", time);
        keyframeEl.setAttribute("data-value", valueText);
        keyframeEl.style.left = time / maxTime * 100 + "%";
        keyframeEl.innerHTML = time + " " + valueText;

        if (times[i + 1]) {
          var _b = times[i + 1],
              nextTime = _b[0],
              nextValue = _b[1];
          var nextValueText = toValue(nextValue);

          if (valueText === nextValueText) {
            var keyframeLineEl = createElement(".keyframe_line", keyframesContainerEl);
            keyframeLineEl.style.left = time / maxTime * 100 + "%";
            keyframeLineEl.style.width = (nextTime - time) / maxTime * 100 + "%";
          }
        }
      });
    };

    for (var property in timelineInfo) {
      _loop_1(property);
    }

    keyframesScrollAreaEl.appendChild(lineAreaEl);
    keyframesScrollAreaEl.appendChild(cursorEl);
    this.timelineEl = timelineEl;
    this.cursorEl = cursorEl;
    this.cursorHeaderEl = cursorHeaderEl;
    this.keyframesScrollAreaEl = keyframesScrollAreaEl;
    this.scrollAreaEl = scrollAreaEl;
    this.propertiesAreaEl = propertiesAreaEl;
    this.keyframesHeaderScrollAreaEl = keyframesHeaderScrollAreaEl;
    this.keyframesAreaEl = keyframesAreaEl;
    this.keyframesHeaderAreaEl = keyframesHeaderAreaEl;
    this.syncScroll();
    this.wheelZoom();
    this.drag();
    this.fold();
    parentEl && parentEl.appendChild(timelineEl);
  };

  __proto.syncScroll = function () {
    var _a = this,
        keyframesHeaderAreaEl = _a.keyframesHeaderAreaEl,
        keyframesAreaEl = _a.keyframesAreaEl;

    var isScrollKeyframe = false;
    keyframesHeaderAreaEl.addEventListener("scroll", function () {
      if (isScrollKeyframe) {
        isScrollKeyframe = false;
      } else {
        isScrollKeyframe = true;
        keyframesAreaEl.scrollLeft = keyframesHeaderAreaEl.scrollLeft;
      }
    });
    keyframesAreaEl.addEventListener("scroll", function () {
      if (isScrollKeyframe) {
        isScrollKeyframe = false;
      } else {
        isScrollKeyframe = true;
        keyframesHeaderAreaEl.scrollLeft = keyframesAreaEl.scrollLeft;
      }
    });
  };

  __proto.wheelZoom = function () {
    var _a = this,
        keyframesHeaderScrollAreaEl = _a.keyframesHeaderScrollAreaEl,
        keyframesScrollAreaEl = _a.keyframesScrollAreaEl;

    var originalWidth = parseFloat(keyframesHeaderScrollAreaEl.style.width);
    var axes = new Axes({
      zoom: {
        range: [100, Infinity]
      }
    }, {}, {
      zoom: originalWidth
    });
    axes.connect("zoom", new PinchInput(keyframesScrollAreaEl, {
      scale: 0.7,
      hammerManagerOptions: {
        touchAction: "auto"
      }
    }));
    axes.on("hold", function (e) {
      console.log("hold");

      if (e.inputEvent) {
        e.inputEvent.preventDefault();
      }
    });
    axes.on("change", function (e) {
      var width = e.pos.zoom;
      keyframesHeaderScrollAreaEl.style.width = width + "%";
      keyframesScrollAreaEl.style.width = width + "%";

      if (e.inputEvent) {
        e.inputEvent.preventDefault();
      }
    });
    keyframesHeaderScrollAreaEl.addEventListener("wheel", function (e) {
      var delta = e.deltaY;
      axes.setBy({
        zoom: delta / originalWidth * 5
      });
    });
  };

  __proto.fold = function () {
    var _a = this,
        propertiesAreaEl = _a.propertiesAreaEl,
        keyframesScrollAreaEl = _a.keyframesScrollAreaEl;

    function getFoldInfos(target, property) {
      var infos = [];
      var nextElementSibling = target.nextElementSibling;

      while (nextElementSibling) {
        var nextProperty = nextElementSibling.getAttribute("data-property");

        if (nextProperty.indexOf(property) !== 0) {
          break;
        }

        infos.push(nextElementSibling);

        if (nextElementSibling.getAttribute("data-object") === "1") {
          var nextInfos = getFoldInfos(nextElementSibling, nextProperty);
          infos.push(nextInfos);
          var nextInfo = nextInfos;

          while (isArray(nextInfo)) {
            nextInfo = nextInfos[nextInfos.length - 1];
          }

          nextElementSibling = nextInfo;
        }

        nextElementSibling = nextElementSibling.nextElementSibling;
      }

      return infos;
    }

    propertiesAreaEl.addEventListener("click", function (e) {
      var target = getTarget(e.target, function (el) {
        return hasClass(el, PREFIX + "properties");
      });

      if (!target || target.getAttribute("data-object") === "0") {
        return;
      }

      var isFold = target.getAttribute("data-fold") === "1";
      var property = target.getAttribute("data-property");
      var infos = getFoldInfos(target, property);
      target.setAttribute("data-fold", isFold ? "" : "1");
      infos.forEach(function forEach(info, i, arr) {
        if (isArray(info)) {
          var prevInfo = arr[i - 1];
          var isPrevFold = prevInfo.getAttribute("data-fold") === "1";

          if (!isFold || isFold && !isPrevFold) {
            info.forEach(forEach);
          }
        } else {
          var infoProerpty = info.getAttribute("data-property").replace(/"/g, "\\\"");
          var keyframeEl = keyframesScrollAreaEl.querySelector("." + PREFIX + "keyframes[data-property=\"" + infoProerpty + "\"]");

          if (isFold) {
            removeClass(keyframeEl, FOLD_CLASS);
            removeClass(info, FOLD_CLASS);
          } else {
            addClass(keyframeEl, FOLD_CLASS);
            addClass(info, FOLD_CLASS);
          }
        }
      });
    });
  };

  __proto.drag = function () {
    var _a = this,
        cursorEl = _a.cursorEl,
        cursorHeaderEl = _a.cursorHeaderEl,
        scrollAreaEl = _a.scrollAreaEl,
        keyframesAreaEl = _a.keyframesAreaEl,
        keyframesScrollAreaEl = _a.keyframesScrollAreaEl,
        keyframesHeaderScrollAreaEl = _a.keyframesHeaderScrollAreaEl,
        scene = _a.scene;

    scene.on("animate", function (e) {
      var time = e.time;
      var maxDuration = Math.ceil(scene.getDuration());
      var px = 15 - 30 * time / maxDuration;
      var percent = 100 * time / maxDuration;
      cursorEl.style.left = "calc(" + percent + "% + " + px + "px)";
      cursorHeaderEl.style.left = "calc(" + percent + "% + " + px + "px)";
    });

    function move(clientX) {
      var rect = keyframesScrollAreaEl.getBoundingClientRect();
      var scrollAreaWidth = rect.width - 30;
      var scrollAreaX = rect.left + 15;
      var x = Math.min(scrollAreaWidth, Math.max(clientX - scrollAreaX, 0));
      var percentage = x / scrollAreaWidth;
      scene.setTime(percentage * 100 + "%");
    }

    function click(e, clientX) {
      var target = getTarget(e.target, function (el) {
        return hasClass(el, PREFIX + "keyframe");
      });

      if (target) {
        scene.setTime(target.getAttribute("data-time"));
      } else {
        move(clientX);
      }

      e.preventDefault();
    }

    drag(keyframesScrollAreaEl, {
      events: ["touch"],
      container: window,
      drag: function (_a) {
        var deltaX = _a.deltaX,
            deltaY = _a.deltaY,
            inputEvent = _a.inputEvent;
        keyframesAreaEl.scrollLeft -= deltaX;
        scrollAreaEl.scrollTop -= deltaY;
        inputEvent.preventDefault();
      },
      dragend: function (_a) {
        var isDrag = _a.isDrag,
            clientX = _a.clientX,
            inputEvent = _a.inputEvent;
        !isDrag && click(inputEvent, clientX);
      }
    });
    drag(cursorHeaderEl, {
      drag: function (_a) {
        var clientX = _a.clientX;
        move(clientX);
      },
      container: window
    });
    keyframesHeaderScrollAreaEl.addEventListener("click", function (e) {
      move(e.clientX);
    });
    keyframesScrollAreaEl.addEventListener("click", function (e) {
      click(e, e.clientX);
    });
  };

  return Timeline;
}();

export default Timeline;
//# sourceMappingURL=timeline.esm.js.map
