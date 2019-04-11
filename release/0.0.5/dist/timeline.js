/*
Copyright (c) 2019 
name: @scenejs/timeline
license: ISC
author: 
repository: git+https://github.com/daybrush/scenejs-timeline.git
version: 0.0.5
*/
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('@daybrush/utils'), require('@daybrush/drag'), require('@egjs/axes')) :
  typeof define === 'function' && define.amd ? define(['@daybrush/utils', '@daybrush/drag', '@egjs/axes'], factory) :
  (global = global || self, global.Timeline = factory(global.utils, global.utils, global.eg.Axes));
}(this, function (utils, drag, Axes) { 'use strict';

  var PREFIX = "scenejs_timeline_";
  var CSS = "\n.timeline {\n  position: relative;\n  font-size: 0;\n  background: #000;\n  display: flex;\n  flex-direction: column;\n}\n.header_area, .scroll_area {\n   width: 100%;\n   position: relative;\n  display: flex;\n  -webkit-align-items: flex-start;\n  align-items: flex-start;\n}\n.header_area {\n  position: relative;\n  z-index: 10;\n  top: 0;\n  height: 30px;\n  min-height: 30px;\n}\n.header_area .keyframes {\n  padding: 0px;\n}\n.header_area .properties_area,\n.header_area .keyframes_area,\n.header_area .values_area,\n.header_area .keyframes_scroll_area {\n    height: 100%;\n}\n.header_area .property, .header_area .value, .header_area .keyframes {\n  height: 100%;\n}\n.header_area .property {\n    line-height: 30px;\n}\n.header_area .value {\n    text-align: center;\n    color: #fff;\n    line-height: 30px;\n    font-weight: bold;\n    font-size: 20px;\n}\n.header_area .keyframes_area::-webkit-scrollbar {\n    display: none; // Safari and Chrome\n}\n.header_area .keyframe_cursor {\n    position: absolute;\n    border-top: 10px solid #f55;\n    border-left: 5px solid transparent;\n    border-right: 5px solid transparent;\n    width: 0;\n    height: 0;\n    bottom: 0;\n    top: auto;\n    background: none;\n    cursor: pointer;\n}\n.control_area .keyframes {\n    padding-left: 10px;\n}\n.play_control_area {\n    position: absolute;\n    top: 0;\n    left: 50%;\n    transform: translate(-50%);\n}\n.play_control_area .control {\n    display: inline-block;\n    color: white;\n    margin: 0px 10px;\n}\n.keytime {\n  position: relative;\n  display: inline-block;\n  height: 100%;\n  font-size: 13px;\n  font-weight: bold;\n  color: #777;\n}\n.keytime:last-child {\n  max-width: 0px;\n}\n.keytime span {\n  position: absolute;\n  top: 2px;\n  left: 0;\n  display: inline-block;\n  transform: translate(-50%);\n  color: #eee;\n}\n.keytime .graduation {\n  position: absolute;\n  bottom: 0;\n  width: 1px;\n  height: 10px;\n  background: #777;\n  transform: translate(-50%);\n}\n.keytime .graduation.half {\n  left: 50%;\n  height: 7px;\n}\n.keytime .graduation.quarter {\n  left: 25%;\n  height: 5px;\n}\n.keytime .graduation.quarter3 {\n  left: 75%;\n  height: 5px;\n}\n.scroll_area {\n  position: relative;\n  width: 100%;\n  height: calc(100% - 60px);\n  overflow: auto;\n}\n.properties_area, .keyframes_area, .values_area {\n  display: inline-block;\n  position: relative;\n  font-size: 16px;\n  overflow: auto;\n}\n\n.properties_area::-webkit-scrollbar, .keyframes_area::-webkit-scrollbar {\n    display: none; // Safari and Chrome\n}\n.properties_area {\n  width: 30%;\n  max-width: 200px;\n  box-sizing: border-box;\n}\n.values_area {\n    width: 50px;\n    min-width: 50px;\n    display: inline-block;\n    border-right: 1px solid #999;\n    box-sizing: border-box;\n}\n.value input {\n    appearance: none;\n    -webkit-appearance: none;\n    outline: none;\n    position: relative;\n    display: block;\n    width: 100%;\n    height: 100%;\n    background: transparent;\n    color: #fe5;\n    font-weight: bold;\n    background: none;\n    border: 0;\n    box-sizing: border-box;\n    text-align: center;\n}\n.value[data-object=\"1\"] input {\n    display: none;\n}\n.properties_scroll_area {\n  display: inline-block;\n  min-width: 100%;\n}\n.keyframes_area {\n  flex: 1;\n}\n.keyframes_scroll_area {\n  position: relative;\n  min-width: 300px;\n}\n.keyframes, .property, .value {\n  position: relative;\n  height: 25px;\n  border-bottom: 1px solid #777;\n  box-sizing: border-box;\n  white-space: nowrap;\n  background: rgba(90, 90, 90, 0.7);\n  z-index: 1;\n}\n\n.property {\n  line-height: 25px;\n  padding-left: 10px;\n  box-sizing: border-box;\n  font-size: 13px;\n  font-weight: bold;\n  color: #eee;\n}\n.time_area {\n    font-size: 13px;\n    color: #fe5;\n    line-height: 30px;\n    font-weight: bold;\n}\n.time_area:after {\n    content: \"s\";\n}\n.property .arrow {\n    position: relative;\n    display: inline-block;\n    margin-right: 5px;\n    width: 0;\n    vertical-align: middle;\n    cursor: pointer;\n    border-top: 6px solid #eee;\n    border-left: 4px solid transparent;\n    border-right: 4px solid transparent;\n}\n.property[data-fold=\"1\"] .arrow {\n    border-top: 4px solid transparent;\n    border-bottom: 4px solid transparent;\n    border-right: 0;\n    border-left: 6px solid #eee;\n    margin-left: 2px;\n}\n.property[data-object=\"0\"] .arrow {\n    display: none;\n}\n.property.fold, .keyframes.fold, .value.fold {\n    display: none;\n}\n.property.select, .value.select, .keyframes.select {\n    background: rgba(120, 120, 120, 0.7);\n}\n.keyframes {\n\n}\n.keyframe_line {\n  position: absolute;\n  height: 8px;\n  top: 0;\n  bottom: 0;\n  margin: auto;\n  background: #aaa;\n  z-index: 0;\n}\n.keyframe {\n  position: absolute;\n  font-size: 0px;\n  width: 12px;\n  height: 12px;\n  top: 0px;\n  bottom: 0px;\n  margin: auto;\n  background: #fff;\n  border: 2px solid #383838;\n  border-radius: 2px;\n  box-sizing: border-box;\n  transform: translate(-50%) rotate(45deg);\n  z-index: 1;\n  cursor: pointer;\n}\n.select .keyframe {\n    border-color: #4d4d4d;\n}\n.keyframes_container, .line_area {\n  position: relative;\n  width: calc(100% - 30px);\n  left: 15px;\n  height: 100%;\n}\n.line_area {\n  position: absolute;\n  top: 0;\n  z-index: 0;\n}\n.keyframe_cursor {\n  position: absolute;\n  top: 0;\n  z-index: 1;\n  background: #f55;\n  width: 1px;\n  height: 100%;\n  left: 15px;\n  transform: translate(-50%);\n}\n.division_line {\n  position: absolute;\n  background: #333;\n  width: 1px;\n  height: 100%;\n  transform: translate(-50%);\n}\n".replace(/\.([^{,\s\d.]+)/g, "." + PREFIX + "$1");

  function applyStyle(el, style) {
    for (var name in style) {
      el.style[name] = style[name];
    }
  }
  function createElement(structure, parentEl) {
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
  function makeStructure(structure, parentEl, obj) {
    if (obj === void 0) {
      obj = {
        structures: {},
        elements: {},
        element: null
      };
    }

    var id = structure.id,
        memberof = structure.memberof,
        children = structure.children;
    var el = createElement(structure);
    var structures = obj.structures;
    var elements = obj.elements;

    if (id) {
      [].concat(id).forEach(function (nextId) {
        var isArrayId = nextId.indexOf("[]") > -1;
        var isDoubleArrayId = isArrayId && nextId.indexOf("[][]") > -1;

        if (isArrayId) {
          var objId = nextId.replace(/\[\]/g, "");

          if (!structures[objId]) {
            structures[objId] = [];
            elements[objId] = [];
          }

          if (isDoubleArrayId) {
            structures[objId].push([]);
            elements[objId].push([]);
          } else {
            structures[objId].push(structure);
            elements[objId].push(el);
          }
        } else {
          structures[nextId] = structure;
          elements[nextId] = el;
        }
      });
    }

    if (memberof) {
      if (!structures[memberof]) {
        structures[memberof] = [[]];
        elements[memberof] = [[]];
      }

      structures[memberof][structures[memberof].length - 1].push(structure);
      elements[memberof][elements[memberof].length - 1].push(el);
    }

    if (children) {
      [].concat(children).filter(function (child) {
        return child;
      }).forEach(function (child) {
        if (utils.isString(child)) {
          makeStructure({
            selector: child
          }, el, obj);
        } else {
          makeStructure(child, el, obj);
        }
      });
    }

    parentEl && parentEl.appendChild(el);
    structure.element = el;
    obj.element = el;
    return obj;
  }
  function compare(prevArr, nextArr, callback, syncCallback) {
    var prevKeys = prevArr.map(callback);
    var nextKeys = nextArr.map(callback);
    var prevKeysObject = {};
    var nextKeysObject = {};
    var added = [];
    var removed = [];
    prevKeys.forEach(function (key, i) {
      prevKeysObject[key] = i;
    });
    nextKeys.forEach(function (key, i) {
      if (!(key in prevKeysObject)) {
        added.push(i);
      } else {
        syncCallback(prevArr[prevKeysObject[key]], nextArr[i]);
      }

      nextKeysObject[key] = i;
    });
    prevKeys.forEach(function (key, i) {
      if (!(key in nextKeysObject)) {
        removed.push(i);
      }
    });
    return {
      added: added,
      removed: removed
    };
  }
  function makeCompareStructure(prevStructures, nextStructures, parentStructure, callback, syncCallback) {
    var parentElement = parentStructure.element;

    var _a = compare(prevStructures, nextStructures, callback, function (prev, next) {
      next.element = prev.element;
      syncCallback && syncCallback(prev, next);
    }),
        added = _a.added,
        removed = _a.removed;

    removed.reverse().forEach(function (index) {
      parentElement.removeChild(prevStructures[index].element);
    });
    added.forEach(function (index) {
      var element = makeStructure(nextStructures[index]).element;
      parentElement.insertBefore(element, nextStructures[index + 1] && nextStructures[index + 1].element);
    });
    parentStructure.children = nextStructures;
  }
  function isSceneItem(value) {
    return value.constructor.name === "SceneItem";
  }
  function isFrame(value) {
    return value.constructor.name === "Frame";
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
  function getSceneItem(scene, names) {
    return names.reduce(function (nextScene, name) {
      return nextScene.getItem(name);
    }, scene);
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

  function updateKeyframesStructure(keyframes, maxTime) {
    keyframes.forEach(function (keyframe) {
      var selector = keyframe.selector,
          dataset = keyframe.dataset,
          style = keyframe.style;

      if (selector === ".keyframe") {
        style.left = dataset.time / maxTime * 100 + "%";
      } else {
        style.left = dataset.from / maxTime * 100 + "%", style.width = (dataset.to - dataset.from) / maxTime * 100 + "%";
      }
    });
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

        if (valueText === nextValueText) {
          keyframeLines.push({
            selector: ".keyframe_line",
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
        memberof: "keyframesInfoList",
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
        selector: ".division_line",
        style: {
          left: 100 / maxTime * time + "%"
        }
      });
    }

    return lines;
  }

  var isExportCSS = false;

  var Timeline =
  /*#__PURE__*/
  function () {
    function Timeline(scene, parentEl) {
      this.propertiesNames = [];
      this.maxTime = 0;
      this.selectedIndex = -1;
      scene.finish();
      this.scene = scene;
      this.initElement(scene, parentEl);
      this.editor();
    }

    var __proto = Timeline.prototype;

    __proto.getElement = function () {
      return this.elements.timeline;
    };

    __proto.initElement = function (scene, parentEl) {
      var duration = scene.getDuration();
      var timelineInfo = getTimelineInfo(scene);
      var maxDuration = Math.ceil(duration);
      var maxTime = maxDuration + 5;
      var propertiesNames = this.propertiesNames;
      var properties = [];
      var values = [];
      var keyframesList = [];
      var timelineCSS;
      this.maxTime = maxTime;

      if (!isExportCSS) {
        timelineCSS = {
          selector: "style.style",
          html: CSS
        };
        isExportCSS = true;
      }

      var _loop_1 = function (property) {
        var propertyNames = property.split("///");
        var length = propertyNames.length;
        var times = timelineInfo[property];
        var id = propertyNames[length - 1];
        propertiesNames.push(property);
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
          children: [{
            selector: ".arrow"
          }, {
            selector: "span",
            html: id
          }]
        });
        var isHasObject = times[0] && utils.isObject(times[0][1]);
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
        var keyframes = getKeyframesStructure(times, maxTime);
        keyframesList.push({
          id: ["keyframesList[]", "keyframesInfoList[][]"],
          selector: ".keyframes",
          dataset: {
            property: property
          },
          children: {
            id: "keyframesContainers[]",
            selector: ".keyframes_container",
            children: keyframes
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
                selector: ".time_area",
                id: "timeArea",
                html: "0"
              }, {
                selector: ".play_control_area",
                id: "playControlArea",
                children: [{
                  selector: ".control.prev",
                  html: "prev"
                }, {
                  selector: ".control.play",
                  html: "play"
                }, {
                  selector: ".control.next",
                  html: "next"
                }]
              }]
            }
          }]
        }, {
          selector: ".header_area",
          children: [{
            id: ["propertiesAreas[]"],
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
                  id: "keytimesContainer",
                  selector: ".keyframes_container",
                  children: getKeytimesStructure(maxTime)
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
                id: "lineArea",
                selector: ".line_area",
                children: getLinesStructure(maxTime)
              }])
            }
          }]
        }]
      };

      var _a = makeStructure(structure, parentEl),
          structures = _a.structures,
          elements = _a.elements;

      this.structures = structures;
      this.elements = elements;
      this.syncScroll();
      this.wheelZoom();
      this.dragKeyframes();
      this.clickProperty();
    };

    __proto.syncScroll = function () {
      var keyframesAreas = this.elements.keyframesAreas;
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
      var keyframesScrollAreas = this.elements.keyframesScrollAreas;
      var originalWidth = parseFloat(keyframesScrollAreas[0].style.width);
      var axes = new Axes({
        zoom: {
          range: [100, Infinity]
        }
      }, {}, {
        zoom: originalWidth
      });
      axes.connect("zoom", new Axes.PinchInput(keyframesScrollAreas[1], {
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
      this.axes = axes;
      keyframesScrollAreas[0].addEventListener("wheel", function (e) {
        var delta = e.deltaY;
        axes.setBy({
          zoom: delta / originalWidth * 5
        });
        !e.deltaX && e.preventDefault();
      });
    };

    __proto.select = function (index) {
      var prevSelectedIndex = this.selectedIndex;
      var values = this.structures.values;
      var properties = this.structures.properties;
      var keyframesList = this.structures.keyframesList;
      this.selectedIndex = index;

      if (prevSelectedIndex > -1) {
        removeClass(properties[prevSelectedIndex].element, "select");
        removeClass(values[prevSelectedIndex].element, "select");
        removeClass(keyframesList[prevSelectedIndex].element, "select");
      }

      if (index > -1) {
        addClass(properties[index].element, "select");
        addClass(values[index].element, "select");
        addClass(keyframesList[index].element, "select");
      }
    };

    __proto.clickProperty = function () {
      var _this = this;

      var _a = this.elements,
          keyframesList = _a.keyframesList,
          values = _a.values,
          propertiesAreas = _a.propertiesAreas;
      propertiesAreas[1].addEventListener("click", function (e) {
        var properties = _this.elements.properties;
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
          _this.select(index);

          return;
        } // fold


        if (target.getAttribute("data-object") === "0") {
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
      var valuesArea = this.elements.valuesArea;

      for (var name in obj) {
        valuesArea.querySelector("[data-property=\"" + name + "\"] input").value = obj[name];
      }
    };

    __proto.moveCursor = function (time) {
      var cursors = this.elements.cursors;
      var maxTime = this.maxTime;
      var px = 15 - 30 * time / maxTime;
      var percent = 100 * time / maxTime;
      var left = "calc(" + percent + "% + " + px + "px)";
      cursors.forEach(function (cursor) {
        cursor.style.left = left;
      });
    };

    __proto.dragKeyframes = function () {
      var _this = this;

      var structures = this.structures;
      var _a = this.elements,
          scrollArea = _a.scrollArea,
          timeArea = _a.timeArea,
          cursors = _a.cursors,
          keyframesAreas = _a.keyframesAreas,
          keyframesScrollAreas = _a.keyframesScrollAreas;
      var scene = this.scene;
      scene.on("animate", function (e) {
        var time = e.time;

        _this.moveCursor(time);

        _this.setInputs(flatObject(e.frames));

        timeArea.innerHTML = "" + time;
      });

      var getTime = function (clientX) {
        var rect = keyframesScrollAreas[1].getBoundingClientRect();
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

        if (target) {
          scene.setTime(target.getAttribute("data-time"));
        } else if (!hasClass(e.target, "keyframe_cursor")) {
          move(clientX);
        }

        var list = structures.keyframesList;
        var index = findElementIndexByPosition(list.map(function (_a) {
          var element = _a.element;
          return element;
        }), clientY);

        _this.select(index);

        e.preventDefault();
      };

      var dblclick = function (e, clientX, clientY) {
        var list = _this.structures.keyframesList;
        var index = findElementIndexByPosition(list.map(function (_a) {
          var element = _a.element;
          return element;
        }), clientY);

        if (index === -1) {
          return;
        }

        var time = getTime(clientX);

        var _a = splitProperty(scene, list[index].dataset.property),
            item = _a.item,
            properties = _a.properties;

        _this.editKeyframe(time, item.getNowValue(time, properties), index, true);

        _this.updateKeytimes();
      };

      drag.drag(cursors[0], {
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
        drag.drag(el, {
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
                clientY = _a.clientY,
                inputEvent = _a.inputEvent;
            !isDrag && click(inputEvent, clientX, clientY);
            dblCheck(isDrag, inputEvent, clientX, clientY, dblclick);
          }
        });
      });
    };

    __proto.updateKeytimes = function () {
      var maxTime = this.scene.getDuration() + 5;
      var currentMaxTime = this.maxTime;

      if (maxTime === currentMaxTime) {
        return;
      }

      this.maxTime = maxTime;
      var keytimesContainer = this.structures.keytimesContainer;
      var lineArea = this.structures.lineArea;
      var keytimes = keytimesContainer.children;
      var lines = lineArea.children;
      var nextKeytimes = getKeytimesStructure(maxTime);
      var nextLines = getLinesStructure(maxTime);
      makeCompareStructure(keytimes, nextKeytimes, keytimesContainer, function (_a) {
        var dataset = _a.dataset;
        return dataset.time;
      }, function (prev, cur) {
        applyStyle(cur.element, cur.style);
      });
      makeCompareStructure(lines, nextLines, lineArea, function (_, i) {
        return i;
      }, function (prev, cur) {
        applyStyle(cur.element, cur.style);
      });
      var keyframesContainers = this.structures.keyframesContainers;
      keyframesContainers.forEach(function (keyframesContainer) {
        var children = keyframesContainer.children;
        updateKeyframesStructure(children, maxTime);
        children.forEach(function (structure) {
          applyStyle(structure.element, structure.style);
        });
      });
      this.moveCursor(this.scene.getTime());

      if (currentMaxTime && currentMaxTime < maxTime) {
        this.axes.setTo({
          zoom: this.axes.get(["zoom"]).zoom * maxTime / currentMaxTime
        });
      }
    };

    __proto.updateKeyframes = function (names, properties, index) {
      var keyframesContainer = this.structures.keyframesContainers[index];
      var keyframes = keyframesContainer.children;
      var length = properties.length;
      var scene = this.scene;
      var item = getSceneItem(scene, names);
      var times = item.times.filter(function (time) {
        var _a;

        return length ? (_a = item.getFrame(time)).has.apply(_a, properties) : true;
      });
      var delay = item.getDelay();
      var nextKeyframes = getKeyframesStructure(times.map(function (time) {
        var _a;

        return [delay + time, (_a = item.getFrame(time)).get.apply(_a, properties)];
      }), this.maxTime);
      makeCompareStructure(keyframes, nextKeyframes, keyframesContainer, function (_a) {
        var dataset = _a.dataset;
        return dataset.time;
      });

      if (length) {
        var nextProperties = properties.slice(0, -1);
        var nextProperty = names.concat(nextProperties).join("///");
        var nextIndex = this.propertiesNames.indexOf(nextProperty);

        if (nextIndex !== -1) {
          this.updateKeyframes(names, nextProperties, nextIndex);
          return;
        }
      }

      scene.setTime(scene.getTime());
    };

    __proto.editKeyframe = function (time, value, index, isForce) {
      var valuesStructure = this.structures.values;
      var isObjectData = this.structures.properties[index].dataset.object === "1";

      if (isObjectData) {
        return;
      }

      var property = valuesStructure[index].dataset.property;
      var scene = this.scene;

      var _a = splitProperty(scene, property),
          names = _a.names,
          properties = _a.properties,
          item = _a.item;

      if (!isForce) {
        var prevValue = item.getNowValue(time, properties);

        if ("" + prevValue === value) {
          return;
        }
      }

      item.set.apply(item, [time].concat(properties, [value]));
      scene.setTime(time);
      this.updateKeyframes(names, properties, index);
    };

    __proto.edit = function (target, value, isForce) {
      var parentEl = getTarget(target, function (el) {
        return hasClass(el, "value");
      });

      if (!parentEl) {
        return;
      }

      var values = this.elements.values;
      var index = values.indexOf(parentEl);

      if (index === -1) {
        return;
      }

      this.editKeyframe(this.scene.getTime(), value, index, isForce);
    };

    __proto.editor = function () {
      var _this = this;

      var valuesArea = this.elements.valuesArea;
      valuesArea.addEventListener("keyup", function (e) {
        if (e.keyCode !== 13) {
          return;
        }

        var target = e.target;

        _this.edit(target, target.value, true);
      });
      valuesArea.addEventListener("focusout", function (e) {
        var target = e.target;

        _this.edit(target, target.value);
      });
    };

    return Timeline;
  }();

  return Timeline;

}));
//# sourceMappingURL=timeline.js.map
