/*
Copyright (c) 2019 Daybrush
name: @scenejs/timeline
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/scenejs-timeline.git
version: 0.2.2
*/
import PreactTimeline from 'preact-timeline';
import EgComponent from '@egjs/component';
import { render, h } from 'preact';

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

var Timeline =
/*#__PURE__*/
function (_super) {
  __extends(Timeline, _super);

  function Timeline(scene, parentElement, options) {
    if (options === void 0) {
      options = {};
    }

    var _this = _super.call(this) || this;

    _this.onSelect = function (e) {
      _this.trigger("select", e);
    };

    var element = document.createElement("div");
    render(h(PreactTimeline, __assign({
      ref: function (e) {
        e && (_this.timelineArea = e);
      },
      keyboard: true
    }, options, {
      scene: scene,
      onSelect: _this.onSelect
    })), element);
    parentElement.appendChild(element.children[0]);
    return _this;
  }

  var __proto = Timeline.prototype;

  __proto.update = function (isInit) {
    this.timelineArea.update(isInit);
  };

  return Timeline;
}(EgComponent);

export default Timeline;
//# sourceMappingURL=timeline.esm.js.map
