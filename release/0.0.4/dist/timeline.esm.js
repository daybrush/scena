/*
Copyright (c) 2019 
name: @scenejs/timeline
license: ISC
author: 
repository: git+https://github.com/daybrush/scenejs-timeline.git
version: 0.0.4
*/
import { hasClass as hasClass$1, isObject, isString, removeClass as removeClass$1, addClass as addClass$1 } from '@daybrush/utils';
import { drag } from '@daybrush/drag';
import Axes, { PinchInput } from '@egjs/axes';

var PREFIX = "scenejs_timeline_";
var CSS = "\n.timeline {\n  position: relative;\n  font-size: 0;\n  background: #000;\n  display: flex;\n  flex-direction: column;\n}\n.header_area, .scroll_area {\n   width: 100%;\n   position: relative;\n  display: flex;\n  -webkit-align-items: flex-start;\n  align-items: flex-start;\n}\n.header_area {\n  position: relative;\n  z-index: 10;\n  top: 0;\n  height: 30px;\n  min-height: 30px;\n}\n.header_area .keyframes {\n  padding: 0px;\n}\n.header_area .properties_area,\n.header_area .keyframes_area,\n.header_area .values_area,\n.header_area .keyframes_scroll_area {\n    height: 100%;\n}\n.header_area .property, .header_area .value, .header_area .keyframes {\n  height: 100%;\n}\n.header_area .keyframes_area::-webkit-scrollbar {\n    display: none; // Safari and Chrome\n}\n.header_area .keyframe_cursor {\n    position: absolute;\n    border-top: 10px solid #f55;\n    border-left: 5px solid transparent;\n    border-right: 5px solid transparent;\n    width: 0;\n    height: 0;\n    bottom: 0;\n    top: auto;\n    background: none;\n    cursor: pointer;\n}\n.keytime {\n  position: relative;\n  display: inline-block;\n  height: 100%;\n  font-size: 13px;\n  font-weight: bold;\n  color: #777;\n}\n.keytime:last-child {\n  max-width: 0px;\n}\n.keytime span {\n  display: inline-block;\n  transform: translate(-50%);\n  color: #eee;\n}\n.keytime .graduation {\n  position: absolute;\n  bottom: 0;\n  width: 1px;\n  height: 10px;\n  background: #777;\n  transform: translate(-50%);\n}\n.keytime .graduation.half {\n  left: 50%;\n  height: 7px;\n}\n.keytime .graduation.quarter {\n  left: 25%;\n  height: 5px;\n}\n.keytime .graduation.quarter3 {\n  left: 75%;\n  height: 5px;\n}\n.scroll_area {\n  position: relative;\n  width: 100%;\n  height: calc(100% - 30px);\n  overflow: auto;\n}\n.properties_area, .keyframes_area, .values_area {\n  display: inline-block;\n  position: relative;\n  font-size: 16px;\n  overflow: auto;\n}\n\n.properties_area::-webkit-scrollbar, .keyframes_area::-webkit-scrollbar {\n    display: none; // Safari and Chrome\n}\n.properties_area {\n  width: 30%;\n  max-width: 200px;\n  box-sizing: border-box;\n}\n.values_area {\n    width: 50px;\n    min-width: 50px;\n    display: inline-block;\n    border-right: 1px solid #999;\n    box-sizing: border-box;\n}\n.value input {\n    appearance: none;\n    -webkit-appearance: none;\n    outline: none;\n    position: relative;\n    display: block;\n    width: 100%;\n    height: 100%;\n    background: none;\n    color: #ff5;\n    font-weight: bold;\n    background: none;\n    border: 0;\n    box-sizing: border-box;\n    text-align: center;\n}\n.value[data-object=\"1\"] input {\n    display: none;\n}\n.properties_scroll_area {\n  display: inline-block;\n  min-width: 100%;\n}\n.keyframes_area {\n  flex: 1;\n}\n.keyframes_scroll_area {\n  position: relative;\n  min-width: 300px;\n}\n.keyframes, .property, .value {\n  position: relative;\n  height: 25px;\n  border-bottom: 1px solid #777;\n  box-sizing: border-box;\n  white-space: nowrap;\n  background: rgba(73, 73, 73, 0.7);\n  z-index: 1;\n}\n.property:nth-child(2n), .keyframes:nth-child(2n), .value:nth-child(2n) {\n  background: rgba(90, 90, 90, 0.7);\n}\n.property {\n  line-height: 25px;\n  padding-left: 10px;\n  box-sizing: border-box;\n  font-size: 13px;\n  font-weight: bold;\n  color: #eee;\n}\n.property.time_area {\n    color: #ff5;\n    line-height: 30px;\n}\n.property .arrow {\n    position: relative;\n    display: inline-block;\n    margin-right: 5px;\n    width: 0;\n    vertical-align: middle;\n}\n.property .arrow {\n    border-top: 6px solid #eee;\n    border-left: 4px solid transparent;\n    border-right: 4px solid transparent;\n}\n.property[data-fold=\"1\"] .arrow {\n    border-top: 4px solid transparent;\n    border-bottom: 4px solid transparent;\n    border-right: 0;\n    border-left: 6px solid #eee;\n    margin-left: 2px;\n}\n.property[data-object=\"0\"] .arrow {\n    display: none;\n}\n.property.fold, .keyframes.fold, .value.fold {\n    display: none;\n}\n.keyframes {\n\n}\n.keyframe_line {\n  position: absolute;\n  height: 8px;\n  top: 0;\n  bottom: 0;\n  margin: auto;\n  background: #aaa;\n  z-index: 0;\n}\n.keyframe {\n  position: absolute;\n  font-size: 0px;\n  width: 12px;\n  height: 12px;\n  top: 0px;\n  bottom: 0px;\n  margin: auto;\n  background: #fff;\n  border: 2px solid #333;\n  border-radius: 2px;\n  box-sizing: border-box;\n  transform: translate(-50%) rotate(45deg);\n  z-index: 1;\n  cursor: pointer;\n}\n.keyframes_container, .line_area {\n  position: relative;\n  width: calc(100% - 30px);\n  left: 15px;\n  height: 100%;\n}\n.line_area {\n  position: absolute;\n  top: 0;\n  z-index: 0;\n}\n.keyframe_cursor {\n  position: absolute;\n  top: 0;\n  z-index: 1;\n  background: #f55;\n  width: 1px;\n  height: 100%;\n  left: 15px;\n  transform: translate(-50%);\n}\n.division_line {\n  position: absolute;\n  background: #333;\n  width: 1px;\n  height: 100%;\n  transform: translate(-50%);\n}\n".replace(/\.([^{,\s\d.]+)/g, "." + PREFIX + "$1");

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
function flatObject(obj, newObj) {
  if (newObj === void 0) {
    newObj = {};
  }

  for (var name in obj) {
    var value = obj[name];

    if (isObject(value)) {
      var nextObj = flatObject(value.constructor.name === "Frame" ? value.get() : value);

      for (var nextName in nextObj) {
        newObj[name + "///" + nextName] = nextObj[nextName];
      }
    } else {
      newObj[name] = value;
    }
  }

  return newObj;
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
function hasClass(target, className) {
  return hasClass$1(target, "" + PREFIX + className);
}
function addClass(target, className) {
  return addClass$1(target, "" + PREFIX + className);
}
function removeClass(target, className) {
  return removeClass$1(target, "" + PREFIX + className);
}
function makeStructure(structure, parentEl, obj) {
  if (obj === void 0) {
    obj = {};
  }

  var selector = structure.selector,
      id = structure.id,
      attr = structure.attr,
      dataset = structure.dataset,
      children = structure.children,
      style = structure.style,
      html = structure.html;
  var el = createElement(selector);

  if (id) {
    if (id.indexOf("[]") > -1) {
      var objId = id.replace("[]", "");

      if (!obj[objId]) {
        obj[objId] = [];
      }

      obj[objId].push(el);
    } else {
      obj[id] = el;
    }
  }

  if (dataset) {
    for (var name in dataset) {
      el.setAttribute("data-" + name, dataset[name]);
    }
  }

  if (attr) {
    for (var name in attr) {
      el.setAttribute(name, attr[name]);
    }
  }

  if (style) {
    for (var name in style) {
      el.style[name] = style[name];
    }
  }

  if (html) {
    el.innerHTML = html;
  }

  if (children) {
    [].concat(children).filter(function (child) {
      return child;
    }).forEach(function (child) {
      if (isString(child)) {
        makeStructure({
          selector: child
        }, el, obj);
      } else {
        makeStructure(child, el, obj);
      }
    });
  }

  parentEl && parentEl.appendChild(el);
  return obj;
}

var isExportCSS = false;

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
    return this.ids.timeline;
  };

  __proto.initElement = function (scene, parentEl) {
    var duration = scene.getDuration();
    var timelineInfo = getTimelineInfo(scene);
    var maxDuration = Math.ceil(duration);
    var maxTime = maxDuration;
    var keytimes = [];
    var properties = [];
    var values = [];
    var lines = [];
    var keyframesList = [];
    var timelineCSS;

    if (!isExportCSS) {
      timelineCSS = {
        selector: "style.style",
        html: CSS
      };
      isExportCSS = true;
    }

    for (var i = 0; i <= maxTime; ++i) {
      var time = i;
      keytimes.push({
        selector: ".keytime",
        style: {
          width: 100 / maxTime + "%"
        },
        children: [{
          selector: "span",
          html: time + "s"
        }, ".graduation.start", ".graduation.quarter", ".graduation.half", ".graduation.quarter3"]
      });
      lines.push({
        selector: ".division_line",
        style: {
          left: 100 / maxTime * i + "%"
        }
      });
    }

    var _loop_1 = function (property) {
      var propertyNames = property.split("///");
      var length = propertyNames.length;
      var times = timelineInfo[property];
      var id = propertyNames[length - 1];
      properties.push({
        id: "properties[]",
        selector: ".property",
        dataset: {
          id: id,
          property: property,
          parent: propertyNames[length - 2] || "",
          object: "0",
          item: propertyNames[0]
        },
        style: {
          paddingLeft: 10 + (length - 1) * 20 + "px"
        },
        children: [".arrow", {
          selector: "span",
          html: id
        }]
      });
      var isHasObject = times[0] && isObject(times[0][1]);
      values.push({
        id: "values[]",
        selector: ".value",
        dataset: {
          property: property,
          object: isHasObject ? "1" : "0"
        },
        children: {
          id: "inputs[]",
          selector: "input",
          attr: {
            value: times[0] ? times[0][1] : ""
          }
        }
      });
      var parentProperty = propertyNames.slice(0, -1).join("///");
      properties.forEach(function (_a) {
        var dataset = _a.dataset;

        if (dataset.property === parentProperty) {
          dataset.object = "1";
        }
      });
      var keyframeLines = [];
      var keyframes = times.map(function (_a, i) {
        var time = _a[0],
            value = _a[1];
        var valueText = toValue(value);

        if (times[i + 1]) {
          var _b = times[i + 1],
              nextTime = _b[0],
              nextValue = _b[1];
          var nextValueText = toValue(nextValue);

          if (valueText === nextValueText) {
            keyframeLines.push({
              selector: ".keyframe_line",
              style: {
                left: time / maxTime * 100 + "%",
                width: (nextTime - time) / maxTime * 100 + "%"
              }
            });
          }
        }

        return {
          selector: ".keyframe",
          dataset: {
            time: time,
            value: valueText
          },
          style: {
            left: time / maxTime * 100 + "%"
          },
          html: time + " " + valueText
        };
      });
      keyframesList.push({
        id: "keyframesList[]",
        selector: ".keyframes",
        dataset: {
          property: property
        },
        children: {
          selector: ".keyframes_container",
          children: keyframes.concat(keyframeLines)
        }
      });
    };

    for (var property in timelineInfo) {
      _loop_1(property);
    }

    var structure = {
      selector: ".timeline",
      id: "timeline",
      children: [timelineCSS, {
        selector: ".header_area",
        children: [{
          id: "propertiesAreas[]",
          selector: ".properties_area",
          children: [{
            id: "timeArea",
            selector: ".property.time_area",
            html: "0s"
          }]
        }, {
          selector: ".values_area",
          children: ".value"
        }, {
          id: "keyframesAreas[]",
          selector: ".keyframes_area",
          children: {
            style: {
              minWidth: 50 * maxTime + "px",
              width: (maxDuration ? maxTime / maxDuration : 1) * 100 + "%"
            },
            id: "keyframesScrollAreas[]",
            selector: ".keyframes_scroll_area",
            children: {
              selector: ".keyframes",
              children: [{
                selector: ".keyframes_container",
                children: keytimes
              }, {
                selector: ".keyframe_cursor",
                id: "cursors[]"
              }]
            }
          }
        }]
      }, {
        id: "scrollArea",
        selector: ".scroll_area",
        children: [{
          id: "propertiesAreas[]",
          selector: ".properties_area",
          children: [{
            selector: ".properties_scroll_area",
            children: properties
          }]
        }, {
          id: "valuesArea",
          selector: ".values_area",
          children: values
        }, {
          id: "keyframesAreas[]",
          selector: ".keyframes_area",
          children: {
            style: {
              minWidth: 50 * maxTime + "px",
              width: (maxDuration ? maxTime / maxDuration : 1) * 100 + "%"
            },
            id: "keyframesScrollAreas[]",
            selector: ".keyframes_scroll_area",
            children: keyframesList.concat([{
              selector: ".keyframe_cursor",
              id: "cursors[]"
            }, {
              selector: ".line_area",
              children: lines
            }])
          }
        }]
      }]
    };
    this.ids = makeStructure(structure, parentEl);
    this.syncScroll();
    this.wheelZoom();
    this.drag();
    this.fold();
  };

  __proto.syncScroll = function () {
    var keyframesAreas = this.ids.keyframesAreas;
    var isScrollKeyframe = false;
    keyframesAreas[0].addEventListener("scroll", function () {
      if (isScrollKeyframe) {
        isScrollKeyframe = false;
      } else {
        isScrollKeyframe = true;
        keyframesAreas[1].scrollLeft = keyframesAreas[0].scrollLeft;
      }
    });
    keyframesAreas[1].addEventListener("scroll", function () {
      if (isScrollKeyframe) {
        isScrollKeyframe = false;
      } else {
        isScrollKeyframe = true;
        keyframesAreas[0].scrollLeft = keyframesAreas[1].scrollLeft;
      }
    });
  };

  __proto.wheelZoom = function () {
    var keyframesScrollAreas = this.ids.keyframesScrollAreas;
    var originalWidth = parseFloat(keyframesScrollAreas[0].style.width);
    var axes = new Axes({
      zoom: {
        range: [100, Infinity]
      }
    }, {}, {
      zoom: originalWidth
    });
    axes.connect("zoom", new PinchInput(keyframesScrollAreas[1], {
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
      keyframesScrollAreas.forEach(function (el) {
        el.style.width = width + "%";
      });

      if (e.inputEvent) {
        e.inputEvent.preventDefault();
      }
    });
    keyframesScrollAreas[0].addEventListener("wheel", function (e) {
      var delta = e.deltaY;
      axes.setBy({
        zoom: delta / originalWidth * 5
      });
      !e.deltaX && e.preventDefault();
    });
  };

  __proto.fold = function () {
    var _a = this.ids,
        keyframesList = _a.keyframesList,
        properties = _a.properties,
        values = _a.values,
        propertiesAreas = _a.propertiesAreas;
    propertiesAreas[1].addEventListener("click", function (e) {
      var target = getTarget(e.target, function (el) {
        return hasClass(el, "property");
      });

      if (!target || target.getAttribute("data-object") === "0") {
        return;
      }

      var length = properties.length;
      var index = properties.indexOf(target);

      if (index === -1) {
        return;
      }

      var isFold = target.getAttribute("data-fold") === "1";

      function fold(isPrevFold) {
        var nextTarget = properties[index];
        var nextProperty = nextTarget.getAttribute("data-property");
        var isNextFold = nextTarget.getAttribute("data-fold") === "1";
        var isNextObject = nextTarget.getAttribute("data-object") === "1";

        if (target !== nextTarget) {
          if (isFold) {
            if (!isPrevFold) {
              removeClass(keyframesList[index], "fold");
              removeClass(values[index], "fold");
              removeClass(nextTarget, "fold");
            }
          } else {
            addClass(keyframesList[index], "fold");
            addClass(values[index], "fold");
            addClass(nextTarget, "fold");
          }
        }

        if (!isNextObject) {
          return;
        }

        for (++index; index < length; ++index) {
          var el = properties[index];

          if ( // itemProperties
          el.getAttribute("data-property").indexOf(nextProperty) > -1) {
            // isChild
            fold(!isPrevFold && isNextFold);
          } else {
            --index; // not child

            break;
          }
        }
      }

      fold(isFold);
      target.setAttribute("data-fold", isFold ? "0" : "1");
    });
  };

  __proto.setInputs = function (obj) {
    var valuesArea = this.ids.valuesArea;

    for (var name in obj) {
      valuesArea.querySelector("[data-property=\"" + name + "\"] input").value = obj[name];
    }
  };

  __proto.drag = function () {
    var _this = this;

    var _a = this.ids,
        scrollArea = _a.scrollArea,
        timeArea = _a.timeArea,
        cursors = _a.cursors,
        keyframesAreas = _a.keyframesAreas,
        keyframesScrollAreas = _a.keyframesScrollAreas;
    var scene = this.scene;
    scene.on("animate", function (e) {
      var time = e.time;
      var maxDuration = Math.ceil(scene.getDuration());
      var px = 15 - 30 * time / maxDuration;
      var percent = 100 * time / maxDuration;
      var left = "calc(" + percent + "% + " + px + "px)";

      _this.setInputs(flatObject(e.frames));

      timeArea.innerHTML = time + "s";
      cursors.forEach(function (cursor) {
        cursor.style.left = left;
      });
    });

    function move(clientX) {
      var rect = keyframesScrollAreas[1].getBoundingClientRect();
      var scrollAreaWidth = rect.width - 30;
      var scrollAreaX = rect.left + 15;
      var x = Math.min(scrollAreaWidth, Math.max(clientX - scrollAreaX, 0));
      var percentage = x / scrollAreaWidth;
      var time = scene.getDuration() * percentage;
      time = Math.ceil(time * 20) / 20;
      scene.setTime(time);
    }

    function click(e, clientX) {
      var target = getTarget(e.target, function (el) {
        return hasClass(el, "keyframe");
      });

      if (target) {
        scene.setTime(target.getAttribute("data-time"));
      } else if (!hasClass(e.target, "keyframe_cursor")) {
        move(clientX);
      }

      e.preventDefault();
    }

    drag(cursors[0], {
      dragstart: function (_a) {
        var inputEvent = _a.inputEvent;
        inputEvent.stopPropagation();
      },
      drag: function (_a) {
        var clientX = _a.clientX;
        move(clientX);
      },
      container: window
    });
    keyframesScrollAreas.forEach(function (el) {
      drag(el, {
        container: window,
        drag: function (_a) {
          var deltaX = _a.deltaX,
              deltaY = _a.deltaY,
              inputEvent = _a.inputEvent;
          keyframesAreas[1].scrollLeft -= deltaX;
          scrollArea.scrollTop -= deltaY;
          inputEvent.preventDefault();
        },
        dragend: function (_a) {
          var isDrag = _a.isDrag,
              clientX = _a.clientX,
              inputEvent = _a.inputEvent;
          !isDrag && click(inputEvent, clientX);
        }
      });
    });
  };

  return Timeline;
}();

export default Timeline;
//# sourceMappingURL=timeline.esm.js.map
