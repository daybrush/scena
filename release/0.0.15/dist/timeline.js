/*
Copyright (c) 2019 Daybrush
name: @scenejs/timeline
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/scenejs-timeline.git
version: 0.0.15
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@daybrush/utils'), require('@daybrush/drag'), require('@egjs/axes'), require('keycon'), require('data-dom'), require('@egjs/component')) :
    typeof define === 'function' && define.amd ? define(['@daybrush/utils', '@daybrush/drag', '@egjs/axes', 'keycon', 'data-dom', '@egjs/component'], factory) :
    (global = global || self, global.Timeline = factory(global.utils, global.utils, global.eg.Axes, global.KeyController, global.DataDOM, global.Component));
}(this, function (utils, drag, Axes, KeyController, DataDOM, Component) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation. All rights reserved.
    Licensed under the Apache License, Version 2.0 (the "License"); you may not use
    this file except in compliance with the License. You may obtain a copy of the
    License at http://www.apache.org/licenses/LICENSE-2.0

    THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
    KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
    WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
    MERCHANTABLITY OR NON-INFRINGEMENT.

    See the Apache Version 2.0 License for specific language governing permissions
    and limitations under the License.
    ***************************************************************************** */

    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
      extendStatics = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };

      return extendStatics(d, b);
    };

    function __extends(d, b) {
      extendStatics(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
      __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }

        return t;
      };

      return __assign.apply(this, arguments);
    };

    var PREFIX = "scenejs_editor_";
    var SUPPORT_POINTER_EVENTS = "PointerEvent" in window || "MSPointerEvent" in window;
    var SUPPORT_TOUCH = "ontouchstart" in window;
    var CSS2 = "\n.item_info {\n    position: fixed;\n    right: 0;\n    top: 0;\n    width: 200px;\n    background: #000;\n}\n.options_area {\n\n}\n.option_area {\n    position: relative;\n    border-bottom: 1px solid #777;\n    box-sizing: border-box;\n    white-space: nowrap;\n    background: rgba(90, 90, 90, 0.7);\n    font-size: 13px;\n    font-weight: bold;\n    color: #eee;\n    display: flex;\n}\n.option_name, .option_value {\n    width: 50%;\n    height: 30px;\n    line-height: 20px;\n    box-sizing: border-box;\n    padding: 5px;\n}\n.option_name {\n    border-right: 1px solid #999;\n}\n.option_value input {\n    appearance: none;\n    -webkit-appearance: none;\n    outline: none;\n    position: relative;\n    display: block;\n    width: 100%;\n    height: 100%;\n    background: transparent;\n    color: #4af;\n    font-weight: bold;\n    background: none;\n    border: 0;\n    box-sizing: border-box;\n}\n".replace(/\.([^{,\s\d.]+)/g, "." + PREFIX + "$1");
    var CSS = "\n.timeline * {\n    box-sizing: border-box;\n}\n.timeline {\n  position: fixed;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  width: 100%;\n  font-size: 0;\n  background: #000;\n  display: flex;\n  flex-direction: column;\n}\n.header_area, .scroll_area {\n   width: 100%;\n   position: relative;\n  display: flex;\n  -webkit-align-items: flex-start;\n  align-items: flex-start;\n}\n.header_area {\n  position: relative;\n  z-index: 10;\n  top: 0;\n  height: 30px;\n  min-height: 30px;\n}\n.header_area .keyframes {\n  padding: 0px;\n}\n.header_area .properties_area,\n.header_area .keyframes_area,\n.header_area .values_area,\n.header_area .keyframes_scroll_area {\n    height: 100%;\n}\n.header_area .property, .header_area .value, .header_area .keyframes {\n  height: 100%;\n}\n.header_area .property {\n    line-height: 30px;\n}\n.value .add {\n    text-align: center;\n    color: #fff;\n    line-height: 30px;\n    font-weight: bold;\n    font-size: 20px;\n    cursor: pointer;\n}\n.header_area .keyframes_area::-webkit-scrollbar {\n    display: none; // Safari and Chrome\n}\n.header_area .keyframe_cursor {\n    position: absolute;\n    border-top: 10px solid #4af;\n    border-left: 6px solid transparent;\n    border-right: 6px solid transparent;\n    width: 0;\n    height: 0;\n    bottom: 0;\n    top: auto;\n    background: none;\n    cursor: pointer;\n}\n.control_area .keyframes {\n    padding-left: 10px;\n}\n.play_control_area {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n}\n.play_control_area .control {\n    position: relative;\n    display: inline-block;\n    vertical-align: middle;\n    color: white;\n    margin: 0px 15px;\n}\n.play {\n    border-left: 14px solid white;\n    border-top: 8px solid transparent;\n    border-bottom: 8px solid transparent;\n}\n.pause {\n    border-left: 4px solid #fff;\n    border-right: 4px solid #fff;\n    width: 14px;\n    height: 16px;\n}\n.prev {\n    border-right: 10px solid white;\n    border-top: 6px solid transparent;\n    border-bottom: 6px solid transparent;\n}\n.prev:before {\n    position: absolute;\n    content: \"\";\n    width: 3px;\n    height: 10px;\n    top: 0;\n    right: 100%;\n    transform: translate(0, -50%);\n    background: white;\n}\n.next {\n    border-left: 10px solid white;\n    border-top: 6px solid transparent;\n    border-bottom: 6px solid transparent;\n}\n.next:before {\n    position: absolute;\n    content: \"\";\n    width: 3px;\n    height: 10px;\n    top: 0;\n    transform: translate(0, -50%);\n    background: white;\n}\n.keytime {\n  position: relative;\n  display: inline-block;\n  height: 100%;\n  font-size: 13px;\n  font-weight: bold;\n  color: #777;\n}\n.keytime:last-child {\n  max-width: 0px;\n}\n.keytime span {\n  position: absolute;\n  line-height: 1;\n  bottom: 12px;\n  display: inline-block;\n  transform: translate(-50%);\n  color: #eee;\n}\n.keytime .graduation {\n  position: absolute;\n  bottom: 0;\n  width: 1px;\n  height: 10px;\n  background: #777;\n  transform: translate(-50%);\n}\n.keytime .graduation.half {\n  left: 50%;\n  height: 7px;\n}\n.keytime .graduation.quarter {\n  left: 25%;\n  height: 5px;\n}\n.keytime .graduation.quarter3 {\n  left: 75%;\n  height: 5px;\n}\n.scroll_area {\n  position: relative;\n  width: 100%;\n  height: calc(100% - 60px);\n  overflow: auto;\n}\n.properties_area, .keyframes_area, .values_area {\n  display: inline-block;\n  position: relative;\n  font-size: 16px;\n  overflow: auto;\n}\n\n.properties_area::-webkit-scrollbar, .keyframes_area::-webkit-scrollbar {\n    display: none; // Safari and Chrome\n}\n.properties_area {\n  width: 30%;\n  max-width: 200px;\n  box-sizing: border-box;\n}\n.values_area {\n    width: 50px;\n    min-width: 50px;\n    display: inline-block;\n    border-right: 1px solid #999;\n    box-sizing: border-box;\n}\n.value input {\n    appearance: none;\n    -webkit-appearance: none;\n    outline: none;\n    position: relative;\n    display: block;\n    width: 100%;\n    height: 100%;\n    background: transparent;\n    color: #4af;\n    font-weight: bold;\n    background: none;\n    border: 0;\n    box-sizing: border-box;\n    text-align: center;\n}\n.value {\n\n}\n.alt .value input {\n    cursor: ew-resize;\n}\n.value[data-object=\"1\"] input {\n    display: none;\n}\n.properties_scroll_area {\n  display: inline-block;\n  min-width: 100%;\n}\n.keyframes_area {\n  flex: 1;\n}\n.keyframes_scroll_area {\n  position: relative;\n  min-width: 300px;\n}\n.keyframes, .property, .value {\n  position: relative;\n  height: 30px;\n  line-height: 30px;\n  border-bottom: 1px solid #777;\n  box-sizing: border-box;\n  white-space: nowrap;\n  background: rgba(90, 90, 90, 0.7);\n  z-index: 1;\n}\n\n.property {\n  padding-left: 10px;\n  box-sizing: border-box;\n  font-size: 13px;\n  font-weight: bold;\n  color: #eee;\n}\n.property .remove {\n    position: absolute;\n    display: inline-block;\n    cursor: pointer;\n    width: 18px;\n    height: 18px;\n    top: 0;\n    bottom: 0;\n    right: 10px;\n    margin: auto;\n    border-radius: 50%;\n    border: 2px solid #fff;\n    vertical-align: middle;\n    display: none;\n    margin-left: 10px;\n    box-sizing: border-box;\n}\n.property .remove:before, .property .remove:after {\n    position: absolute;\n    content: \"\";\n    width: 8px;\n    height: 2px;\n    border-radius: 1px;\n    background: #fff;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    margin: auto;\n}\n.property .remove:before {\n    transform: rotate(45deg);\n}\n.property .remove:after {\n    transform: rotate(-45deg);\n}\n.property:hover .remove {\n    display: inline-block;\n}\n\n[data-item=\"1\"], [data-item=\"1\"] .add {\n    height: 30px;\n    line-height: 30px;\n}\n.time_area {\n    position: absolute;\n    top: 0;\n    left: 10px;\n    font-size: 13px;\n    color: #4af;\n    line-height: 30px;\n    font-weight: bold;\n    height: 100%;\n    line-height: 30px;\n    border: 0;\n    background: transparent;\n    outline: 0;\n}\n.time_area:after {\n    content: \"s\";\n}\n.property .arrow {\n    position: relative;\n    display: inline-block;\n    width: 20px;\n    height: 25px;\n    cursor: pointer;\n    vertical-align: middle;\n}\n.property .arrow:after {\n    content: \"\";\n    position: absolute;\n    top: 0;\n    right: 0;\n    left: 0;\n    bottom: 0;\n    margin: auto;\n    width: 0;\n    height: 0;\n    border-top: 6px solid #eee;\n    border-left: 4px solid transparent;\n    border-right: 4px solid transparent;\n}\n.property[data-fold=\"1\"] .arrow:after {\n    border-top: 4px solid transparent;\n    border-bottom: 4px solid transparent;\n    border-right: 0;\n    border-left: 6px solid #eee;\n}\n.property[data-object=\"0\"] .arrow {\n    display: none;\n}\n.property.fold, .keyframes.fold, .value.fold {\n    display: none;\n}\n.property.select, .value.select, .keyframes.select {\n    background: rgba(120, 120, 120, 0.7);\n}\n.keyframes {\n\n}\n.keyframe_delay {\n  position: absolute;\n  top: 3px;\n  bottom: 3px;\n  left: 0;\n  background: #4af;\n  opacity: 0.2;\n  z-index: 0;\n}\n.keyframe_group {\n    position: absolute;\n    top: 3px;\n    bottom: 3px;\n    left: 0;\n    background: #4af;\n    opacity: 0.6;\n    border: 1px solid rgba(0, 0, 0, 0.2);\n    border-left-color: rgba(255, 255, 255, 0.2);\n    border-top-color: rgba(255, 255, 255, 0.2);\n    z-index: 0;\n}\n.keyframe_line {\n  position: absolute;\n  height: 8px;\n  top: 0;\n  bottom: 0;\n  margin: auto;\n  background: #666;\n  z-index: 0;\n}\n.keyframe {\n  position: absolute;\n  font-size: 0px;\n  width: 12px;\n  height: 12px;\n  top: 0px;\n  bottom: 0px;\n  margin: auto;\n  background: #fff;\n  border: 2px solid #383838;\n  border-radius: 2px;\n  box-sizing: border-box;\n  transform: translate(-50%) rotate(45deg);\n  z-index: 1;\n  cursor: pointer;\n}\n.keyframe[data-no=\"1\"] {\n    opacity: 0.2;\n}\n.select .keyframe {\n    border-color: #555;\n}\n.keyframe.select {\n    background: #4af;\n}\n.keyframes_container, .line_area {\n  position: relative;\n  width: calc(100% - 30px);\n  left: 15px;\n  height: 100%;\n}\n.line_area {\n  position: absolute;\n  top: 0;\n  z-index: 0;\n}\n.keyframe_cursor {\n  position: absolute;\n  top: 0;\n  z-index: 1;\n  background: #4af;\n  width: 1px;\n  height: 100%;\n  left: 15px;\n  transform: translate(-50%);\n}\n.scroll_aare .keyframe_cursor {\n  pointer-events: none;\n}\n.division_line {\n  position: absolute;\n  background: #333;\n  width: 1px;\n  height: 100%;\n  transform: translate(-50%);\n}\n".replace(/\.([^{,\s\d.]+)/g, "." + PREFIX + "$1");
    var DIRECTION = "direction";
    var ITERATION_COUNT = "iterationCount";
    var DELAY = "delay";
    var PLAY_SPEED = "playSpeed";
    var ALTERNATE = "alternate";
    var REVERSE = "reverse";
    var ALTERNATE_REVERSE = "alternate-reverse";

    function numberFormat(num, count, isRight) {
      var length = ("" + num).length;
      var arr = [];

      if (isRight) {
        arr.push(num);
      }

      for (var i = length; i < count; ++i) {
        arr.push(0);
      }

      if (!isRight) {
        arr.push(num);
      }

      return arr.join("");
    }
    function applyStyle(el, style) {
      for (var name in style) {
        el.style[name] = style[name];
      }
    }
    function findIndexByProperty(selectedProperty, structures) {
      return structures.findIndex(function (_a) {
        var key = _a.dataset.key;
        return key === selectedProperty;
      });
    }
    function findStructureByProperty(selectedProperty, structures) {
      return structures.find(function (_a) {
        var key = _a.dataset.key;
        return key === selectedProperty;
      });
    }
    function createElement(structure) {
      var selector = structure.selector,
          dataset = structure.dataset,
          attr = structure.attr,
          style = structure.style,
          html = structure.html;
      var classNames = selector.match(/\.([^.#\s])+/g) || [];
      var tag = (selector.match(/^[^.#\s]+/g) || [])[0] || "div";
      var id = (selector.match(/#[^.#\s]+/g) || [])[0] || "";
      var el = document.createElement(tag);
      id && (el.id = id.replace(/^#/g, ""));
      el.className = classNames.map(function (name) {
        return "" + PREFIX + name.replace(/^\./g, "");
      }).join(" ");

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
        applyStyle(el, style);
      }

      if (html) {
        el.innerHTML = html;
      }

      return el;
    }
    function updateElement(prevStructure, nextStructure) {
      var dataset = nextStructure.dataset,
          attr = nextStructure.attr,
          style = nextStructure.style,
          html = nextStructure.html,
          element = nextStructure.element;

      if (dataset) {
        for (var name in dataset) {
          element.setAttribute("data-" + name, dataset[name]);
        }
      }

      if (attr) {
        for (var name in attr) {
          element.setAttribute(name, attr[name]);
        }
      }

      style && applyStyle(element, style);

      if (prevStructure.html !== nextStructure.html) {
        element.innerHTML = html;
      }
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

        if (utils.isObject(value)) {
          var nextObj = flatObject(isFrame(value) ? value.get() : value);

          for (var nextName in nextObj) {
            newObj[name + "///" + nextName] = nextObj[nextName];
          }
        } else {
          newObj[name] = value;
        }
      }

      return newObj;
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
      return utils.hasClass(target, "" + PREFIX + className);
    }
    function addClass(target, className) {
      return utils.addClass(target, "" + PREFIX + className);
    }
    function removeClass(target, className) {
      return utils.removeClass(target, "" + PREFIX + className);
    }
    function isScene(value) {
      return !!value.constructor.prototype.getItem;
    }
    function isFrame(value) {
      return !!value.constructor.prototype.toCSS;
    }
    function findElementIndexByPosition(elements, pos) {
      var length = elements.length;

      for (var index = 0; index < length; ++index) {
        var el = elements[index];
        var box = el.getBoundingClientRect();
        var top = box.top;
        var bottom = top + box.height;

        if (top <= pos && pos < bottom) {
          return index;
        }
      }

      return -1;
    }

    var prevTime = 0;
    var prevX = -1;
    var prevY = -1;
    function dblCheck(isDrag, e, clientX, clientY, callback) {
      var currentTime = utils.now();

      if (!isDrag) {
        if (prevX === clientX && prevY === clientY && currentTime - prevTime <= 500) {
          callback(e, clientX, clientY);
        }

        prevX = clientX;
        prevY = clientY;
        prevTime = currentTime;
      }
    }

    function getKeytimesStructure(maxTime) {
      var keytimes = [];

      for (var time = 0; time <= maxTime; ++time) {
        keytimes.push({
          key: time,
          dataset: {
            time: time
          },
          selector: ".keytime",
          style: {
            width: 100 / maxTime + "%"
          },
          children: [{
            selector: "span",
            html: "" + time
          }, {
            selector: ".graduation.start"
          }, {
            selector: ".graduation.quarter"
          }, {
            selector: ".graduation.half"
          }, {
            selector: ".graduation.quarter3"
          }]
        });
      }

      return keytimes;
    }
    function getLinesStructure(maxTime) {
      var lines = [];

      for (var time = 0; time <= maxTime; ++time) {
        lines.push({
          key: time,
          selector: ".division_line",
          style: {
            left: 100 / maxTime * time + "%"
          }
        });
      }

      return lines;
    }

    function getHeaderAreaStructure(ids, zoom, maxDuration, maxTime) {
      return {
        selector: ".header_area",
        ref: function (e) {
          ids.keyframesScrollAreas = [];
          ids.keyframesAreas = [];
          ids.propertiesAreas = [];
        },
        children: [{
          ref: function (e) {
            ids.propertiesAreas[0] = e;
          },
          selector: ".properties_area",
          children: [{
            selector: ".property",
            html: "Name"
          }]
        }, {
          selector: ".values_area",
          children: {
            selector: ".value",
            children: {
              key: "add",
              selector: ".add",
              html: "+",
              ref: function (e) {
                ids.addItem = e;
              }
            }
          }
        }, getKeytimesAreaStructure(ids, zoom, maxDuration, maxTime)]
      };
    }
    function getKeytimesAreaStructure(ids, zoom, maxDuration, maxTime) {
      return {
        ref: function (e) {
          ids.keyframesAreas[0] = e;
        },
        selector: ".keyframes_area",
        children: {
          style: {
            minWidth: 50 * maxTime + "px",
            width: Math.min(maxDuration ? maxTime / maxDuration : 1, 2) * zoom * 100 + "%"
          },
          dataset: {
            width: Math.min(maxDuration ? maxTime / maxDuration : 1, 2)
          },
          ref: function (e) {
            ids.keyframesScrollAreas[0] = e;
          },
          selector: ".keyframes_scroll_area",
          children: {
            ref: function (e) {
              ids.cursors = [];
            },
            selector: ".keyframes",
            children: [{
              ref: function (e) {
                ids.keytimesContainer = e;
              },
              selector: ".keyframes_container",
              children: getKeytimesStructure(maxTime)
            }, {
              selector: ".keyframe_cursor",
              ref: function (e) {
                ids.cursors[0] = e;
              }
            }]
          }
        }
      };
    }

    function getKeyframesAreaStructure(ids, keyframesList, zoom, maxDuration, maxTime) {
      var width = Math.min(maxDuration ? maxTime / maxDuration : 1, 2);
      return {
        ref: function (e) {
          ids.keyframesAreas[1] = e;
        },
        selector: ".keyframes_area",
        children: {
          style: {
            minWidth: 50 * maxTime + "px",
            width: width * zoom * 100 + "%"
          },
          dataset: {
            width: width
          },
          ref: function (e) {
            ids.keyframesScrollAreas[1] = e;
          },
          selector: ".keyframes_scroll_area",
          children: getKeyframesScrollAreaChildrenStructure(ids, keyframesList, maxTime)
        }
      };
    }
    function getKeyframesScrollAreaChildrenStructure(ids, keyframesList, maxTime) {
      return keyframesList.concat([{
        key: "cursor",
        selector: ".keyframe_cursor",
        ref: function (e) {
          ids.cursors[1] = e;
        }
      }, {
        key: "lineArea",
        ref: function (e) {
          ids.lineArea = e;
        },
        selector: ".line_area",
        children: getLinesStructure(maxTime)
      }]);
    }
    function getKeyframesListStructure(ids, timelineInfo, maxTime) {
      var keyframesList = [];

      for (var key in timelineInfo) {
        var propertiesInfo = timelineInfo[key];
        var keyframes = getKeyframesStructure(propertiesInfo, maxTime);
        keyframesList.push({
          ref: function (e, i) {
            ids.keyframesList[i] = e;
            ids.keyframesContainers[i] = e.children;
          },
          selector: ".keyframes",
          key: key,
          dataset: {
            item: propertiesInfo.isItem ? "1" : "0",
            key: key
          },
          datas: propertiesInfo,
          children: {
            selector: ".keyframes_container",
            children: keyframes
          }
        });
      }

      return keyframesList;
    }
    function getDelayFrameStructure(time, nextTime, maxTime) {
      return {
        selector: ".keyframe_delay",
        key: "delay" + time + "," + nextTime,
        datas: {
          time: -1
        },
        style: {
          left: time / maxTime * 100 + "%",
          width: (nextTime - time) / maxTime * 100 + "%"
        }
      };
    }
    function getKeyframesStructure(propertiesInfo, maxTime) {
      var item = propertiesInfo.item,
          frames = propertiesInfo.frames,
          properties = propertiesInfo.properties;
      var isItScene = isScene(item);
      var duration = item.getDuration();
      var keyframes = [];
      var keyframeGroups = [];
      var delayFrames = [];
      var keyframeLines = [];
      var length = frames.length;

      if (length >= 2) {
        var startFrame = length !== 2 && frames[0][0] === 0 && frames[0][1] === 0 && utils.isUndefined(frames[0][2]) && !properties.length ? frames[1] : frames[0];
        var endFrame = frames[length - 1];
        var time = startFrame[0];
        var nextTime = endFrame[0];
        keyframeGroups.push({
          selector: ".keyframe_group",
          key: "group",
          datas: {
            time: time + "," + nextTime,
            from: time,
            to: nextTime
          },
          dataset: {
            time: time
          },
          style: {
            left: time / maxTime * 100 + "%",
            width: (nextTime - time) / maxTime * 100 + "%"
          }
        });
      }

      frames.forEach(function (_a, i) {
        var time = _a[0],
            iterationTime = _a[1],
            value = _a[2];
        var valueText = toValue(value);

        if (i === 0 && time === 0 && iterationTime === 0 && utils.isUndefined(value) && !properties.length) {
          return;
        }

        if (frames[i + 1]) {
          var _b = frames[i + 1],
              nextTime = _b[0],
              nextIterationTime = _b[1],
              nextValue = _b[2];
          var nextValueText = toValue(nextValue);

          if (iterationTime === 0 && nextIterationTime === 0 || iterationTime === duration && nextIterationTime === duration) {
            delayFrames.push(getDelayFrameStructure(time, nextTime, maxTime));
          }

          if (!isItScene && !utils.isUndefined(value) && !utils.isUndefined(nextValue) && valueText !== nextValueText) {
            keyframeLines.push({
              selector: ".keyframe_line",
              key: "line" + keyframeLines.length,
              datas: {
                time: time + "," + nextTime,
                from: time,
                to: nextTime
              },
              style: {
                left: time / maxTime * 100 + "%",
                width: (nextTime - time) / maxTime * 100 + "%"
              }
            });
          }
        }

        if (isItScene) {
          return;
        }

        keyframes.push({
          key: "keyframe" + keyframes.length,
          selector: ".keyframe",
          dataset: {
            time: time
          },
          datas: {
            time: time,
            iterationTime: iterationTime,
            value: valueText
          },
          style: {
            left: time / maxTime * 100 + "%"
          },
          html: time + " " + valueText
        });
      });
      return keyframeGroups.concat(keyframes, delayFrames, keyframeLines);
    }

    function getPropertiesStructure(ids, timelineInfo) {
      var properties = [];

      for (var key in timelineInfo) {
        var propertiesInfo = timelineInfo[key];
        var propertyNames = propertiesInfo.keys;
        var length = propertyNames.length;
        var id = propertyNames[length - 1];
        properties.push({
          ref: function (e, i) {
            ids.properties[i] = e;
          },
          key: key,
          selector: ".property",
          dataset: {
            key: key,
            object: propertiesInfo.isParent ? "1" : "0",
            item: propertiesInfo.isItem ? "1" : "0"
          },
          datas: propertiesInfo,
          style: {
            paddingLeft: 10 + (length - 1) * 20 + "px"
          },
          children: [{
            selector: ".arrow"
          }, {
            selector: "span",
            html: id
          }, {
            selector: ".remove"
          }]
        });
      }

      return properties;
    }

    function getValuesStructure(ids, timelineInfo) {
      var values = [];

      for (var key in timelineInfo) {
        var propertiesInfo = timelineInfo[key];
        var frames = propertiesInfo.frames;
        values.push({
          ref: function (e, i) {
            ids.values[i] = e;
          },
          key: key,
          selector: ".value",
          dataset: {
            key: key,
            item: propertiesInfo.isItem ? "1" : "0",
            object: propertiesInfo.isParent ? "1" : "0"
          },
          datas: propertiesInfo,
          children: propertiesInfo.isParent ? {
            key: "add",
            selector: ".add",
            html: "+"
          } : {
            key: "input",
            selector: "input",
            attr: {
              value: frames[0] ? frames[0][1] : ""
            }
          }
        });
      }

      return values;
    }

    function getScrollAreaStructure(ids, timelineInfo, zoom, maxDuration, maxTime) {
      var keyframesList = getKeyframesListStructure(ids, timelineInfo, maxTime);
      return {
        ref: function (e) {
          ids.scrollArea = e;
          ids.keyframesList = [];
          ids.keyframesContainers = [];
        },
        selector: ".scroll_area",
        children: [{
          ref: function (e) {
            ids.propertiesAreas[1] = e;
            ids.properties = [];
          },
          selector: ".properties_area",
          children: [{
            selector: ".properties_scroll_area",
            children: getPropertiesStructure(ids, timelineInfo)
          }]
        }, {
          ref: function (e) {
            ids.valuesArea = e;
            ids.values = [];
          },
          selector: ".values_area",
          children: getValuesStructure(ids, timelineInfo)
        }, getKeyframesAreaStructure(ids, keyframesList, zoom, maxDuration, maxTime)]
      };
    }

    function getControlAreaStructure(ids) {
      return {
        selector: ".header_area.control_area",
        children: [{
          selector: ".properties_area",
          ref: function (e) {
            ids.unselectedArea = e;
          },
          children: {
            selector: ".property"
          }
        }, {
          selector: ".values_area",
          children: {
            selector: ".value"
          }
        }, {
          selector: ".keyframes_area",
          children: {
            selector: ".keyframes",
            children: [{
              selector: "input.time_area",
              ref: function (e) {
                ids.timeArea = e;
              },
              html: "???"
            }, {
              selector: ".play_control_area",
              children: [{
                ref: function (e) {
                  ids.prevBtn = e;
                },
                selector: ".control.prev"
              }, {
                ref: function (e) {
                  ids.playBtn = e;
                },
                selector: ".control.play"
              }, {
                ref: function (e) {
                  ids.nextBtn = e;
                },
                selector: ".control.next"
              }]
            }]
          }
        }]
      };
    }

    var MAXIMUM = 1000000;
    function toFixed(num) {
      return Math.round(num * MAXIMUM) / MAXIMUM;
    }
    function addEntry(entries, time, keytime) {
      var prevEntry = entries[entries.length - 1];
      (!prevEntry || prevEntry[0] !== time || prevEntry[1] !== keytime) && entries.push([toFixed(time), toFixed(keytime)]);
    }
    function dotNumber(a1, a2, b1, b2) {
      return (a1 * b2 + a2 * b1) / (b1 + b2);
    }
    function getEntries(times, states) {
      if (!times.length) {
        return [];
      }

      var entries = times.map(function (time) {
        return [time, time];
      });
      var nextEntries = [];
      var firstEntry = entries[0];

      if (firstEntry[0] !== 0 && states[states.length - 1][DELAY]) {
        entries.unshift([0, 0]);
      }

      states.forEach(function (state) {
        var iterationCount = state[ITERATION_COUNT];
        var delay = state[DELAY];
        var playSpeed = state[PLAY_SPEED];
        var direction = state[DIRECTION];
        var intCount = Math.ceil(iterationCount);
        var currentDuration = entries[entries.length - 1][0];
        var length = entries.length;
        var lastTime = currentDuration * iterationCount;

        for (var i = 0; i < intCount; ++i) {
          var isReverse = direction === REVERSE || direction === ALTERNATE && i % 2 || direction === ALTERNATE_REVERSE && !(i % 2);

          for (var j = 0; j < length; ++j) {
            var entry = entries[isReverse ? length - j - 1 : j];
            var time = entry[1];
            var currentTime = currentDuration * i + (isReverse ? currentDuration - entry[0] : entry[0]);
            var prevEntry = entries[isReverse ? length - j : j - 1];

            if (currentTime > lastTime) {
              if (j !== 0) {
                var prevTime = currentDuration * i + (isReverse ? currentDuration - prevEntry[0] : prevEntry[0]);
                var divideTime = dotNumber(prevEntry[1], time, lastTime - prevTime, currentTime - lastTime);
                addEntry(nextEntries, (delay + currentDuration * iterationCount) / playSpeed, divideTime);
              }

              break;
            } else if (currentTime === lastTime && nextEntries.length && nextEntries[nextEntries.length - 1][0] === lastTime + delay) {
              break;
            }

            addEntry(nextEntries, (delay + currentTime) / playSpeed, time);
          }
        } // delay time


        delay && nextEntries.unshift([0, nextEntries[0][1]]);
        entries = nextEntries;
        nextEntries = [];
      });
      return entries;
    }
    function getItemInfo(timelineInfo, items, names, item) {
      item.update();
      var times = item.times.slice();
      var originalDuration = item.getDuration();
      !item.getFrame(0) && times.unshift(0);
      !item.getFrame(originalDuration) && times.push(originalDuration);
      var states = items.slice(1).map(function (animator) {
        return animator.state;
      }).reverse();
      var entries = getEntries(times, states);
      var parentItem = items[items.length - 2];

      (function getPropertyInfo(itemNames) {
        var properties = [];

        for (var _i = 1; _i < arguments.length; _i++) {
          properties[_i - 1] = arguments[_i];
        }

        var frames = [];
        var isParent = utils.isObject(itemNames);
        var isItem = properties.length === 0;
        entries.forEach(function (_a) {
          var time = _a[0],
              iterationTime = _a[1];
          var value = item.get.apply(item, [iterationTime].concat(properties));

          if (utils.isUndefined(value) && properties.length) {
            return;
          }

          frames.push([time, iterationTime, value]);
        });
        var keys = names.concat(properties);
        var key = keys.join("///");

        if (key) {
          timelineInfo[key] = {
            key: key,
            keys: keys,
            parentItem: parentItem,
            isParent: isParent,
            isItem: isItem,
            item: item,
            names: names,
            properties: properties,
            frames: frames
          };
        }

        if (isParent) {
          for (var property in itemNames) {
            getPropertyInfo.apply(void 0, [itemNames[property]].concat(properties, [property]));
          }
        }
      })(item.names);
    }
    function getTimelineInfo(scene) {
      var timelineInfo = {};

      (function sceneForEach() {
        var items = [];

        for (var _i = 0; _i < arguments.length; _i++) {
          items[_i] = arguments[_i];
        }

        var length = items.length;
        var lastItem = items[length - 1];
        var names = items.slice(1).map(function (item) {
          return item.getId();
        });

        if (isScene(lastItem)) {
          if (names.length) {
            var key = names.join("///");
            var times = [0, lastItem.getDuration()];
            var entries = getEntries(times, items.slice(1).map(function (animator) {
              return animator.state;
            }).reverse());
            var frames_1 = [];
            entries.forEach(function (_a) {
              var time = _a[0],
                  iterationTime = _a[1];
              frames_1.push([time, iterationTime, iterationTime]);
            });
            timelineInfo[key] = {
              key: key,
              keys: names,
              isItem: true,
              isParent: true,
              parentItem: items[length - 2],
              item: lastItem,
              names: [],
              properties: [],
              frames: frames_1
            };
          }

          lastItem.forEach(function (item) {
            sceneForEach.apply(void 0, items.concat([item]));
          });
        } else {
          getItemInfo(timelineInfo, items, names, lastItem);
        }
      })(scene);

      return timelineInfo;
    }

    var isExportCSS = false;

    var Timeline =
    /*#__PURE__*/
    function (_super) {
      __extends(Timeline, _super);

      function Timeline(scene, parentEl, options) {
        if (options === void 0) {
          options = {};
        }

        var _this = _super.call(this) || this;

        _this.maxTime = 0;
        _this.selectedProperty = "";
        _this.selectedTime = -1;
        _this.ids = {};
        _this.options = __assign({
          keyboard: true
        }, options);
        scene.finish();
        _this.scene = scene;

        _this.initStructure(scene, parentEl);

        _this.initEditor();

        _this.initScroll();

        _this.initWheelZoom();

        _this.initDragKeyframes();

        _this.initClickProperty();

        _this.initController();

        _this.initDragValues();

        _this.initKeyController();

        _this.setTime(0);

        return _this; // new Info(this, parentEl);
      }

      var __proto = Timeline.prototype;

      __proto.getElement = function () {
        return this.structure.element;
      }; // scene control


      __proto.prev = function () {
        this.setTime(this.scene.getTime() - 0.05);
      };

      __proto.next = function () {
        this.setTime(this.scene.getTime() + 0.05);
      };

      __proto.finish = function () {
        this.scene.finish();
      };

      __proto.togglePlay = function () {
        var scene = this.scene;

        if (scene.getPlayState() === "running") {
          scene.pause();
        } else {
          scene.play();
        }
      };

      __proto.setTime = function (time) {
        var scene = this.scene;
        var direction = scene.getDirection();
        scene.pause();

        if (direction === "normal" || direction === "alternate") {
          scene.setTime(time);
        } else {
          scene.setTime(scene.getDuration() - time);
        }
      };

      __proto.update = function () {
        var scene = this.scene;
        this.timelineInfo = getTimelineInfo(scene);
        var maxDuration = Math.ceil(scene.getDuration());
        var maxTime = Math.max(this.maxTime, maxDuration);
        var zoom = this.axes.get(["zoom"]).zoom;
        var currentMaxTime = this.maxTime;
        this.maxTime = maxTime;
        var ids = this.ids;
        var prevKeytimesArea = ids.keyframesAreas[0];
        var nextZoom = currentMaxTime > 1 ? maxTime / currentMaxTime : 1;
        zoom = Math.max(1, zoom * nextZoom);
        this.axes.axm.set({
          zoom: zoom
        }); // update keytimes

        this.datadom.update(prevKeytimesArea, getKeytimesAreaStructure(ids, zoom, maxTime, maxTime));
        var nextScrollAreaStructure = getScrollAreaStructure(ids, this.timelineInfo, this.axes.get(["zoom"]).zoom, maxTime, maxTime);
        this.datadom.update(ids.scrollArea, nextScrollAreaStructure);
        this.setTime(scene.getTime());
      };

      __proto.newItem = function (scene) {
        var name = prompt("Add Item");

        if (!name) {
          return;
        }

        this.scene.newItem(name);
        this.update();
      };

      __proto.newProperty = function (item, properties) {
        var property = prompt("new property");

        if (!property) {
          return;
        }

        item.set.apply(item, [item.getIterationTime()].concat(properties, [property, 0]));
        this.update();
      }; // init


      __proto.initController = function () {
        var _this = this;

        var ids = this.ids;
        var playBtn = this.ids.playBtn.element;
        var scene = this.scene;
        this.ids.addItem.element.addEventListener("click", function (e) {
          if (isScene(_this.scene)) {
            _this.newItem(_this.scene);
          } else {
            _this.newProperty(_this.scene, []);
          }
        });
        playBtn.addEventListener("click", function (e) {
          _this.togglePlay();

          e.preventDefault();
        });
        ids.unselectedArea.element.addEventListener("click", function (e) {
          _this.select("", -1);
        });
        ids.prevBtn.element.addEventListener("click", function (e) {
          _this.prev();

          e.preventDefault();
        });
        ids.nextBtn.element.addEventListener("click", function (e) {
          _this.next();

          e.preventDefault();
        });
        scene.on("play", function () {
          addClass(playBtn, "pause");
          removeClass(playBtn, "play"); // playBtn.innerHTML = "pause";
        });
        scene.on("paused", function () {
          addClass(playBtn, "play");
          removeClass(playBtn, "pause"); // playBtn.innerHTML = "play";
        });

        if (this.options.keyboard) {
          new KeyController(ids.timeArea.element).keydown(function (e) {
            !e.isToggle && e.inputEvent.stopPropagation();
          }).keyup(function (e) {
            !e.isToggle && e.inputEvent.stopPropagation();
          }).keyup("enter", function (e) {
            // go to time
            var element = ids.timeArea.element;
            var value = element.value;
            var result = /(\d+):(\d+):(\d+)/g.exec(value);

            if (!result) {
              return;
            }

            var minute = parseFloat(result[1]);
            var second = parseFloat(result[2]);
            var milisecond = parseFloat("0." + result[3]);
            var time = minute * 60 + second + milisecond;

            _this.setTime(time);
          });
        }
      };

      __proto.initKeyController = function () {
        var _this = this;

        var ids = this.ids;
        window.addEventListener("blur", function () {
          removeClass(ids.timeline.element, "alt");
        });
        this.keycon = new KeyController().keydown("alt", function () {
          addClass(ids.timeline.element, "alt");
        }).keyup("alt", function () {
          removeClass(ids.timeline.element, "alt");
        });

        if (this.options.keyboard) {
          this.keycon.keydown("space", function (_a) {
            var inputEvent = _a.inputEvent;
            inputEvent.preventDefault();
          }).keydown("left", function (e) {
            _this.prev();
          }).keydown("right", function (e) {
            _this.next();
          }).keyup("backspace", function () {
            _this.removeKeyframe(_this.selectedProperty);
          }).keyup("esc", function () {
            _this.finish();
          }).keyup("space", function () {
            _this.togglePlay();
          });
        }
      };

      __proto.initStructure = function (scene, parentEl) {
        var _this = this;

        this.timelineInfo = getTimelineInfo(scene);
        var duration = Math.ceil(scene.getDuration());
        var maxDuration = Math.ceil(duration);
        var maxTime = maxDuration;
        var ids = this.ids;
        var timelineCSS;
        this.maxTime = maxTime;

        if (!isExportCSS) {
          timelineCSS = {
            selector: "style.style",
            html: CSS
          };
          isExportCSS = true;
        }

        var structure = {
          selector: ".timeline",
          ref: function (e) {
            ids.timeline = e;
          },
          children: [timelineCSS, getControlAreaStructure(ids), getHeaderAreaStructure(ids, 1, maxDuration, maxTime), getScrollAreaStructure(ids, this.timelineInfo, 1, maxDuration, maxTime)]
        };
        this.datadom = new DataDOM(createElement, updateElement);
        this.structure = this.datadom.render(structure, parentEl); // fold all

        this.ids.properties.forEach(function (property, i) {
          var propertiesInfo = property.datas;
          var keys = propertiesInfo.keys,
              isParent = propertiesInfo.isParent;

          if (keys.length === 1 && isParent) {
            _this.fold(i);
          }
        });
      };

      __proto.initScroll = function () {
        var keyframesAreas = this.ids.keyframesAreas;
        var isScrollKeyframe = false;
        var headerKeyframesArea = keyframesAreas[0].element;
        var scrollKeyframesArea = keyframesAreas[1].element;
        headerKeyframesArea.addEventListener("scroll", function () {
          if (isScrollKeyframe) {
            isScrollKeyframe = false;
          } else {
            isScrollKeyframe = true;
            scrollKeyframesArea.scrollLeft = headerKeyframesArea.scrollLeft;
          }
        });
        scrollKeyframesArea.addEventListener("scroll", function () {
          if (isScrollKeyframe) {
            isScrollKeyframe = false;
          } else {
            isScrollKeyframe = true;
            headerKeyframesArea.scrollLeft = scrollKeyframesArea.scrollLeft;
          }
        });
      };

      __proto.initWheelZoom = function () {
        var _this = this;

        var ids = this.ids;
        var keyframesScrollAreas = ids.keyframesScrollAreas;
        var headerArea = keyframesScrollAreas[0].element;
        var scrollArea = keyframesScrollAreas[1].element;
        var axes = new Axes({
          zoom: {
            range: [1, Infinity]
          }
        }, {}, {
          zoom: 1
        });

        if (SUPPORT_TOUCH || SUPPORT_POINTER_EVENTS) {
          axes.connect("zoom", new Axes.PinchInput(scrollArea, {
            scale: 0.1,
            hammerManagerOptions: {
              touchAction: "auto"
            }
          }));
        }

        axes.on("hold", function (e) {
          if (e.inputEvent) {
            e.inputEvent.preventDefault();
          }
        });
        axes.on("change", function (e) {
          var scale = ids.keyframesScrollAreas[0].dataset.width;
          var width = e.pos.zoom * scale * 100;
          ids.keyframesScrollAreas.forEach(function (_a) {
            var element = _a.element;
            element.style.width = width + "%";
          });

          if (e.inputEvent) {
            e.inputEvent.preventDefault();
          }
        });
        this.axes = axes;
        headerArea.addEventListener("wheel", function (e) {
          var delta = e.deltaY;
          axes.setBy({
            zoom: delta / 5000
          });
          !e.deltaX && e.preventDefault();
        });
        utils.addEvent(scrollArea, "wheel", function (e) {
          if (!_this.keycon.altKey) {
            return;
          }

          e.preventDefault();
          var delta = e.deltaY;
          axes.setBy({
            zoom: delta / 5000
          });
        });
      };

      __proto.select = function (selectedProperty, keyframeTime) {
        var prevSelectedProperty = this.selectedProperty;
        var prevSelectedTime = this.selectedTime;
        var ids = this.ids;
        var values = ids.values;
        var properties = ids.properties;
        var keyframesList = ids.keyframesList;
        this.selectedProperty = selectedProperty;
        this.scene.pause();

        if (prevSelectedProperty) {
          var prevSelectedIndex = findIndexByProperty(prevSelectedProperty, properties);
          removeClass(properties[prevSelectedIndex].element, "select");
          removeClass(values[prevSelectedIndex].element, "select");
          removeClass(keyframesList[prevSelectedIndex].element, "select");

          if (prevSelectedTime >= 0) {
            var keyframes = ids.keyframesContainers[prevSelectedIndex].children;
            keyframes.forEach(function (keyframe) {
              if (keyframe.datas.time === prevSelectedTime) {
                removeClass(keyframe.element, "select");
              }
            });
            this.selectedTime = -1;
          }
        }

        var selectedItem = this.scene;

        if (selectedProperty) {
          if (document.activeElement) {
            document.activeElement.blur();
          }

          var selectedIndex = findIndexByProperty(selectedProperty, properties);
          addClass(properties[selectedIndex].element, "select");
          addClass(values[selectedIndex].element, "select");
          addClass(keyframesList[selectedIndex].element, "select");
          selectedItem = ids.keyframesList[selectedIndex].datas.item;

          if (keyframeTime >= 0) {
            var selectedPropertyStructure = ids.keyframesContainers[selectedIndex];
            var keyframes = selectedPropertyStructure.children;
            keyframes.forEach(function (keyframe) {
              if (keyframe.datas.time === keyframeTime) {
                addClass(keyframe.element, "select");
              }
            });
            this.selectedTime = keyframeTime;
          }
        }

        this.trigger("select", {
          selectedItem: selectedItem,
          selectedProperty: this.selectedProperty,
          selectedTime: this.selectedTime,
          prevSelectedProperty: prevSelectedProperty,
          prevSelectedTime: prevSelectedTime
        });
      };

      __proto.initClickProperty = function () {
        var _this = this;

        var ids = this.ids;
        var propertiesAreas = ids.propertiesAreas;
        propertiesAreas[1].element.addEventListener("click", function (e) {
          var properties = ids.properties.map(function (property) {
            return property.element;
          });
          var length = properties.length;
          var arrow = getTarget(e.target, function (el) {
            return hasClass(el, "arrow");
          });
          var remove = getTarget(e.target, function (el) {
            return hasClass(el, "remove");
          });
          var target = getTarget(e.target, function (el) {
            return hasClass(el, "property");
          });

          if (!target) {
            return;
          }

          var index = properties.indexOf(target);

          if (index === -1) {
            return;
          }

          var selectedProperty = ids.properties[index];

          if (remove) {
            _this.remove(selectedProperty.datas);
          } else {
            _this.select(selectedProperty.dataset.key);

            if (arrow) {
              _this.fold(index);
            }
          }
        });
      };

      __proto.setInputs = function (obj) {
        var valuesArea = this.ids.valuesArea.element;

        for (var name in obj) {
          valuesArea.querySelector("[data-key=\"" + name + "\"] input").value = obj[name];
        }
      };

      __proto.moveCursor = function (time) {
        var cursors = this.ids.cursors;
        var maxTime = this.maxTime;
        var px = 15 - 30 * time / maxTime;
        var percent = 100 * time / maxTime;
        var left = "calc(" + percent + "% + " + px + "px)";
        cursors.forEach(function (cursor) {
          cursor.element.style.left = left;
        });
      };

      __proto.initDragKeyframes = function () {
        var _this = this;

        var ids = this.ids;
        var scrollArea = ids.scrollArea,
            timeArea = ids.timeArea,
            cursors = ids.cursors,
            keyframesAreas = ids.keyframesAreas,
            keyframesScrollAreas = ids.keyframesScrollAreas;
        var scene = this.scene;
        scene.on("animate", function (e) {
          var time = e.time;

          _this.moveCursor(time);

          _this.setInputs(flatObject(e.frames || e.frame.get()));

          var minute = numberFormat(Math.floor(time / 60), 2);
          var second = numberFormat(Math.floor(time % 60), 2);
          var milisecond = numberFormat(Math.floor(time % 1 * 100), 3, true);
          timeArea.element.value = minute + ":" + second + ":" + milisecond;
        });

        var getDistTime = function (distX, rect) {
          if (rect === void 0) {
            rect = keyframesScrollAreas[1].element.getBoundingClientRect();
          }

          var scrollAreaWidth = rect.width - 30;
          var percentage = Math.min(scrollAreaWidth, distX) / scrollAreaWidth;
          var time = _this.maxTime * percentage;
          return Math.round(time * 20) / 20;
        };

        var getTime = function (clientX) {
          var rect = keyframesScrollAreas[1].element.getBoundingClientRect();
          var scrollAreaX = rect.left + 15;
          var x = Math.max(clientX - scrollAreaX, 0);
          return getDistTime(x, rect);
        };

        var move = function (clientX) {
          _this.setTime(getTime(clientX));
        };

        var click = function (e, clientX, clientY) {
          var target = getTarget(e.target, function (el) {
            return hasClass(el, "keyframe");
          });
          var time = target ? parseFloat(target.getAttribute("data-time")) : getTime(clientX);

          _this.setTime(time);

          var list = ids.keyframesList;
          var index = findElementIndexByPosition(list.map(function (_a) {
            var element = _a.element;
            return element;
          }), clientY);

          if (index > -1) {
            _this.select(list[index].dataset.key, time);
          }

          e.preventDefault();
        };

        var dblclick = function (e, clientX, clientY) {
          var list = ids.keyframesList;
          var index = findElementIndexByPosition(list.map(function (_a) {
            var element = _a.element;
            return element;
          }), clientY);

          if (index === -1) {
            return;
          }

          _this.addKeyframe(index, getTime(clientX));
        };

        drag.drag(cursors[0].element, {
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
        var dragItem = null;
        var dragDelay = 0;
        var dragTarget = null;
        keyframesScrollAreas.forEach(function (_a) {
          var element = _a.element;
          drag.drag(element, {
            container: window,
            dragstart: function (_a) {
              var inputEvent = _a.inputEvent;
              dragTarget = getTarget(inputEvent.target, function (el) {
                return hasClass(el, "keyframe_group");
              });

              if (dragTarget) {
                var properties = _this.ids.properties;
                var keyframesTarget = getTarget(dragTarget, function (el) {
                  return hasClass(el, "keyframes");
                });
                var key = keyframesTarget.getAttribute("data-key");
                var property = findStructureByProperty(key, properties);
                var propertiesInfo = property.datas;
                dragItem = propertiesInfo.item;
                dragDelay = dragItem.getDelay();
              }
            },
            drag: function (_a) {
              var distX = _a.distX,
                  deltaX = _a.deltaX,
                  deltaY = _a.deltaY,
                  inputEvent = _a.inputEvent;

              if (dragTarget) {
                dragItem.setDelay(Math.max(dragDelay + getDistTime(distX), 0));

                _this.update();
              } else {
                keyframesAreas[1].element.scrollLeft -= deltaX;
                scrollArea.element.scrollTop -= deltaY;
                inputEvent.preventDefault();
              }
            },
            dragend: function (_a) {
              var isDrag = _a.isDrag,
                  clientX = _a.clientX,
                  clientY = _a.clientY,
                  inputEvent = _a.inputEvent;
              dragTarget = null;
              dragItem = null;
              dragDelay = null;
              !isDrag && click(inputEvent, clientX, clientY);
              dblCheck(isDrag, inputEvent, clientX, clientY, dblclick);
            }
          });
        });
      };

      __proto.initDragValues = function () {
        var _this = this;

        var ids = this.ids;
        var element = ids.valuesArea.element;
        var dragTarget = null;
        var dragTargetValue;
        utils.addEvent(element, "click", function (e) {
          var addedElement = getTarget(dragTarget, function (el) {
            return hasClass(el, "add");
          });

          if (!addedElement) {
            return;
          }

          var valueElement = addedElement.parentElement;
          var index = findIndexByProperty(valueElement.getAttribute("data-key"), ids.values);

          if (index < 0) {
            return;
          }

          var propertiesInfo = ids.properties[index].datas;
          var properties = propertiesInfo.properties.slice();
          var item = propertiesInfo.item;

          if (isScene(item)) {
            _this.newItem(item);
          } else {
            _this.newProperty(item, properties);
          }
        });
        drag.drag(element, {
          container: window,
          dragstart: function (e) {
            dragTarget = e.inputEvent.target;
            dragTargetValue = dragTarget.value;

            if (!_this.keycon.altKey || !getTarget(dragTarget, function (el) {
              return el.nodeName === "INPUT";
            })) {
              return false;
            }
          },
          drag: function (e) {
            var nextValue = dragTargetValue.replace(/-?\d+/g, function (num) {
              return "" + (parseFloat(num) + Math.round(e.distX / 2));
            });
            dragTarget.value = nextValue;
          },
          dragend: function (e) {
            _this.edit(dragTarget, dragTarget.value);
          }
        });
      };

      __proto.addKeyframe = function (index, time) {
        var list = this.ids.keyframesList;
        var property = list[index].dataset.key;
        var _a = list[index].datas,
            item = _a.item,
            properties = _a.properties;
        this.select(property, time);
        var value = this.ids.values[index].children.element.value;
        this.editKeyframe(index, value);
      };

      __proto.fold = function (index, forceFold) {
        var _this = this;

        var ids = this.ids;
        var properties = ids.properties,
            values = ids.values,
            keyframesList = ids.keyframesList;
        var selectedProperty = properties[index];
        var length = properties.length;
        var max;

        for (max = index + 1; max < length; ++max) {
          if (properties[max].datas.key.indexOf(selectedProperty.datas.key + "///") !== 0) {
            break;
          }
        }

        var foldProperties = properties.slice(index + 1, max);
        var foldValues = values.slice(index + 1, max);
        var foldKeyframesList = keyframesList.slice(index + 1, max);
        var selectedElement = selectedProperty.element; // true : unfold, false: fold

        var isFold = utils.isUndefined(forceFold) ? selectedElement.getAttribute("data-fold") === "1" : forceFold;
        selectedElement.setAttribute("data-fold", isFold ? "0" : "1");
        var foldFunction = isFold ? removeClass : addClass;
        var depth = selectedProperty.datas.keys.length;
        foldProperties.forEach(function (property, i) {
          var datas = property.datas;

          if (depth + 1 < datas.keys.length) {
            return;
          }

          foldFunction(property.element, "fold");
          foldFunction(foldValues[i].element, "fold");
          foldFunction(foldKeyframesList[i].element, "fold");

          if (datas.isParent) {
            if (!isFold) {
              _this.fold(index + 1 + i, false);
            } else {
              // always fold
              property.element.setAttribute("data-fold", "1");
            }
          } else {
            property.element.setAttribute("data-fold", isFold ? "0" : "1");
          }
        });
      };

      __proto.remove = function (propertiesInfo) {
        var key = propertiesInfo.key,
            isItem = propertiesInfo.isItem,
            parentItem = propertiesInfo.parentItem,
            targetItem = propertiesInfo.item,
            properties = propertiesInfo.properties;

        if (isItem) {
          var targetName_1 = null;
          parentItem.forEach(function (item, name) {
            if (item === targetItem) {
              targetName_1 = name;
              return;
            }
          });

          if (targetName_1 != null) {
            parentItem.removeItem(targetName_1);
          }
        } else {
          var times = targetItem.times;
          times.forEach(function (time) {
            var _a;

            (_a = targetItem).remove.apply(_a, [time].concat(properties));
          });
        }

        if (this.selectedProperty === key) {
          this.selectedProperty = "";
          this.selectedTime = -1;
        }

        this.update();
      };

      __proto.removeKeyframe = function (property) {
        var propertiesInfo = this.timelineInfo[property];

        if (!property || !propertiesInfo || isScene(propertiesInfo.item)) {
          return;
        }

        var properties = propertiesInfo.properties;
        var item = propertiesInfo.item;
        item.remove.apply(item, [item.getIterationTime()].concat(properties));
        this.update();
      };

      __proto.editKeyframe = function (index, value) {
        var ids = this.ids;
        var isObjectData = ids.properties[index].dataset.object === "1";

        if (isObjectData) {
          return;
        }

        var propertiesInfo = ids.keyframesList[index].datas;
        var item = propertiesInfo.item;
        var properties = propertiesInfo.properties;
        item.set.apply(item, [item.getIterationTime()].concat(properties, [value]));
        this.update();
      };

      __proto.restoreKeyframes = function () {
        this.setTime(this.scene.getTime());
      };

      __proto.edit = function (target, value) {
        var parentEl = getTarget(target, function (el) {
          return hasClass(el, "value");
        });

        if (!parentEl) {
          return;
        }

        var values = this.ids.values.map(function (_a) {
          var element = _a.element;
          return element;
        });
        var index = values.indexOf(parentEl);

        if (index === -1) {
          return;
        }

        this.editKeyframe(index, value);
      };

      __proto.initEditor = function () {
        var _this = this;

        var valuesArea = this.ids.valuesArea.element;
        new KeyController(valuesArea).keydown(function (e) {
          !e.isToggle && e.inputEvent.stopPropagation();
        }).keyup(function (e) {
          !e.isToggle && e.inputEvent.stopPropagation();
        }).keyup("enter", function (e) {
          var target = e.inputEvent.target;

          _this.edit(target, target.value);
        }).keyup("esc", function (e) {
          var target = e.inputEvent.target;
          target.blur();
        });
        valuesArea.addEventListener("focusout", function (e) {
          _this.restoreKeyframes();
        });
      };

      return Timeline;
    }(Component);

    return Timeline;

}));
//# sourceMappingURL=timeline.js.map
