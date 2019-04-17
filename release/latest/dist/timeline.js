/*
Copyright (c) 2019 Daybrush
name: @scenejs/timeline
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/scenejs-timeline.git
version: 0.0.5
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@daybrush/utils'), require('@daybrush/drag'), require('@egjs/axes'), require('keycon'), require('data-dom')) :
  typeof define === 'function' && define.amd ? define(['@daybrush/utils', '@daybrush/drag', '@egjs/axes', 'keycon', 'data-dom'], factory) :
  (global = global || self, global.Timeline = factory(global.utils, global.utils, global.eg.Axes, global.KeyController, global.DataDOM));
}(this, function (utils, drag, Axes, KeyController, DataDOM) { 'use strict';

  var PREFIX = "scenejs_timeline_";
  var CSS = "\n.timeline {\n  position: relative;\n  font-size: 0;\n  background: #000;\n  display: flex;\n  flex-direction: column;\n}\n.header_area, .scroll_area {\n   width: 100%;\n   position: relative;\n  display: flex;\n  -webkit-align-items: flex-start;\n  align-items: flex-start;\n}\n.header_area {\n  position: relative;\n  z-index: 10;\n  top: 0;\n  height: 30px;\n  min-height: 30px;\n}\n.header_area .keyframes {\n  padding: 0px;\n}\n.header_area .properties_area,\n.header_area .keyframes_area,\n.header_area .values_area,\n.header_area .keyframes_scroll_area {\n    height: 100%;\n}\n.header_area .property, .header_area .value, .header_area .keyframes {\n  height: 100%;\n}\n.header_area .property {\n    line-height: 30px;\n}\n.header_area .value {\n    text-align: center;\n    color: #fff;\n    line-height: 30px;\n    font-weight: bold;\n    font-size: 20px;\n}\n.header_area .keyframes_area::-webkit-scrollbar {\n    display: none; // Safari and Chrome\n}\n.header_area .keyframe_cursor {\n    position: absolute;\n    border-top: 10px solid #4af;\n    border-left: 6px solid transparent;\n    border-right: 6px solid transparent;\n    width: 0;\n    height: 0;\n    bottom: 0;\n    top: auto;\n    background: none;\n    cursor: pointer;\n}\n.control_area .keyframes {\n    padding-left: 10px;\n}\n.play_control_area {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n}\n.play_control_area .control {\n    position: relative;\n    display: inline-block;\n    vertical-align: middle;\n    color: white;\n    margin: 0px 15px;\n}\n.play {\n    border-left: 14px solid white;\n    border-top: 8px solid transparent;\n    border-bottom: 8px solid transparent;\n}\n.pause {\n    border-left: 4px solid #fff;\n    border-right: 4px solid #fff;\n    width: 6px;\n    height: 16px;\n}\n.prev {\n    border-right: 10px solid white;\n    border-top: 6px solid transparent;\n    border-bottom: 6px solid transparent;\n}\n.prev:before {\n    position: absolute;\n    content: \"\";\n    width: 3px;\n    height: 10px;\n    top: 0;\n    right: 100%;\n    transform: translate(0, -50%);\n    background: white;\n}\n.next {\n    border-left: 10px solid white;\n    border-top: 6px solid transparent;\n    border-bottom: 6px solid transparent;\n}\n.next:before {\n    position: absolute;\n    content: \"\";\n    width: 3px;\n    height: 10px;\n    top: 0;\n    transform: translate(0, -50%);\n    background: white;\n}\n.keytime {\n  position: relative;\n  display: inline-block;\n  height: 100%;\n  font-size: 13px;\n  font-weight: bold;\n  color: #777;\n}\n.keytime:last-child {\n  max-width: 0px;\n}\n.keytime span {\n  position: absolute;\n  top: 2px;\n  left: 0;\n  display: inline-block;\n  transform: translate(-50%);\n  color: #eee;\n}\n.keytime .graduation {\n  position: absolute;\n  bottom: 0;\n  width: 1px;\n  height: 10px;\n  background: #777;\n  transform: translate(-50%);\n}\n.keytime .graduation.half {\n  left: 50%;\n  height: 7px;\n}\n.keytime .graduation.quarter {\n  left: 25%;\n  height: 5px;\n}\n.keytime .graduation.quarter3 {\n  left: 75%;\n  height: 5px;\n}\n.scroll_area {\n  position: relative;\n  width: 100%;\n  height: calc(100% - 60px);\n  overflow: auto;\n}\n.properties_area, .keyframes_area, .values_area {\n  display: inline-block;\n  position: relative;\n  font-size: 16px;\n  overflow: auto;\n}\n\n.properties_area::-webkit-scrollbar, .keyframes_area::-webkit-scrollbar {\n    display: none; // Safari and Chrome\n}\n.properties_area {\n  width: 30%;\n  max-width: 200px;\n  box-sizing: border-box;\n}\n.values_area {\n    width: 50px;\n    min-width: 50px;\n    display: inline-block;\n    border-right: 1px solid #999;\n    box-sizing: border-box;\n}\n.value input {\n    appearance: none;\n    -webkit-appearance: none;\n    outline: none;\n    position: relative;\n    display: block;\n    width: 100%;\n    height: 100%;\n    background: transparent;\n    color: #4af;\n    font-weight: bold;\n    background: none;\n    border: 0;\n    box-sizing: border-box;\n    text-align: center;\n}\n.alt .value input {\n    cursor: ew-resize;\n}\n.value[data-object=\"1\"] input {\n    display: none;\n}\n.properties_scroll_area {\n  display: inline-block;\n  min-width: 100%;\n}\n.keyframes_area {\n  flex: 1;\n}\n.keyframes_scroll_area {\n  position: relative;\n  min-width: 300px;\n}\n.keyframes, .property, .value {\n  position: relative;\n  height: 25px;\n  border-bottom: 1px solid #777;\n  box-sizing: border-box;\n  white-space: nowrap;\n  background: rgba(90, 90, 90, 0.7);\n  z-index: 1;\n}\n\n.property {\n  line-height: 25px;\n  padding-left: 10px;\n  box-sizing: border-box;\n  font-size: 13px;\n  font-weight: bold;\n  color: #eee;\n}\n.time_area {\n    font-size: 13px;\n    color: #4af;\n    line-height: 30px;\n    font-weight: bold;\n    height: 100%;\n    line-height: 30px;\n    border: 0;\n    background: transparent;\n    outline: 0;\n}\n.time_area:after {\n    content: \"s\";\n}\n.property .arrow {\n    position: relative;\n    display: inline-block;\n    margin-right: 5px;\n    width: 0;\n    vertical-align: middle;\n    cursor: pointer;\n    border-top: 6px solid #eee;\n    border-left: 4px solid transparent;\n    border-right: 4px solid transparent;\n}\n.property[data-fold=\"1\"] .arrow {\n    border-top: 4px solid transparent;\n    border-bottom: 4px solid transparent;\n    border-right: 0;\n    border-left: 6px solid #eee;\n    margin-left: 2px;\n}\n.property[data-object=\"0\"] .arrow {\n    display: none;\n}\n.property.fold, .keyframes.fold, .value.fold {\n    display: none;\n}\n.property.select, .value.select, .keyframes.select {\n    background: rgba(120, 120, 120, 0.7);\n}\n.keyframes {\n\n}\n.keyframe_line {\n  position: absolute;\n  height: 8px;\n  top: 0;\n  bottom: 0;\n  margin: auto;\n  background: #666;\n  z-index: 0;\n}\n.keyframe {\n  position: absolute;\n  font-size: 0px;\n  width: 12px;\n  height: 12px;\n  top: 0px;\n  bottom: 0px;\n  margin: auto;\n  background: #fff;\n  border: 2px solid #383838;\n  border-radius: 2px;\n  box-sizing: border-box;\n  transform: translate(-50%) rotate(45deg);\n  z-index: 1;\n  cursor: pointer;\n}\n.select .keyframe {\n    border-color: #555;\n}\n.keyframe.select {\n    background: #4af;\n}\n.keyframes_container, .line_area {\n  position: relative;\n  width: calc(100% - 30px);\n  left: 15px;\n  height: 100%;\n}\n.line_area {\n  position: absolute;\n  top: 0;\n  z-index: 0;\n}\n.keyframe_cursor {\n  position: absolute;\n  top: 0;\n  z-index: 1;\n  background: #4af;\n  width: 1px;\n  height: 100%;\n  left: 15px;\n  transform: translate(-50%);\n}\n.division_line {\n  position: absolute;\n  background: #333;\n  width: 1px;\n  height: 100%;\n  transform: translate(-50%);\n}\n".replace(/\.([^{,\s\d.]+)/g, "." + PREFIX + "$1");

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
      var property = _a.dataset.property;
      return property === selectedProperty;
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
    return utils.hasClass(target, "" + PREFIX + className);
  }
  function addClass(target, className) {
    return utils.addClass(target, "" + PREFIX + className);
  }
  function removeClass(target, className) {
    return utils.removeClass(target, "" + PREFIX + className);
  }
  function isSceneItem(value) {
    return !!value.constructor.prototype.getFrame;
  }
  function isFrame(value) {
    return !!value.constructor.prototype.toCSS;
  }
  function splitProperty(scene, property) {
    var names = property.split("///");
    var length = names.length;
    var item = scene;
    var i;

    for (i = 0; i < length; ++i) {
      if (isSceneItem(item)) {
        break;
      }

      item = scene.getItem(names[i]);
    }

    return {
      item: item,
      names: names.slice(0, i),
      properties: names.slice(i)
    };
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
          html: "+"
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

    for (var property in timelineInfo) {
      var times = timelineInfo[property];
      var keyframes = getKeyframesStructure(times, maxTime);
      keyframesList.push({
        ref: function (e, i) {
          ids.keyframesList[i] = e;
          ids.keyframesContainers[i] = e.children;
        },
        selector: ".keyframes",
        key: property,
        dataset: {
          property: property
        },
        children: {
          selector: ".keyframes_container",
          children: keyframes
        }
      });
    }

    return keyframesList;
  }
  function getKeyframesStructure(times, maxTime) {
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

        if (valueText !== nextValueText) {
          keyframeLines.push({
            selector: ".keyframe_line",
            key: time + "," + nextTime,
            dataset: {
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

      return {
        key: time,
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
    return keyframes.concat(keyframeLines);
  }

  function getPropertiesStructure(ids, timelineInfo) {
    var properties = [];

    var _loop_1 = function (property) {
      var propertyNames = property.split("///");
      var length = propertyNames.length;
      var id = propertyNames[length - 1];
      properties.push({
        ref: function (e, i) {
          ids.properties[i] = e;
        },
        key: property,
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
        children: [{
          selector: ".arrow"
        }, {
          selector: "span",
          html: id
        }]
      });
      var parentProperty = propertyNames.slice(0, -1).join("///");
      properties.forEach(function (_a) {
        var dataset = _a.dataset;

        if (dataset.property === parentProperty) {
          dataset.object = "1";
        }
      });
    };

    for (var property in timelineInfo) {
      _loop_1(property);
    }

    return properties;
  }

  function getValuesStructure(ids, timelineInfo) {
    var values = [];

    for (var property in timelineInfo) {
      var times = timelineInfo[property];
      var isHasObject = times[0] && utils.isObject(times[0][1]);
      values.push({
        ref: function (e, i) {
          ids.values[i] = e;
        },
        key: property,
        selector: ".value",
        dataset: {
          property: property,
          object: isHasObject ? "1" : "0"
        },
        children: {
          selector: "input",
          attr: {
            value: times[0] ? times[0][1] : ""
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

  var isExportCSS = false;

  var Timeline =
  /*#__PURE__*/
  function () {
    function Timeline(scene, parentEl) {
      this.maxTime = 0;
      this.selectedProperty = "";
      this.selectedTime = -1;
      this.ids = {};
      scene.finish();
      this.scene = scene;
      this.initStructure(scene, parentEl);
      this.initEditor();
      this.initScroll();
      this.initWheelZoom();
      this.initDragKeyframes();
      this.initClickProperty();
      this.initController();
      this.initDragValues();
      this.initKeyController();
      scene.setTime(0);
    }

    var __proto = Timeline.prototype;

    __proto.getElement = function () {
      return this.structure.element;
    }; // scene control


    __proto.prev = function () {
      this.scene.setTime(this.scene.getTime() - 0.05);
    };

    __proto.next = function () {
      this.scene.setTime(this.scene.getTime() + 0.05);
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
    }; // init


    __proto.initController = function () {
      var _this = this;

      var ids = this.ids;
      var playBtn = this.ids.playBtn.element;
      var scene = this.scene;
      playBtn.addEventListener("click", function (e) {
        _this.togglePlay();

        e.preventDefault();
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
        scene.setTime(time);
      });
    };

    __proto.initKeyController = function () {
      var _this = this;

      var ids = this.ids;
      window.addEventListener("blur", function () {
        removeClass(ids.timeline.element, "alt");
      });
      this.keycon = new KeyController().keydown("space", function (_a) {
        var inputEvent = _a.inputEvent;
        inputEvent.preventDefault();
      }).keydown("left", function (e) {
        _this.prev();
      }).keydown("right", function (e) {
        _this.next();
      }).keyup("backspace", function () {
        _this.removeKeyframe(_this.selectedProperty, _this.scene.getTime());
      }).keydown("alt", function () {
        addClass(ids.timeline.element, "alt");
      }).keyup("alt", function () {
        removeClass(ids.timeline.element, "alt");
      }).keyup("esc", function () {
        _this.finish();
      }).keyup("space", function () {
        _this.togglePlay();
      });
    };

    __proto.initStructure = function (scene, parentEl) {
      var duration = Math.ceil(scene.getDuration());
      var timelineInfo = getTimelineInfo(scene);
      var maxDuration = Math.ceil(duration);
      var maxTime = maxDuration + 5;
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
        children: [timelineCSS, getControlAreaStructure(ids), getHeaderAreaStructure(ids, 1, maxDuration, maxTime), getScrollAreaStructure(ids, timelineInfo, 1, maxDuration, maxTime)]
      };
      this.datadom = new DataDOM(createElement, updateElement);
      this.structure = this.datadom.render(structure, parentEl);
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
      axes.connect("zoom", new Axes.PinchInput(scrollArea, {
        scale: 0.1,
        hammerManagerOptions: {
          touchAction: "auto"
        }
      }));
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

      if (prevSelectedProperty) {
        var prevSelectedIndex = findIndexByProperty(prevSelectedProperty, properties);
        removeClass(properties[prevSelectedIndex].element, "select");
        removeClass(values[prevSelectedIndex].element, "select");
        removeClass(keyframesList[prevSelectedIndex].element, "select");

        if (prevSelectedTime >= 0) {
          var keyframes = ids.keyframesContainers[prevSelectedIndex].children;
          keyframes.forEach(function (keyframe) {
            if (keyframe.dataset.time === prevSelectedTime) {
              removeClass(keyframe.element, "select");
            }
          });
          this.selectedTime = -1;
        }
      }

      if (selectedProperty) {
        if (document.activeElement) {
          document.activeElement.blur();
        }

        var selectedIndex = findIndexByProperty(selectedProperty, properties);
        addClass(properties[selectedIndex].element, "select");
        addClass(values[selectedIndex].element, "select");
        addClass(keyframesList[selectedIndex].element, "select");

        if (keyframeTime >= 0) {
          var keyframes = ids.keyframesContainers[selectedIndex].children;
          console.log(ids.keyframesContainers, selectedIndex);
          keyframes.forEach(function (keyframe) {
            console.log(keyframe.dataset.time, keyframeTime);

            if (keyframe.dataset.time === keyframeTime) {
              addClass(keyframe.element, "select");
            }
          });
          this.selectedTime = keyframeTime;
        }
      }
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
        var target = getTarget(e.target, function (el) {
          return hasClass(el, "property");
        });

        if (!target) {
          return;
        }

        var index = properties.indexOf(target);

        if (index === -1) {
          return;
        } // select


        if (!arrow) {
          _this.select(properties[index].dataset.property);

          return;
        }
      });
    };

    __proto.setInputs = function (obj) {
      var valuesArea = this.ids.valuesArea.element;

      for (var name in obj) {
        valuesArea.querySelector("[data-property=\"" + name + "\"] input").value = obj[name];
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

        _this.setInputs(flatObject(e.frames));

        var minute = numberFormat(Math.floor(time / 60), 2);
        var second = numberFormat(Math.floor(time % 60), 2);
        var milisecond = numberFormat(Math.floor(time % 1 * 100), 3, true);
        timeArea.element.value = minute + ":" + second + ":" + milisecond;
      });

      var getTime = function (clientX) {
        var rect = keyframesScrollAreas[1].element.getBoundingClientRect();
        var scrollAreaWidth = rect.width - 30;
        var scrollAreaX = rect.left + 15;
        var x = Math.min(scrollAreaWidth, Math.max(clientX - scrollAreaX, 0));
        var percentage = x / scrollAreaWidth;
        var time = _this.maxTime * percentage;
        time = Math.round(time * 20) / 20;
        return time;
      };

      var move = function (clientX) {
        scene.setTime(getTime(clientX));
      };

      var click = function (e, clientX, clientY) {
        var target = getTarget(e.target, function (el) {
          return hasClass(el, "keyframe");
        });
        var time = target ? parseFloat(target.getAttribute("data-time")) : getTime(clientX);
        scene.setTime(time);
        var list = ids.keyframesList;
        var index = findElementIndexByPosition(list.map(function (_a) {
          var element = _a.element;
          return element;
        }), clientY);

        if (index > -1) {
          _this.select(list[index].dataset.property, time);
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
      keyframesScrollAreas.forEach(function (_a) {
        var element = _a.element;
        drag.drag(element, {
          container: window,
          drag: function (_a) {
            var deltaX = _a.deltaX,
                deltaY = _a.deltaY,
                inputEvent = _a.inputEvent;
            keyframesAreas[1].element.scrollLeft -= deltaX;
            scrollArea.element.scrollTop -= deltaY;
            inputEvent.preventDefault();
          },
          dragend: function (_a) {
            var isDrag = _a.isDrag,
                clientX = _a.clientX,
                clientY = _a.clientY,
                inputEvent = _a.inputEvent;
            !isDrag && click(inputEvent, clientX, clientY);
            dblCheck(isDrag, inputEvent, clientX, clientY, dblclick);
          }
        });
      });
    };

    __proto.initDragValues = function () {
      var _this = this;

      var dragTarget = null;
      var dragTargetValue;
      drag.drag(this.ids.valuesArea.element, {
        container: window,
        dragstart: function (e) {
          dragTarget = e.inputEvent.target;
          dragTargetValue = dragTarget.value;
          console.log(_this.keycon.altKey, getTarget(dragTarget, function (el) {
            return el.nodeName === "INPUT";
          }));

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
      var scene = this.scene;
      var property = list[index].dataset.property;

      var _a = splitProperty(scene, property),
          item = _a.item,
          properties = _a.properties;

      this.editKeyframe(time, item.getNowValue(time, properties), index);
      this.select(property, time);
    };

    __proto.removeKeyframe = function (property, time) {
      if (!property) {
        return;
      }

      var scene = this.scene;

      var _a = splitProperty(scene, property),
          item = _a.item,
          properties = _a.properties;

      if (properties.length) {
        item.remove.apply(item, [time].concat(properties));
      } else {
        item.removeFrame(time);
      }

      this.update();
    };

    __proto.update = function () {
      var scene = this.scene;
      var timelineInfo = getTimelineInfo(scene);
      var maxDuration = Math.ceil(scene.getDuration());
      var maxTime = maxDuration + 5;
      var zoom = this.axes.get(["zoom"]).zoom;
      var currentMaxTime = this.maxTime;
      this.maxTime = maxTime;
      var ids = this.ids;
      var prevKeytimesArea = ids.keyframesAreas[0];
      var nextZoom = currentMaxTime > 5 ? maxDuration / (currentMaxTime - 5) : 1;
      zoom = zoom * nextZoom;
      this.axes.axm.set({
        zoom: zoom
      }); // update keytimes

      this.datadom.update(prevKeytimesArea, getKeytimesAreaStructure(ids, zoom, maxDuration, maxTime));
      var nextScrollAreaStructure = getScrollAreaStructure(ids, timelineInfo, this.axes.get(["zoom"]).zoom, maxDuration, this.maxTime);
      this.datadom.update(ids.scrollArea, nextScrollAreaStructure);
      scene.setTime(scene.getTime());
    };

    __proto.editKeyframe = function (time, value, index) {
      var ids = this.ids;
      var valuesStructure = ids.values;
      var isObjectData = ids.properties[index].dataset.object === "1";

      if (isObjectData) {
        return;
      }

      var property = valuesStructure[index].dataset.property;
      var properties = property.split("///");
      var scene = this.scene;
      scene.set.apply(scene, [time].concat(properties, [value]));
      scene.setTime(time);
      this.update();
    };

    __proto.restoreKeyframes = function () {
      this.scene.setTime(this.scene.getTime());
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

      this.editKeyframe(this.scene.getTime(), value, index);
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
  }();

  return Timeline;

}));
//# sourceMappingURL=timeline.js.map
