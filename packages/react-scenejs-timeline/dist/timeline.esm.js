/*
Copyright (c) 2019 Daybrush
name: react-scenejs-timeline
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/scenejs-timeline.git
version: 0.1.4
*/
import { PureComponent, createElement, Component } from 'react';
import { hasClass as hasClass$1, isObject, findIndex, addEvent, isUndefined, now, find } from '@daybrush/utils';
import { findDOMNode } from 'react-dom';
import KeyController from 'keycon';
import { drag } from '@daybrush/drag';
import Axes, { PinchInput } from '@egjs/axes';

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
function __rest(s, e) {
  var t = {};

  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
  return t;
}

var PREFIX = "scenejs-editor-";
var SUPPORT_POINTER_EVENTS = "PointerEvent" in window || "MSPointerEvent" in window;
var SUPPORT_TOUCH = "ontouchstart" in window;
var CSS2 = "\n.item-info {\n    position: fixed;\n    right: 0;\n    top: 0;\n    width: 200px;\n    background: #000;\n}\n.options-area {\n\n}\n.option-area {\n    position: relative;\n    border-bottom: 1px solid #777;\n    box-sizing: border-box;\n    white-space: nowrap;\n    background: rgba(90, 90, 90, 0.7);\n    font-size: 13px;\n    font-weight: bold;\n    color: #eee;\n    display: flex;\n}\n.option-name, .option-value {\n    width: 50%;\n    height: 30px;\n    line-height: 20px;\n    box-sizing: border-box;\n    padding: 5px;\n}\n.option-name {\n    border-right: 1px solid #999;\n}\n.option-value input {\n    appearance: none;\n    -webkit-appearance: none;\n    outline: none;\n    position: relative;\n    display: block;\n    width: 100%;\n    height: 100%;\n    background: transparent;\n    color: #4af;\n    font-weight: bold;\n    background: none;\n    border: 0;\n    box-sizing: border-box;\n}\n".replace(/\.([^{,\s\d.]+)/g, "." + PREFIX + "$1");
var CSS = "\n.timeline * {\n    box-sizing: border-box;\n}\n.timeline {\n  position: fixed;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  width: 100%;\n  font-size: 0;\n  background: #000;\n  display: flex;\n  flex-direction: column;\n}\n.header-area, .scroll-area {\n   width: 100%;\n   position: relative;\n  display: flex;\n  -webkit-align-items: flex-start;\n  align-items: flex-start;\n}\n.header-area {\n  position: relative;\n  z-index: 10;\n  top: 0;\n  height: 30px;\n  min-height: 30px;\n}\n.header-area .keyframes {\n  padding: 0px;\n}\n.header-area .properties-area,\n.header-area .keyframes-area,\n.header-area .values-area,\n.header-area .keyframes-scroll-area {\n    height: 100%;\n}\n.header-area .keyframes-scroll-area {\n    overflow: hidden;\n}\n.header-area .property, .header-area .value, .header-area .keyframes {\n  height: 100%;\n}\n.header-area .property {\n    line-height: 30px;\n}\n.value .add {\n    text-align: center;\n    color: #fff;\n    line-height: 30px;\n    font-weight: bold;\n    font-size: 20px;\n    cursor: pointer;\n}\n.header-area .keyframes-area::-webkit-scrollbar {\n    display: none; // Safari and Chrome\n}\n.header-area .keyframe-cursor {\n    position: absolute;\n    border-top: 10px solid #4af;\n    border-left: 6px solid transparent;\n    border-right: 6px solid transparent;\n    width: 0;\n    height: 0;\n    bottom: 0;\n    top: auto;\n    background: none;\n    cursor: pointer;\n}\n.control-area .keyframes {\n    padding-left: 10px;\n}\n.play-control-area {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n}\n.play-control-area .control {\n    position: relative;\n    display: inline-block;\n    vertical-align: middle;\n    color: white;\n    margin: 0px 15px;\n    cursor: pointer;\n}\n.play {\n    border-left: 14px solid white;\n    border-top: 8px solid transparent;\n    border-bottom: 8px solid transparent;\n}\n.pause {\n    border-left: 4px solid #fff;\n    border-right: 4px solid #fff;\n    width: 14px;\n    height: 16px;\n}\n.prev {\n    border-right: 10px solid white;\n    border-top: 6px solid transparent;\n    border-bottom: 6px solid transparent;\n}\n.prev:before {\n    position: absolute;\n    content: \"\";\n    width: 3px;\n    height: 10px;\n    top: 0;\n    right: 100%;\n    transform: translate(0, -50%);\n    background: white;\n}\n.next {\n    border-left: 10px solid white;\n    border-top: 6px solid transparent;\n    border-bottom: 6px solid transparent;\n}\n.next:before {\n    position: absolute;\n    content: \"\";\n    width: 3px;\n    height: 10px;\n    top: 0;\n    transform: translate(0, -50%);\n    background: white;\n}\n.keytime {\n  position: relative;\n  display: inline-block;\n  height: 100%;\n  font-size: 13px;\n  font-weight: bold;\n  color: #777;\n}\n.keytime:last-child {\n  max-width: 0px;\n}\n.keytime span {\n  position: absolute;\n  line-height: 1;\n  bottom: 12px;\n  display: inline-block;\n  transform: translate(-50%);\n  color: #eee;\n}\n.keytime .graduation {\n  position: absolute;\n  bottom: 0;\n  width: 1px;\n  height: 10px;\n  background: #777;\n  transform: translate(-50%);\n}\n.keytime .graduation.half {\n  left: 50%;\n  height: 7px;\n}\n.keytime .graduation.quarter {\n  left: 25%;\n  height: 5px;\n}\n.keytime .graduation.quarter3 {\n  left: 75%;\n  height: 5px;\n}\n.scroll-area {\n  position: relative;\n  width: 100%;\n  height: calc(100% - 60px);\n  overflow: auto;\n}\n.properties-area, .keyframes-area, .values-area {\n  display: inline-block;\n  position: relative;\n  font-size: 16px;\n  overflow: auto;\n}\n\n.properties-area::-webkit-scrollbar, .keyframes-area::-webkit-scrollbar {\n    display: none; // Safari and Chrome\n}\n.properties-area {\n  width: 30%;\n  max-width: 200px;\n  box-sizing: border-box;\n}\n.values-area {\n    width: 50px;\n    min-width: 50px;\n    display: inline-block;\n    border-right: 1px solid #999;\n    box-sizing: border-box;\n}\n.value input {\n    appearance: none;\n    -webkit-appearance: none;\n    outline: none;\n    position: relative;\n    display: block;\n    width: 100%;\n    height: 100%;\n    background: transparent;\n    color: #4af;\n    font-weight: bold;\n    background: none;\n    border: 0;\n    box-sizing: border-box;\n    text-align: center;\n}\n.value {\n\n}\n.alt .value input {\n    cursor: ew-resize;\n}\n.value[data-object=\"1\"] input {\n    display: none;\n}\n.properties-scroll-area {\n  display: inline-block;\n  min-width: 100%;\n}\n.keyframes-area {\n  flex: 1;\n}\n.keyframes-scroll-area {\n  position: relative;\n  min-width: 300px;\n}\n.keyframes, .property, .value {\n  position: relative;\n  height: 30px;\n  line-height: 30px;\n  border-bottom: 1px solid #777;\n  box-sizing: border-box;\n  white-space: nowrap;\n  background: rgba(90, 90, 90, 0.7);\n  z-index: 1;\n}\n\n.property {\n  padding-left: 10px;\n  box-sizing: border-box;\n  font-size: 13px;\n  font-weight: bold;\n  color: #eee;\n}\n.property .remove {\n    position: absolute;\n    display: inline-block;\n    cursor: pointer;\n    width: 18px;\n    height: 18px;\n    top: 0;\n    bottom: 0;\n    right: 10px;\n    margin: auto;\n    border-radius: 50%;\n    border: 2px solid #fff;\n    vertical-align: middle;\n    display: none;\n    margin-left: 10px;\n    box-sizing: border-box;\n}\n.property .remove:before, .property .remove:after {\n    position: absolute;\n    content: \"\";\n    width: 8px;\n    height: 2px;\n    border-radius: 1px;\n    background: #fff;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    margin: auto;\n}\n.property .remove:before {\n    transform: rotate(45deg);\n}\n.property .remove:after {\n    transform: rotate(-45deg);\n}\n.property:hover .remove {\n    display: inline-block;\n}\n\n[data-item=\"1\"], [data-item=\"1\"] .add {\n    height: 30px;\n    line-height: 30px;\n}\n.time-area {\n    position: absolute;\n    top: 0;\n    left: 10px;\n    font-size: 13px;\n    color: #4af;\n    line-height: 30px;\n    font-weight: bold;\n    height: 100%;\n    line-height: 30px;\n    border: 0;\n    background: transparent;\n    outline: 0;\n}\n.time-area:after {\n    content: \"s\";\n}\n.property .arrow {\n    position: relative;\n    display: inline-block;\n    width: 20px;\n    height: 25px;\n    cursor: pointer;\n    vertical-align: middle;\n}\n.property .arrow:after {\n    content: \"\";\n    position: absolute;\n    top: 0;\n    right: 0;\n    left: 0;\n    bottom: 0;\n    margin: auto;\n    width: 0;\n    height: 0;\n    border-top: 6px solid #eee;\n    border-left: 4px solid transparent;\n    border-right: 4px solid transparent;\n}\n.property[data-fold=\"1\"] .arrow:after {\n    border-top: 4px solid transparent;\n    border-bottom: 4px solid transparent;\n    border-right: 0;\n    border-left: 6px solid #eee;\n}\n.property[data-object=\"0\"] .arrow {\n    display: none;\n}\n.property.fold, .keyframes.fold, .value.fold {\n    display: none;\n}\n.property.select, .value.select, .keyframes.select {\n    background: rgba(120, 120, 120, 0.7);\n}\n.keyframes {\n\n}\n.keyframe-delay {\n  position: absolute;\n  top: 3px;\n  bottom: 3px;\n  left: 0;\n  background: #4af;\n  opacity: 0.2;\n  z-index: 0;\n}\n.keyframe-group {\n    position: absolute;\n    top: 3px;\n    bottom: 3px;\n    left: 0;\n    background: #4af;\n    opacity: 0.6;\n    border: 1px solid rgba(0, 0, 0, 0.2);\n    border-left-color: rgba(255, 255, 255, 0.2);\n    border-top-color: rgba(255, 255, 255, 0.2);\n    z-index: 0;\n}\n.keyframe-line {\n  position: absolute;\n  height: 8px;\n  top: 0;\n  bottom: 0;\n  margin: auto;\n  background: #666;\n  z-index: 0;\n}\n.keyframe {\n  position: absolute;\n  font-size: 0px;\n  width: 12px;\n  height: 12px;\n  top: 0px;\n  bottom: 0px;\n  margin: auto;\n  background: #fff;\n  border: 2px solid #383838;\n  border-radius: 2px;\n  box-sizing: border-box;\n  transform: translate(-50%) rotate(45deg);\n  z-index: 1;\n  cursor: pointer;\n}\n.keyframe[data-no=\"1\"] {\n    opacity: 0.2;\n}\n.select .keyframe {\n    border-color: #555;\n}\n.keyframe.select {\n    background: #4af;\n}\n.keyframes-container, .line-area {\n  position: relative;\n  width: calc(100% - 30px);\n  left: 15px;\n  height: 100%;\n}\n.line-area {\n  position: absolute;\n  top: 0;\n  z-index: 0;\n}\n.keyframe-cursor {\n  position: absolute;\n  top: 0;\n  z-index: 1;\n  background: #4af;\n  width: 1px;\n  height: 100%;\n  left: 15px;\n  transform: translate(-50%);\n}\n.scroll-aare .keyframe-cursor {\n  pointer-events: none;\n}\n.division-line {\n  position: absolute;\n  background: #333;\n  width: 1px;\n  height: 100%;\n  transform: translate(-50%);\n}\n".replace(/\.([^{,\s\d.]+)/g, "." + PREFIX + "$1");
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
function keys(value) {
  var arr = [];

  for (var name in value) {
    arr.push(name);
  }

  return arr;
}
function toValue(value) {
  if (isObject(value)) {
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
  return hasClass$1(target, "" + PREFIX + className);
}
function isScene(value) {
  return !!value.constructor.prototype.getItem;
}
function isFrame(value) {
  return !!value.constructor.prototype.toCSS;
}
function findElementIndexByPosition(elements, pos) {
  return findIndex(elements, function (el) {
    var box = el.getBoundingClientRect();
    var top = box.top;
    var bottom = top + box.height;
    return top <= pos && pos < bottom;
  });
}
function prefix(className) {
  return className.split(" ").map(function (name) {
    return "" + PREFIX + name;
  }).join(" ");
}
function ref(target, name) {
  return function (e) {
    e && (target[name] = e);
  };
}
function refs(target, name, i) {
  return function (e) {
    e && (target[name][i] = e);
  };
}
function checkFolded(foldedInfo, names) {
  var index = findIndex(names, function (name, i) {
    return foldedInfo[names.slice(0, i + 1).join("///") + "///"];
  });

  if (index > -1) {
    if (index === names.length - 1) {
      return 2;
    }

    return 1;
  } else {
    return 0;
  }
}
function fold(target, foldedProperty, isNotUpdate) {
  var id = foldedProperty + "///";
  var foldedInfo = target.state.foldedInfo;
  foldedInfo[id] = !foldedInfo[id]; // console.log(foldedInfo);

  if (!isNotUpdate) {
    target.setState({
      foldedInfo: __assign({}, foldedInfo)
    });
  }
}

var ElementComponent =
/*#__PURE__*/
function (_super) {
  __extends(ElementComponent, _super);

  function ElementComponent() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  var __proto = ElementComponent.prototype;

  __proto.getElement = function () {
    return this.element || (this.element = findDOMNode(this));
  };

  return ElementComponent;
}(PureComponent);

var TimeArea =
/*#__PURE__*/
function (_super) {
  __extends(TimeArea, _super);

  function TimeArea() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  var __proto = TimeArea.prototype;

  __proto.render = function () {
    return createElement("input", {
      className: prefix("time-area")
    });
  };

  __proto.componentDidMount = function () {
    var _this = this;

    new KeyController(this.getElement()).keydown(function (e) {
      !e.isToggle && e.inputEvent.stopPropagation();
    }).keyup(function (e) {
      !e.isToggle && e.inputEvent.stopPropagation();
    }).keyup("enter", function (e) {
      // go to time
      var value = _this.getElement().value;

      var result = /(\d+):(\d+):(\d+)/g.exec(value);

      if (!result) {
        return;
      }

      var minute = parseFloat(result[1]);
      var second = parseFloat(result[2]);
      var milisecond = parseFloat("0." + result[3]);
      var time = minute * 60 + second + milisecond;

      _this.props.setTime(time);
    });
  };

  return TimeArea;
}(ElementComponent);

var ControlArea =
/*#__PURE__*/
function (_super) {
  __extends(ControlArea, _super);

  function ControlArea() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.state = {
      isPlay: false
    };

    _this.play = function () {
      _this.setState({
        isPlay: true
      });
    };

    _this.pause = function () {
      _this.setState({
        isPlay: false
      });
    };

    _this.unselect = function () {
      _this.props.select("", -1);
    };

    return _this;
  }

  var __proto = ControlArea.prototype;

  __proto.render = function () {
    return createElement("div", {
      className: prefix("control-area header-area")
    }, createElement("div", {
      className: prefix("properties-area"),
      onClick: this.unselect
    }, createElement("div", {
      className: prefix("property")
    })), createElement("div", {
      className: prefix("values-area")
    }, createElement("div", {
      className: prefix("value")
    })), createElement("div", {
      className: prefix("keyframes-area")
    }, createElement("div", {
      className: prefix("keyframes")
    }, createElement(TimeArea, {
      ref: ref(this, "timeArea"),
      setTime: this.props.setTime
    }), createElement("div", {
      className: prefix("play-control-area")
    }, createElement("div", {
      className: prefix("control prev"),
      onClick: this.props.prev
    }), createElement("div", {
      className: prefix("control " + (this.state.isPlay ? "pause" : "play")),
      onClick: this.props.togglePlay
    }), createElement("div", {
      className: prefix("control next"),
      onClick: this.props.next
    })))));
  };

  __proto.componentDidMount = function () {
    this.initScene(this.props.scene);
  };

  __proto.componentDidUpdate = function (prevProps) {
    if (prevProps.scene !== this.props.scene) {
      this.initScene(this.props.scene);
      this.releaseScene(prevProps.scene);
    }
  };

  __proto.componentWillUnmount = function () {
    this.releaseScene(this.props.scene);
  };

  __proto.initScene = function (scene) {
    if (!scene) {
      return;
    }

    scene.on({
      play: this.play,
      paused: this.pause
    });
  };

  __proto.releaseScene = function (scene) {
    if (!scene) {
      return;
    }

    scene.off("play", this.play);
    scene.off("paused", this.pause);
  };

  return ControlArea;
}(ElementComponent);

var KeyframeCursor =
/*#__PURE__*/
function (_super) {
  __extends(KeyframeCursor, _super);

  function KeyframeCursor() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  var __proto = KeyframeCursor.prototype;

  __proto.render = function () {
    return createElement("div", {
      className: prefix("keyframe-cursor"),
      ref: ref(this, "cursor")
    });
  };

  return KeyframeCursor;
}(ElementComponent);

var KeytimesArea =
/*#__PURE__*/
function (_super) {
  __extends(KeytimesArea, _super);

  function KeytimesArea() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  var __proto = KeytimesArea.prototype;

  __proto.renderKeytimes = function () {
    var maxTime = this.props.maxTime;
    var keytimes = [];

    for (var time = 0; time <= maxTime; ++time) {
      keytimes.push(createElement("div", {
        key: time,
        "data-time": time,
        className: prefix("keytime"),
        style: {
          width: 100 / maxTime + "%"
        }
      }, createElement("span", null, time), createElement("div", {
        className: prefix("graduation start")
      }), createElement("div", {
        className: prefix("graduation quarter")
      }), createElement("div", {
        className: prefix("graduation half")
      }), createElement("div", {
        className: prefix("graduation quarter3")
      })));
    }

    return keytimes;
  };

  __proto.render = function () {
    var _a = this.props,
        maxTime = _a.maxTime,
        maxDuration = _a.maxDuration,
        zoom = _a.zoom;
    return createElement("div", {
      className: prefix("keytimes-area keyframes-area")
    }, createElement("div", {
      className: prefix("keyframes-scroll-area"),
      ref: ref(this, "scrollAreaElement"),
      style: {
        minWidth: 50 * maxTime + "px",
        width: Math.min(maxDuration ? maxTime / maxDuration : 1, 2) * zoom * 100 + "%"
      }
    }, createElement("div", {
      className: prefix("keytimes keyframes")
    }, createElement("div", {
      className: prefix("keyframes-container")
    }, this.renderKeytimes()), createElement(KeyframeCursor, {
      ref: ref(this, "cursor")
    }))));
  };

  __proto.componentDidMount = function () {
    var _this = this;

    addEvent(this.getElement(), "wheel", function (e) {
      var delta = e.deltaY;

      _this.props.axes.setBy({
        zoom: delta / 5000
      });

      !e.deltaX && e.preventDefault();
    });
    drag(this.cursor.getElement(), {
      dragstart: function (_a) {
        var inputEvent = _a.inputEvent;
        inputEvent.stopPropagation();
      },
      drag: function (_a) {
        var clientX = _a.clientX;

        _this.props.move(clientX);
      },
      container: window
    });
  };

  return KeytimesArea;
}(ElementComponent);

var HeaderArea =
/*#__PURE__*/
function (_super) {
  __extends(HeaderArea, _super);

  function HeaderArea() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.add = function () {
      if (_this.props.scene) {
        return;
      }

      _this.props.add();
    };

    return _this;
  }

  var __proto = HeaderArea.prototype;

  __proto.render = function () {
    var _a = this.props,
        axes = _a.axes,
        timelineInfo = _a.timelineInfo,
        maxTime = _a.maxTime,
        maxDuration = _a.maxDuration,
        zoom = _a.zoom,
        move = _a.move;
    return createElement("div", {
      className: prefix("header-area")
    }, createElement("div", {
      className: prefix("properties-area")
    }, createElement("div", {
      className: prefix("property")
    }, "Name")), createElement("div", {
      className: prefix("values-area")
    }, createElement("div", {
      className: prefix("value")
    }, createElement("div", {
      className: prefix("add"),
      onClick: this.add
    }, "+"))), createElement(KeytimesArea, {
      ref: ref(this, "keytimesArea"),
      move: move,
      axes: axes,
      timelineInfo: timelineInfo,
      maxDuration: maxDuration,
      maxTime: maxTime,
      zoom: zoom
    }));
  };

  return HeaderArea;
}(ElementComponent);

var Keyframe =
/*#__PURE__*/
function (_super) {
  __extends(Keyframe, _super);

  function Keyframe() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  var __proto = Keyframe.prototype;

  __proto.render = function () {
    var _a = this.props,
        time = _a.time,
        value = _a.value,
        maxTime = _a.maxTime,
        selected = _a.selected;
    return createElement("div", {
      className: prefix("keyframe" + (selected ? " select" : "")),
      "data-time": time,
      style: {
        left: time / maxTime * 100 + "%"
      }
    }, time, " ", value);
  };

  return Keyframe;
}(ElementComponent);

var KeyframeGroup =
/*#__PURE__*/
function (_super) {
  __extends(KeyframeGroup, _super);

  function KeyframeGroup() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  var __proto = KeyframeGroup.prototype;

  __proto.render = function () {
    var _a = this.props,
        time = _a.time,
        nextTime = _a.nextTime,
        maxTime = _a.maxTime,
        selected = _a.selected;
    return createElement("div", {
      className: prefix("keyframe-group" + (selected ? " select" : "")),
      "data-time": time,
      style: {
        left: time / maxTime * 100 + "%",
        width: (nextTime - time) / maxTime * 100 + "%"
      }
    });
  };

  return KeyframeGroup;
}(Component);

var KeyframeDelay =
/*#__PURE__*/
function (_super) {
  __extends(KeyframeDelay, _super);

  function KeyframeDelay() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  var __proto = KeyframeDelay.prototype;

  __proto.render = function () {
    var _a = this.props,
        time = _a.time,
        nextTime = _a.nextTime,
        maxTime = _a.maxTime;
    return createElement("div", {
      className: prefix("keyframe-delay"),
      style: {
        left: time / maxTime * 100 + "%",
        width: (nextTime - time) / maxTime * 100 + "%"
      }
    });
  };

  return KeyframeDelay;
}(Component);

var KeyframeLine =
/*#__PURE__*/
function (_super) {
  __extends(KeyframeLine, _super);

  function KeyframeLine() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  var __proto = KeyframeLine.prototype;

  __proto.render = function () {
    var _a = this.props,
        time = _a.time,
        nextTime = _a.nextTime,
        maxTime = _a.maxTime;
    return createElement("div", {
      className: prefix("keyframe-line"),
      style: {
        left: time / maxTime * 100 + "%",
        width: (nextTime - time) / maxTime * 100 + "%"
      }
    });
  };

  return KeyframeLine;
}(Component);

var Keyframes =
/*#__PURE__*/
function (_super) {
  __extends(Keyframes, _super);

  function Keyframes() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  var __proto = Keyframes.prototype;

  __proto.render = function () {
    var _a = this.props,
        id = _a.id,
        propertiesInfo = _a.propertiesInfo,
        selected = _a.selected,
        folded = _a.folded;
    return createElement("div", {
      className: prefix("keyframes" + (folded === 1 ? " fold" : "") + (selected ? " select" : "")),
      "data-item": propertiesInfo.isItem ? "1" : "0",
      "data-id": id
    }, createElement("div", {
      className: prefix("keyframes-container")
    }, this.renderList()));
  };

  __proto.renderList = function () {
    var _a = this.props,
        propertiesInfo = _a.propertiesInfo,
        maxTime = _a.maxTime,
        selected = _a.selected,
        selectedTime = _a.selectedTime;
    var item = propertiesInfo.item,
        frames = propertiesInfo.frames,
        properties = propertiesInfo.properties;
    var isItScene = isScene(item);
    var duration = item.getDuration();
    var keyframes = [];
    var keyframeGroups = [];
    var keyframeDelays = [];
    var keyframeLines = [];
    var length = frames.length;
    var hasProperties = properties.length;
    var startIndex = 0;

    if (length >= 2 && !hasProperties) {
      var index = findIndex(frames, function (_a) {
        var value = _a[2];
        return !isUndefined(value);
      });
      startIndex = Math.min(length - 2, Math.max(frames[0][1] === 0 && frames[1][1] === 0 ? 1 : 0, index));
      var startFrame = frames[startIndex];
      var endFrame = frames[length - 1];
      var time = startFrame[0];
      var nextTime = endFrame[0];
      keyframeGroups.push(createElement(KeyframeGroup, {
        key: "group",
        id: time + "," + nextTime,
        selected: selected && time <= selectedTime && selectedTime <= nextTime,
        time: time,
        nextTime: nextTime,
        maxTime: maxTime
      }));
    }

    frames.forEach(function (_a, i) {
      var time = _a[0],
          iterationTime = _a[1],
          value = _a[2];
      var valueText = toValue(value);

      if (frames[i + 1]) {
        var _b = frames[i + 1],
            nextTime = _b[0],
            nextIterationTime = _b[1];

        if (iterationTime === 0 && nextIterationTime === 0 || iterationTime === duration && nextIterationTime === duration) {
          keyframeDelays.push(createElement(KeyframeDelay, {
            key: "delay" + time + "," + nextTime,
            id: "-1",
            time: time,
            nextTime: nextTime,
            maxTime: maxTime
          }));
        }
      }

      if (i === 0 && time === 0 && iterationTime === 0 && isUndefined(value) && !hasProperties) {
        return;
      }

      if (frames[i + 1]) {
        var _c = frames[i + 1],
            nextTime = _c[0],
            nextValue = _c[2];
        var nextValueText = toValue(nextValue);

        if (!isItScene && !isUndefined(value) && !isUndefined(nextValue) && valueText !== nextValueText && hasProperties) {
          keyframeLines.push(createElement(KeyframeLine, {
            key: "line" + keyframeLines.length,
            time: time,
            id: time + "," + nextTime,
            nextTime: nextTime,
            maxTime: maxTime
          }));
        }
      }

      if (isItScene || i < startIndex) {
        return;
      }

      keyframes.push(createElement(Keyframe, {
        key: "keyframe" + i,
        id: "" + time,
        selected: selected && time === selectedTime,
        time: time,
        iterationTime: iterationTime,
        value: valueText,
        maxTime: maxTime
      }));
    });
    return keyframeGroups.concat(keyframes, keyframeDelays, keyframeLines);
  };

  return Keyframes;
}(ElementComponent);

var LineArea = (function (_a) {
  var maxTime = _a.maxTime;
  var lines = [];

  for (var time = 0; time <= maxTime; ++time) {
    lines.push(createElement("div", {
      className: prefix("division-line"),
      key: time,
      style: {
        left: 100 / maxTime * time + "%"
      }
    }));
  }

  return createElement("div", {
    className: prefix("line-area")
  }, lines);
});

var KeyframesArea =
/*#__PURE__*/
function (_super) {
  __extends(KeyframesArea, _super);

  function KeyframesArea() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.keyframesList = [];
    _this.state = {
      foldedInfo: {}
    };
    return _this;
  }

  var __proto = KeyframesArea.prototype;

  __proto.render = function () {
    var _a = this.props,
        timelineInfo = _a.timelineInfo,
        maxTime = _a.maxTime,
        maxDuration = _a.maxDuration,
        zoom = _a.zoom,
        selectedProperty = _a.selectedProperty,
        selectedTime = _a.selectedTime;
    var foldedInfo = this.state.foldedInfo;
    var width = Math.min(maxDuration ? maxTime / maxDuration : 1, 2);
    var keyframesList = [];
    this.keyframesList = [];

    for (var key in timelineInfo) {
      var propertiesInfo = timelineInfo[key];
      var selected = key === selectedProperty;
      var folded = checkFolded(foldedInfo, propertiesInfo.keys);
      keyframesList.push(createElement(Keyframes, {
        ref: refs(this, "keyframesList", keyframesList.length),
        selected: selected,
        folded: folded,
        selectedTime: selectedTime,
        key: key,
        id: key,
        propertiesInfo: propertiesInfo,
        maxTime: maxTime
      }));
    }

    return createElement("div", {
      className: prefix("keyframes-area")
    }, createElement("div", {
      className: prefix("keyframes-scroll-area"),
      ref: ref(this, "scrollAreaElement"),
      style: {
        minWidth: 50 * maxTime + "px",
        width: width * zoom * 100 + "%"
      }
    }, keyframesList.concat([createElement(KeyframeCursor, {
      key: "cursor",
      ref: ref(this, "cursor")
    }), createElement(LineArea, {
      maxTime: maxTime,
      key: "lines"
    })])));
  };

  __proto.componentDidMount = function () {
    var _this = this;

    addEvent(this.getElement(), "wheel", function (e) {
      if (!_this.props.keycon.altKey) {
        return;
      }

      e.preventDefault();
      var delta = e.deltaY;

      _this.props.axes.setBy({
        zoom: delta / 5000
      });
    });
  };

  return KeyframesArea;
}(ElementComponent);

var Property =
/*#__PURE__*/
function (_super) {
  __extends(Property, _super);

  function Property() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  var __proto = Property.prototype;

  __proto.render = function () {
    var _a = this.props,
        id = _a.id,
        selected = _a.selected,
        folded = _a.folded,
        _b = _a.propertiesInfo,
        propertyNames = _b.keys,
        isItem = _b.isItem,
        isParent = _b.isParent;
    var length = propertyNames.length;
    var name = propertyNames[length - 1];
    return createElement("div", {
      className: prefix("property" + (folded === 1 ? " fold" : "") + (selected ? " select" : "")),
      "data-id": id,
      "data-name": name,
      "data-object": isParent ? 1 : 0,
      "data-item": isItem ? 1 : 0,
      "data-fold": folded === 2 ? 1 : 0,
      style: {
        paddingLeft: 10 + (length - 1) * 20 + "px"
      }
    }, createElement("div", {
      className: prefix("arrow")
    }), createElement("span", null, name), createElement("div", {
      className: prefix("remove")
    }));
  };

  return Property;
}(ElementComponent);

var PropertiesArea =
/*#__PURE__*/
function (_super) {
  __extends(PropertiesArea, _super);

  function PropertiesArea() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.properties = [];
    _this.state = {
      foldedInfo: {}
    };
    return _this;
  }

  var __proto = PropertiesArea.prototype;

  __proto.render = function () {
    var _a = this.props,
        timelineInfo = _a.timelineInfo,
        selectedProperty = _a.selectedProperty;
    var foldedInfo = this.state.foldedInfo;
    var properties = [];
    this.properties = [];

    for (var id in timelineInfo) {
      var propertiesInfo = timelineInfo[id];
      var selected = selectedProperty === id;
      var folded = checkFolded(foldedInfo, propertiesInfo.keys);
      properties.push(createElement(Property, {
        ref: refs(this, "properties", properties.length),
        selected: selected,
        folded: folded,
        key: id,
        id: id,
        propertiesInfo: propertiesInfo
      }));
    }

    return createElement("div", {
      className: prefix("properties-area")
    }, createElement("div", {
      className: prefix("properties-scroll-area")
    }, properties));
  };

  return PropertiesArea;
}(ElementComponent);

var Value =
/*#__PURE__*/
function (_super) {
  __extends(Value, _super);

  function Value() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.add = function () {
      var _a = _this.props,
          add = _a.add,
          _b = _a.propertiesInfo,
          item = _b.item,
          properties = _b.properties;
      add(item, properties);
    };

    return _this;
  }

  var __proto = Value.prototype;

  __proto.render = function () {
    var _a = this.props,
        id = _a.id,
        selected = _a.selected,
        folded = _a.folded,
        _b = _a.propertiesInfo,
        isItem = _b.isItem,
        isParent = _b.isParent;
    return createElement("div", {
      className: prefix("value" + (folded === 1 ? " fold" : "") + (selected ? " select" : "")),
      "data-id": id,
      "data-object": isParent ? 1 : 0,
      "data-item": isItem ? 1 : 0
    }, this.renderValue());
  };

  __proto.renderValue = function () {
    var isParent = this.props.propertiesInfo.isParent;

    if (isParent) {
      return createElement("div", {
        className: prefix("add"),
        onClick: this.add
      }, "+");
    } else {
      return createElement("input", {
        ref: ref(this, "inputElement")
      });
    }
  };

  return Value;
}(ElementComponent);

var ValuesArea =
/*#__PURE__*/
function (_super) {
  __extends(ValuesArea, _super);

  function ValuesArea() {
    var _this = _super !== null && _super.apply(this, arguments) || this;

    _this.values = [];
    _this.state = {
      foldedInfo: {}
    };
    return _this;
  }

  var __proto = ValuesArea.prototype;

  __proto.render = function () {
    var _a = this.props,
        timelineInfo = _a.timelineInfo,
        selectedProperty = _a.selectedProperty,
        add = _a.add;
    var foldedInfo = this.state.foldedInfo;
    var values = [];
    this.values = [];

    for (var id in timelineInfo) {
      var propertiesInfo = timelineInfo[id];
      var selected = selectedProperty === id;
      var folded = checkFolded(foldedInfo, propertiesInfo.keys);
      values.push(createElement(Value, {
        ref: refs(this, "values", values.length),
        add: add,
        key: id,
        folded: folded,
        selected: selected,
        id: id,
        propertiesInfo: propertiesInfo
      }));
    }

    return createElement("div", {
      className: prefix("values-area")
    }, values);
  };

  __proto.componentDidMount = function () {
    var _this = this;

    var element = this.getElement();
    var dragTarget;
    var dragTargetValue;
    element.addEventListener("focusout", function (e) {
      _this.props.setTime();
    });
    drag(element, {
      container: window,
      dragstart: function (e) {
        dragTarget = e.inputEvent.target;
        dragTargetValue = dragTarget.value;

        if (!_this.props.keycon.altKey || !getTarget(dragTarget, function (el) {
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
    new KeyController(element).keydown(function (e) {
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
  };

  __proto.edit = function (target, value) {
    var parentEl = getTarget(target, function (el) {
      return hasClass(el, "value");
    });

    if (!parentEl) {
      return;
    }

    console.log(target, value);
    var index = findIndex(this.values, function (v) {
      return v.getElement() === parentEl;
    });

    if (index === -1) {
      return;
    }

    this.props.editKeyframe(index, value);
  };

  return ValuesArea;
}(ElementComponent);

var ScrollArea =
/*#__PURE__*/
function (_super) {
  __extends(ScrollArea, _super);

  function ScrollArea() {
    return _super !== null && _super.apply(this, arguments) || this;
  }

  var __proto = ScrollArea.prototype;

  __proto.render = function () {
    var _a = this.props,
        axes = _a.axes,
        keycon = _a.keycon,
        zoom = _a.zoom,
        maxDuration = _a.maxDuration,
        maxTime = _a.maxTime,
        timelineInfo = _a.timelineInfo,
        selectedProperty = _a.selectedProperty,
        selectedTime = _a.selectedTime,
        add = _a.add,
        setTime = _a.setTime,
        editKeyframe = _a.editKeyframe;
    return createElement("div", {
      className: prefix("scroll-area")
    }, createElement(PropertiesArea, {
      ref: ref(this, "propertiesArea"),
      timelineInfo: timelineInfo,
      selectedProperty: selectedProperty
    }), createElement(ValuesArea, {
      ref: ref(this, "valuesArea"),
      add: add,
      keycon: keycon,
      setTime: setTime,
      editKeyframe: editKeyframe,
      timelineInfo: timelineInfo,
      selectedProperty: selectedProperty
    }), createElement(KeyframesArea, {
      ref: ref(this, "keyframesArea"),
      axes: axes,
      keycon: keycon,
      zoom: zoom,
      maxDuration: maxDuration,
      timelineInfo: timelineInfo,
      maxTime: maxTime,
      selectedProperty: selectedProperty,
      selectedTime: selectedTime
    }));
  };

  __proto.componentDidMount = function () {
    this.initClickProperty();
    this.foldAll();
  };

  __proto.foldAll = function () {
    var _this = this; // fold all


    this.propertiesArea.properties.forEach(function (property, i) {
      var _a = property.props.propertiesInfo,
          keys = _a.keys,
          isParent = _a.isParent;

      if (keys.length === 1 && isParent) {
        _this.fold(i);
      }
    });
  };

  __proto.fold = function (index, isNotUpdate) {
    var selectedProperty = this.propertiesArea.properties[index];
    var foldedId = selectedProperty.props.id;
    fold(this.propertiesArea, foldedId, isNotUpdate);
    fold(this.valuesArea, foldedId, isNotUpdate);
    fold(this.keyframesArea, foldedId, isNotUpdate);
  };

  __proto.removeProperty = function (propertiesInfo) {
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

    if (this.props.selectedProperty === key) {
      this.props.select("", -1, true);
    }

    this.props.update();
  };

  __proto.initClickProperty = function () {
    var _this = this;

    this.propertiesArea.getElement().addEventListener("click", function (e) {
      var isClickArrow = getTarget(e.target, function (el) {
        return hasClass(el, "arrow");
      });
      var isClickRemove = getTarget(e.target, function (el) {
        return hasClass(el, "remove");
      });
      var target = getTarget(e.target, function (el) {
        return hasClass(el, "property");
      });

      if (!target) {
        return;
      }

      var properties = _this.propertiesArea.properties;

      var index = _this.propertiesArea.properties.map(function (property) {
        return property.getElement();
      }).indexOf(target);

      if (index === -1) {
        return;
      }

      var selectedProperty = properties[index];

      if (isClickRemove) {
        _this.removeProperty(selectedProperty.props.propertiesInfo);
      } else {
        _this.props.select(selectedProperty.props.id);

        if (isClickArrow) {
          _this.fold(index);
        }
      }
    });
  };

  return ScrollArea;
}(ElementComponent);

var prevTime = 0;
var prevX = -1;
var prevY = -1;
function dblCheck(isDrag, e, clientX, clientY, callback) {
  var currentTime = now();

  if (!isDrag) {
    if (prevX === clientX && prevY === clientY && currentTime - prevTime <= 500) {
      callback(e, clientX, clientY);
    }

    prevX = clientX;
    prevY = clientY;
    prevTime = currentTime;
  }
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
    var isParent = isObject(itemNames);
    var isItem = properties.length === 0;
    entries.forEach(function (_a) {
      var time = _a[0],
          iterationTime = _a[1];
      var value = item.get.apply(item, [iterationTime].concat(properties));

      if (isUndefined(value) && properties.length) {
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

  function Timeline(props) {
    var _this = _super.call(this, props) || this;

    _this.state = {
      alt: false,
      zoom: 1,
      maxDuration: 0,
      maxTime: 0,
      timelineInfo: {},
      selectedProperty: "",
      selectedTime: -1,
      init: false
    };
    _this.isExportCSS = false;

    _this.update = function (isInit) {
      if (isInit === void 0) {
        isInit = false;
      }

      var scene = _this.props.scene;

      if (!scene) {
        return;
      }

      var maxDuration = Math.ceil(scene.getDuration());
      var maxTime = Math.max(_this.state.maxTime, maxDuration);
      var currentMaxTime = _this.state.maxTime;

      var zoom = _this.axes.get(["zoom"]).zoom;

      var nextZoomScale = currentMaxTime > 1 ? maxTime / currentMaxTime : 1;
      var nextZoom = Math.max(1, zoom * nextZoomScale);

      _this.setState({
        timelineInfo: getTimelineInfo(scene),
        maxTime: maxTime,
        maxDuration: maxDuration,
        init: isInit
      });

      _this.axes.axm.set({
        zoom: nextZoom
      });
    };

    _this.prev = function () {
      var scene = _this.props.scene;
      scene && _this.setTime(scene.getTime() - 0.05);
    };

    _this.next = function () {
      var scene = _this.props.scene;
      scene && _this.setTime(scene.getTime() + 0.05);
    };

    _this.finish = function () {
      var scene = _this.props.scene;
      scene && scene.finish();
    };

    _this.togglePlay = function () {
      var scene = _this.props.scene;

      if (!scene) {
        return;
      }

      if (scene.getPlayState() === "running") {
        scene.pause();
      } else {
        scene.play();
      }
    };

    _this.add = function (item, properties) {
      if (item === void 0) {
        item = _this.props.scene;
      }

      if (properties === void 0) {
        properties = [];
      }

      if (isScene(item)) {
        _this.newItem(item);
      } else {
        _this.newProperty(item, properties);
      }
    };

    _this.getDistTime = function (distX, rect) {
      if (rect === void 0) {
        rect = _this.scrollArea.keyframesArea.scrollAreaElement.getBoundingClientRect();
      }

      var scrollAreaWidth = rect.width - 30;
      var percentage = Math.min(scrollAreaWidth, distX) / scrollAreaWidth;
      var time = _this.state.maxTime * percentage;
      return Math.round(time * 20) / 20;
    };

    _this.setTime = function (time) {
      var scene = _this.props.scene;

      if (!scene) {
        return;
      }

      var direction = scene.getDirection();
      scene.pause();

      if (isUndefined(time)) {
        time = scene.getTime();
      }

      if (direction === "normal" || direction === "alternate") {
        scene.setTime(time);
      } else {
        scene.setTime(scene.getDuration() - time);
      }
    };

    _this.getTime = function (clientX) {
      var rect = _this.scrollArea.keyframesArea.scrollAreaElement.getBoundingClientRect();

      var scrollAreaX = rect.left + 15;
      var x = Math.max(clientX - scrollAreaX, 0);
      return _this.getDistTime(x, rect);
    };

    _this.move = function (clientX) {
      _this.setTime(_this.getTime(clientX));
    };

    _this.select = function (property, time, isNotUpdate) {
      if (time === void 0) {
        time = -1;
      }

      var scene = _this.props.scene;

      if (!scene) {
        return;
      }

      scene.pause();

      if (isNotUpdate) {
        _this.state.selectedProperty = property;
        _this.state.selectedTime = -1;
      } else {
        _this.setState({
          selectedProperty: property,
          selectedTime: time
        });
      }
    };

    _this.editKeyframe = function (index, value) {
      var propertiesInfo = _this.scrollArea.propertiesArea.properties[index].props.propertiesInfo;
      var isObjectData = propertiesInfo.isParent;

      if (isObjectData) {
        return;
      }

      var item = propertiesInfo.item;
      var properties = propertiesInfo.properties;
      item.set.apply(item, [item.getIterationTime()].concat(properties, [value]));

      _this.update();
    };

    _this.animate = function (e) {
      var time = e.time;
      var minute = numberFormat(Math.floor(time / 60), 2);
      var second = numberFormat(Math.floor(time % 60), 2);
      var milisecond = numberFormat(Math.floor(time % 1 * 100), 3, true);

      _this.moveCursor(time);

      _this.setInputs(flatObject(e.frames || e.frame.get()));

      _this.controlArea.timeArea.getElement().value = minute + ":" + second + ":" + milisecond;
    };

    if (isExportCSS) {
      isExportCSS = true;
      _this.isExportCSS = true;
    }

    _this.state = __assign({}, _this.state, _this.initScene(_this.props.scene));
    _this.keycon = new KeyController().keydown("alt", function () {
      _this.setState({
        alt: true
      });
    }).keyup("alt", function () {
      _this.setState({
        alt: false
      });
    });
    _this.axes = new Axes({
      zoom: {
        range: [1, Infinity]
      }
    }, {}, {
      zoom: 1
    });
    return _this;
  }

  var __proto = Timeline.prototype;

  __proto.render = function () {
    var _a = this.props,
        scene = _a.scene,
        className = _a.className,
        keyboard = _a.keyboard,
        onSelect = _a.onSelect,
        attributes = __rest(_a, ["scene", "className", "keyboard", "onSelect"]);

    var _b = this.state,
        zoom = _b.zoom,
        alt = _b.alt,
        maxDuration = _b.maxDuration,
        maxTime = _b.maxTime,
        timelineInfo = _b.timelineInfo,
        selectedProperty = _b.selectedProperty,
        selectedTime = _b.selectedTime;
    return createElement("div", __assign({
      className: prefix("timeline" + (alt ? " alt" : "")) + (className ? " " + className : "")
    }, attributes), this.renderStyle(), createElement(ControlArea, {
      ref: ref(this, "controlArea"),
      scene: scene,
      select: this.select,
      prev: this.prev,
      next: this.next,
      setTime: this.setTime,
      togglePlay: this.togglePlay
    }), createElement(HeaderArea, {
      ref: ref(this, "headerArea"),
      scene: scene,
      add: this.add,
      axes: this.axes,
      move: this.move,
      maxDuration: maxDuration,
      zoom: zoom,
      maxTime: maxTime,
      timelineInfo: timelineInfo
    }), createElement(ScrollArea, {
      ref: ref(this, "scrollArea"),
      add: this.add,
      setTime: this.setTime,
      editKeyframe: this.editKeyframe,
      keycon: this.keycon,
      axes: this.axes,
      maxDuration: maxDuration,
      zoom: zoom,
      maxTime: maxTime,
      update: this.update,
      select: this.select,
      selectedProperty: selectedProperty,
      selectedTime: selectedTime,
      timelineInfo: timelineInfo
    }));
  };

  __proto.componentDidMount = function () {
    this.initWheelZoom();
    this.initScroll();
    this.initDragKeyframes();
    this.initKeyController();
  };

  __proto.componentDidUpdate = function (prevProps, prevState) {
    if (this.props.onSelect && prevState.selectedProperty !== this.state.selectedProperty) {
      var prevSelectedProperty = prevState.selectedProperty,
          prevSelectedTime = prevState.selectedTime;
      var _a = this.state,
          selectedProperty = _a.selectedProperty,
          selectedTime = _a.selectedTime;
      var selectedItem = this.state.timelineInfo[selectedProperty];
      this.props.onSelect({
        selectedItem: !selectedProperty ? this.props.scene : selectedItem.item,
        selectedProperty: selectedProperty,
        selectedTime: selectedTime,
        prevSelectedProperty: prevSelectedProperty,
        prevSelectedTime: prevSelectedTime
      });
    }

    if (this.state.init) {
      this.state.init = false;
      this.scrollArea.foldAll();
    }

    if (prevProps.scene !== this.props.scene) {
      this.releaseScene(prevProps.scene);
      this.setState(this.initScene(this.props.scene));
    } else {
      this.setTime();
    }
  };

  __proto.renderStyle = function () {
    if (!this.isExportCSS) {
      return createElement("style", null, CSS);
    }
  };

  __proto.newItem = function (scene) {
    var name = prompt("Add Item");

    if (!name) {
      return;
    }

    scene.newItem(name);
    this.update();
  };

  __proto.newProperty = function (item, properties) {
    var property = prompt("Add Property");

    if (!property) {
      return;
    }

    item.set.apply(item, [item.getIterationTime()].concat(properties, [property, ""]));
    this.update();
  };

  __proto.moveCursor = function (time) {
    var maxTime = this.state.maxTime;
    var px = 15 - 30 * time / maxTime;
    var percent = 100 * time / maxTime;
    var left = "calc(" + percent + "% + " + px + "px)";
    this.scrollArea.keyframesArea.cursor.getElement().style.left = left;
    this.headerArea.keytimesArea.cursor.getElement().style.left = left;
  };

  __proto.setInputs = function (obj) {
    var valuesArea = this.scrollArea.valuesArea.getElement();

    for (var name in obj) {
      valuesArea.querySelector("[data-id=\"" + name + "\"] input").value = obj[name];
    }
  };

  __proto.removeKeyframe = function (property) {
    var propertiesInfo = this.state.timelineInfo[property];

    if (!property || !propertiesInfo || isScene(propertiesInfo.item)) {
      return;
    }

    var properties = propertiesInfo.properties;
    var item = propertiesInfo.item;
    item.remove.apply(item, [item.getIterationTime()].concat(properties));
    this.update();
  };

  __proto.addKeyframe = function (index, time) {
    var keyframesList = this.scrollArea.keyframesArea.keyframesList;
    var id = keyframesList[index].props.id;
    this.select(id, time);
    var inputElement = this.scrollArea.valuesArea.values[index].inputElement;

    if (inputElement) {
      this.editKeyframe(index, inputElement.value);
    }
  };

  __proto.initScene = function (scene) {
    if (!scene) {
      return {
        timelineInfo: {},
        maxTime: 0,
        maxDuration: 0,
        zoom: 1,
        init: false
      };
    }

    scene.finish();
    scene.on("animate", this.animate);
    var duration = Math.ceil(scene.getDuration());
    return {
      timelineInfo: getTimelineInfo(scene),
      maxTime: duration,
      maxDuration: duration,
      zoom: 1,
      init: true
    };
  };

  __proto.releaseScene = function (scene) {
    if (!scene) {
      return;
    }

    scene.off("animate", this.animate);
  };

  __proto.initWheelZoom = function () {
    var _this = this;

    var scrollArea = this.scrollArea.getElement();
    var axes = this.axes;

    if (SUPPORT_TOUCH || SUPPORT_POINTER_EVENTS) {
      axes.connect("zoom", new PinchInput(scrollArea, {
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
      if (e.pos.zoom === _this.state.zoom) {
        return;
      }

      _this.setState({
        zoom: e.pos.zoom
      });

      if (e.inputEvent) {
        e.inputEvent.preventDefault();
      }
    });
    this.axes = axes;
  };

  __proto.initScroll = function () {
    var isScrollKeyframe = false;
    var headerKeyframesArea = this.headerArea.keytimesArea.getElement();
    var scrollKeyframesArea = this.scrollArea.keyframesArea.getElement();
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

  __proto.initDragKeyframes = function () {
    var _this = this;

    var click = function (e, clientX, clientY) {
      var target = getTarget(e.target, function (el) {
        return hasClass(el, "keyframe");
      });
      var time = target ? parseFloat(target.getAttribute("data-time") || "") : _this.getTime(clientX);

      _this.setTime(time);

      var list = _this.scrollArea.keyframesArea.keyframesList;
      var index = findElementIndexByPosition(list.map(function (keyframes) {
        return keyframes.getElement();
      }), clientY);

      if (index > -1) {
        _this.select(list[index].props.id, time);
      }

      e.preventDefault();
    };

    var dblclick = function (e, clientX, clientY) {
      var list = _this.scrollArea.keyframesArea.keyframesList;
      var index = findElementIndexByPosition(list.map(function (keyframes) {
        return keyframes.getElement();
      }), clientY);

      if (index === -1) {
        return;
      }

      _this.addKeyframe(index, _this.getTime(clientX));
    };

    var keytimesScrollArea = this.headerArea.keytimesArea.scrollAreaElement;
    var keyframesScrollArea = this.scrollArea.keyframesArea.scrollAreaElement;
    var dragItem;
    var dragDelay = 0;
    var dragTarget;
    [keytimesScrollArea, keyframesScrollArea].forEach(function (element) {
      drag(element, {
        container: window,
        dragstart: function (_a) {
          var inputEvent = _a.inputEvent;
          dragTarget = getTarget(inputEvent.target, function (el) {
            return hasClass(el, "keyframe-group");
          });

          if (dragTarget) {
            var properties = _this.scrollArea.propertiesArea.properties;
            var keyframesElement = getTarget(dragTarget, function (el) {
              return hasClass(el, "keyframes");
            });
            var id_1 = keyframesElement.getAttribute("data-id");
            var property = find(properties, function (p) {
              return p.props.id === id_1;
            });
            var propertiesInfo = property.props.propertiesInfo;
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
            dragItem.setDelay(Math.max(dragDelay + _this.getDistTime(distX), 0));

            _this.update();
          } else {
            _this.scrollArea.keyframesArea.getElement().scrollLeft -= deltaX;
            _this.scrollArea.getElement().scrollTop -= deltaY;
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
          dragDelay = 0;
          !isDrag && click(inputEvent, clientX, clientY);
          dblCheck(isDrag, inputEvent, clientX, clientY, dblclick);
        }
      });
    });
  };

  __proto.initKeyController = function () {
    var _this = this;

    window.addEventListener("blur", function () {
      _this.setState({
        alt: false
      });
    }); // if (props.keyboard) {

    if (this.props.keyboard) {
      this.keycon.keydown("space", function (_a) {
        var inputEvent = _a.inputEvent;
        inputEvent.preventDefault();
      }).keydown("left", function (e) {
        _this.prev();
      }).keydown("right", function (e) {
        _this.next();
      }).keyup("backspace", function () {
        _this.removeKeyframe(_this.state.selectedProperty);
      }).keyup("esc", function () {
        _this.finish();
      }).keyup("space", function () {
        _this.togglePlay();
      });
    }
  };

  Timeline.defaultProps = {
    keyboard: true
  };
  return Timeline;
}(Component);

export default Timeline;
//# sourceMappingURL=timeline.esm.js.map
