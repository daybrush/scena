/*
Copyright (c) 2019 Daybrush
name: @scenejs/timeline
license: MIT
author: Daybrush
repository: git+https://github.com/daybrush/scenejs-timeline.git
version: 0.2.2
*/
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.Timeline = factory());
}(this, function () { 'use strict';

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

    var VNode = function VNode() {};

    var options = {};

    var stack = [];

    var EMPTY_CHILDREN = [];

    function h(nodeName, attributes) {
    	var children = EMPTY_CHILDREN,
    	    lastSimple,
    	    child,
    	    simple,
    	    i;
    	for (i = arguments.length; i-- > 2;) {
    		stack.push(arguments[i]);
    	}
    	if (attributes && attributes.children != null) {
    		if (!stack.length) stack.push(attributes.children);
    		delete attributes.children;
    	}
    	while (stack.length) {
    		if ((child = stack.pop()) && child.pop !== undefined) {
    			for (i = child.length; i--;) {
    				stack.push(child[i]);
    			}
    		} else {
    			if (typeof child === 'boolean') child = null;

    			if (simple = typeof nodeName !== 'function') {
    				if (child == null) child = '';else if (typeof child === 'number') child = String(child);else if (typeof child !== 'string') simple = false;
    			}

    			if (simple && lastSimple) {
    				children[children.length - 1] += child;
    			} else if (children === EMPTY_CHILDREN) {
    				children = [child];
    			} else {
    				children.push(child);
    			}

    			lastSimple = simple;
    		}
    	}

    	var p = new VNode();
    	p.nodeName = nodeName;
    	p.children = children;
    	p.attributes = attributes == null ? undefined : attributes;
    	p.key = attributes == null ? undefined : attributes.key;

    	if (options.vnode !== undefined) options.vnode(p);

    	return p;
    }

    function extend(obj, props) {
      for (var i in props) {
        obj[i] = props[i];
      }return obj;
    }

    function applyRef(ref, value) {
      if (ref != null) {
        if (typeof ref == 'function') ref(value);else ref.current = value;
      }
    }

    var defer = typeof Promise == 'function' ? Promise.resolve().then.bind(Promise.resolve()) : setTimeout;

    function cloneElement(vnode, props) {
      return h(vnode.nodeName, extend(extend({}, vnode.attributes), props), arguments.length > 2 ? [].slice.call(arguments, 2) : vnode.children);
    }

    var IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;

    var items = [];

    function enqueueRender(component) {
    	if (!component._dirty && (component._dirty = true) && items.push(component) == 1) {
    		(defer)(rerender);
    	}
    }

    function rerender() {
    	var p;
    	while (p = items.pop()) {
    		if (p._dirty) renderComponent(p);
    	}
    }

    function isSameNodeType(node, vnode, hydrating) {
    	if (typeof vnode === 'string' || typeof vnode === 'number') {
    		return node.splitText !== undefined;
    	}
    	if (typeof vnode.nodeName === 'string') {
    		return !node._componentConstructor && isNamedNode(node, vnode.nodeName);
    	}
    	return hydrating || node._componentConstructor === vnode.nodeName;
    }

    function isNamedNode(node, nodeName) {
    	return node.normalizedNodeName === nodeName || node.nodeName.toLowerCase() === nodeName.toLowerCase();
    }

    function getNodeProps(vnode) {
    	var props = extend({}, vnode.attributes);
    	props.children = vnode.children;

    	var defaultProps = vnode.nodeName.defaultProps;
    	if (defaultProps !== undefined) {
    		for (var i in defaultProps) {
    			if (props[i] === undefined) {
    				props[i] = defaultProps[i];
    			}
    		}
    	}

    	return props;
    }

    function createNode(nodeName, isSvg) {
    	var node = isSvg ? document.createElementNS('http://www.w3.org/2000/svg', nodeName) : document.createElement(nodeName);
    	node.normalizedNodeName = nodeName;
    	return node;
    }

    function removeNode(node) {
    	var parentNode = node.parentNode;
    	if (parentNode) parentNode.removeChild(node);
    }

    function setAccessor(node, name, old, value, isSvg) {
    	if (name === 'className') name = 'class';

    	if (name === 'key') ; else if (name === 'ref') {
    		applyRef(old, null);
    		applyRef(value, node);
    	} else if (name === 'class' && !isSvg) {
    		node.className = value || '';
    	} else if (name === 'style') {
    		if (!value || typeof value === 'string' || typeof old === 'string') {
    			node.style.cssText = value || '';
    		}
    		if (value && typeof value === 'object') {
    			if (typeof old !== 'string') {
    				for (var i in old) {
    					if (!(i in value)) node.style[i] = '';
    				}
    			}
    			for (var i in value) {
    				node.style[i] = typeof value[i] === 'number' && IS_NON_DIMENSIONAL.test(i) === false ? value[i] + 'px' : value[i];
    			}
    		}
    	} else if (name === 'dangerouslySetInnerHTML') {
    		if (value) node.innerHTML = value.__html || '';
    	} else if (name[0] == 'o' && name[1] == 'n') {
    		var useCapture = name !== (name = name.replace(/Capture$/, ''));
    		name = name.toLowerCase().substring(2);
    		if (value) {
    			if (!old) node.addEventListener(name, eventProxy, useCapture);
    		} else {
    			node.removeEventListener(name, eventProxy, useCapture);
    		}
    		(node._listeners || (node._listeners = {}))[name] = value;
    	} else if (name !== 'list' && name !== 'type' && !isSvg && name in node) {
    		try {
    			node[name] = value == null ? '' : value;
    		} catch (e) {}
    		if ((value == null || value === false) && name != 'spellcheck') node.removeAttribute(name);
    	} else {
    		var ns = isSvg && name !== (name = name.replace(/^xlink:?/, ''));

    		if (value == null || value === false) {
    			if (ns) node.removeAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase());else node.removeAttribute(name);
    		} else if (typeof value !== 'function') {
    			if (ns) node.setAttributeNS('http://www.w3.org/1999/xlink', name.toLowerCase(), value);else node.setAttribute(name, value);
    		}
    	}
    }

    function eventProxy(e) {
    	return this._listeners[e.type](options.event && options.event(e) || e);
    }

    var mounts = [];

    var diffLevel = 0;

    var isSvgMode = false;

    var hydrating = false;

    function flushMounts() {
    	var c;
    	while (c = mounts.shift()) {
    		if (c.componentDidMount) c.componentDidMount();
    	}
    }

    function diff(dom, vnode, context, mountAll, parent, componentRoot) {
    	if (!diffLevel++) {
    		isSvgMode = parent != null && parent.ownerSVGElement !== undefined;

    		hydrating = dom != null && !('__preactattr_' in dom);
    	}

    	var ret = idiff(dom, vnode, context, mountAll, componentRoot);

    	if (parent && ret.parentNode !== parent) parent.appendChild(ret);

    	if (! --diffLevel) {
    		hydrating = false;

    		if (!componentRoot) flushMounts();
    	}

    	return ret;
    }

    function idiff(dom, vnode, context, mountAll, componentRoot) {
    	var out = dom,
    	    prevSvgMode = isSvgMode;

    	if (vnode == null || typeof vnode === 'boolean') vnode = '';

    	if (typeof vnode === 'string' || typeof vnode === 'number') {
    		if (dom && dom.splitText !== undefined && dom.parentNode && (!dom._component || componentRoot)) {
    			if (dom.nodeValue != vnode) {
    				dom.nodeValue = vnode;
    			}
    		} else {
    			out = document.createTextNode(vnode);
    			if (dom) {
    				if (dom.parentNode) dom.parentNode.replaceChild(out, dom);
    				recollectNodeTree(dom, true);
    			}
    		}

    		out['__preactattr_'] = true;

    		return out;
    	}

    	var vnodeName = vnode.nodeName;
    	if (typeof vnodeName === 'function') {
    		return buildComponentFromVNode(dom, vnode, context, mountAll);
    	}

    	isSvgMode = vnodeName === 'svg' ? true : vnodeName === 'foreignObject' ? false : isSvgMode;

    	vnodeName = String(vnodeName);
    	if (!dom || !isNamedNode(dom, vnodeName)) {
    		out = createNode(vnodeName, isSvgMode);

    		if (dom) {
    			while (dom.firstChild) {
    				out.appendChild(dom.firstChild);
    			}
    			if (dom.parentNode) dom.parentNode.replaceChild(out, dom);

    			recollectNodeTree(dom, true);
    		}
    	}

    	var fc = out.firstChild,
    	    props = out['__preactattr_'],
    	    vchildren = vnode.children;

    	if (props == null) {
    		props = out['__preactattr_'] = {};
    		for (var a = out.attributes, i = a.length; i--;) {
    			props[a[i].name] = a[i].value;
    		}
    	}

    	if (!hydrating && vchildren && vchildren.length === 1 && typeof vchildren[0] === 'string' && fc != null && fc.splitText !== undefined && fc.nextSibling == null) {
    		if (fc.nodeValue != vchildren[0]) {
    			fc.nodeValue = vchildren[0];
    		}
    	} else if (vchildren && vchildren.length || fc != null) {
    			innerDiffNode(out, vchildren, context, mountAll, hydrating || props.dangerouslySetInnerHTML != null);
    		}

    	diffAttributes(out, vnode.attributes, props);

    	isSvgMode = prevSvgMode;

    	return out;
    }

    function innerDiffNode(dom, vchildren, context, mountAll, isHydrating) {
    	var originalChildren = dom.childNodes,
    	    children = [],
    	    keyed = {},
    	    keyedLen = 0,
    	    min = 0,
    	    len = originalChildren.length,
    	    childrenLen = 0,
    	    vlen = vchildren ? vchildren.length : 0,
    	    j,
    	    c,
    	    f,
    	    vchild,
    	    child;

    	if (len !== 0) {
    		for (var i = 0; i < len; i++) {
    			var _child = originalChildren[i],
    			    props = _child['__preactattr_'],
    			    key = vlen && props ? _child._component ? _child._component.__key : props.key : null;
    			if (key != null) {
    				keyedLen++;
    				keyed[key] = _child;
    			} else if (props || (_child.splitText !== undefined ? isHydrating ? _child.nodeValue.trim() : true : isHydrating)) {
    				children[childrenLen++] = _child;
    			}
    		}
    	}

    	if (vlen !== 0) {
    		for (var i = 0; i < vlen; i++) {
    			vchild = vchildren[i];
    			child = null;

    			var key = vchild.key;
    			if (key != null) {
    				if (keyedLen && keyed[key] !== undefined) {
    					child = keyed[key];
    					keyed[key] = undefined;
    					keyedLen--;
    				}
    			} else if (min < childrenLen) {
    					for (j = min; j < childrenLen; j++) {
    						if (children[j] !== undefined && isSameNodeType(c = children[j], vchild, isHydrating)) {
    							child = c;
    							children[j] = undefined;
    							if (j === childrenLen - 1) childrenLen--;
    							if (j === min) min++;
    							break;
    						}
    					}
    				}

    			child = idiff(child, vchild, context, mountAll);

    			f = originalChildren[i];
    			if (child && child !== dom && child !== f) {
    				if (f == null) {
    					dom.appendChild(child);
    				} else if (child === f.nextSibling) {
    					removeNode(f);
    				} else {
    					dom.insertBefore(child, f);
    				}
    			}
    		}
    	}

    	if (keyedLen) {
    		for (var i in keyed) {
    			if (keyed[i] !== undefined) recollectNodeTree(keyed[i], false);
    		}
    	}

    	while (min <= childrenLen) {
    		if ((child = children[childrenLen--]) !== undefined) recollectNodeTree(child, false);
    	}
    }

    function recollectNodeTree(node, unmountOnly) {
    	var component = node._component;
    	if (component) {
    		unmountComponent(component);
    	} else {
    		if (node['__preactattr_'] != null) applyRef(node['__preactattr_'].ref, null);

    		if (unmountOnly === false || node['__preactattr_'] == null) {
    			removeNode(node);
    		}

    		removeChildren(node);
    	}
    }

    function removeChildren(node) {
    	node = node.lastChild;
    	while (node) {
    		var next = node.previousSibling;
    		recollectNodeTree(node, true);
    		node = next;
    	}
    }

    function diffAttributes(dom, attrs, old) {
    	var name;

    	for (name in old) {
    		if (!(attrs && attrs[name] != null) && old[name] != null) {
    			setAccessor(dom, name, old[name], old[name] = undefined, isSvgMode);
    		}
    	}

    	for (name in attrs) {
    		if (name !== 'children' && name !== 'innerHTML' && (!(name in old) || attrs[name] !== (name === 'value' || name === 'checked' ? dom[name] : old[name]))) {
    			setAccessor(dom, name, old[name], old[name] = attrs[name], isSvgMode);
    		}
    	}
    }

    var recyclerComponents = [];

    function createComponent(Ctor, props, context) {
    	var inst,
    	    i = recyclerComponents.length;

    	if (Ctor.prototype && Ctor.prototype.render) {
    		inst = new Ctor(props, context);
    		Component.call(inst, props, context);
    	} else {
    		inst = new Component(props, context);
    		inst.constructor = Ctor;
    		inst.render = doRender;
    	}

    	while (i--) {
    		if (recyclerComponents[i].constructor === Ctor) {
    			inst.nextBase = recyclerComponents[i].nextBase;
    			recyclerComponents.splice(i, 1);
    			return inst;
    		}
    	}

    	return inst;
    }

    function doRender(props, state, context) {
    	return this.constructor(props, context);
    }

    function setComponentProps(component, props, renderMode, context, mountAll) {
    	if (component._disable) return;
    	component._disable = true;

    	component.__ref = props.ref;
    	component.__key = props.key;
    	delete props.ref;
    	delete props.key;

    	if (typeof component.constructor.getDerivedStateFromProps === 'undefined') {
    		if (!component.base || mountAll) {
    			if (component.componentWillMount) component.componentWillMount();
    		} else if (component.componentWillReceiveProps) {
    			component.componentWillReceiveProps(props, context);
    		}
    	}

    	if (context && context !== component.context) {
    		if (!component.prevContext) component.prevContext = component.context;
    		component.context = context;
    	}

    	if (!component.prevProps) component.prevProps = component.props;
    	component.props = props;

    	component._disable = false;

    	if (renderMode !== 0) {
    		if (renderMode === 1 || options.syncComponentUpdates !== false || !component.base) {
    			renderComponent(component, 1, mountAll);
    		} else {
    			enqueueRender(component);
    		}
    	}

    	applyRef(component.__ref, component);
    }

    function renderComponent(component, renderMode, mountAll, isChild) {
    	if (component._disable) return;

    	var props = component.props,
    	    state = component.state,
    	    context = component.context,
    	    previousProps = component.prevProps || props,
    	    previousState = component.prevState || state,
    	    previousContext = component.prevContext || context,
    	    isUpdate = component.base,
    	    nextBase = component.nextBase,
    	    initialBase = isUpdate || nextBase,
    	    initialChildComponent = component._component,
    	    skip = false,
    	    snapshot = previousContext,
    	    rendered,
    	    inst,
    	    cbase;

    	if (component.constructor.getDerivedStateFromProps) {
    		state = extend(extend({}, state), component.constructor.getDerivedStateFromProps(props, state));
    		component.state = state;
    	}

    	if (isUpdate) {
    		component.props = previousProps;
    		component.state = previousState;
    		component.context = previousContext;
    		if (renderMode !== 2 && component.shouldComponentUpdate && component.shouldComponentUpdate(props, state, context) === false) {
    			skip = true;
    		} else if (component.componentWillUpdate) {
    			component.componentWillUpdate(props, state, context);
    		}
    		component.props = props;
    		component.state = state;
    		component.context = context;
    	}

    	component.prevProps = component.prevState = component.prevContext = component.nextBase = null;
    	component._dirty = false;

    	if (!skip) {
    		rendered = component.render(props, state, context);

    		if (component.getChildContext) {
    			context = extend(extend({}, context), component.getChildContext());
    		}

    		if (isUpdate && component.getSnapshotBeforeUpdate) {
    			snapshot = component.getSnapshotBeforeUpdate(previousProps, previousState);
    		}

    		var childComponent = rendered && rendered.nodeName,
    		    toUnmount,
    		    base;

    		if (typeof childComponent === 'function') {

    			var childProps = getNodeProps(rendered);
    			inst = initialChildComponent;

    			if (inst && inst.constructor === childComponent && childProps.key == inst.__key) {
    				setComponentProps(inst, childProps, 1, context, false);
    			} else {
    				toUnmount = inst;

    				component._component = inst = createComponent(childComponent, childProps, context);
    				inst.nextBase = inst.nextBase || nextBase;
    				inst._parentComponent = component;
    				setComponentProps(inst, childProps, 0, context, false);
    				renderComponent(inst, 1, mountAll, true);
    			}

    			base = inst.base;
    		} else {
    			cbase = initialBase;

    			toUnmount = initialChildComponent;
    			if (toUnmount) {
    				cbase = component._component = null;
    			}

    			if (initialBase || renderMode === 1) {
    				if (cbase) cbase._component = null;
    				base = diff(cbase, rendered, context, mountAll || !isUpdate, initialBase && initialBase.parentNode, true);
    			}
    		}

    		if (initialBase && base !== initialBase && inst !== initialChildComponent) {
    			var baseParent = initialBase.parentNode;
    			if (baseParent && base !== baseParent) {
    				baseParent.replaceChild(base, initialBase);

    				if (!toUnmount) {
    					initialBase._component = null;
    					recollectNodeTree(initialBase, false);
    				}
    			}
    		}

    		if (toUnmount) {
    			unmountComponent(toUnmount);
    		}

    		component.base = base;
    		if (base && !isChild) {
    			var componentRef = component,
    			    t = component;
    			while (t = t._parentComponent) {
    				(componentRef = t).base = base;
    			}
    			base._component = componentRef;
    			base._componentConstructor = componentRef.constructor;
    		}
    	}

    	if (!isUpdate || mountAll) {
    		mounts.push(component);
    	} else if (!skip) {

    		if (component.componentDidUpdate) {
    			component.componentDidUpdate(previousProps, previousState, snapshot);
    		}
    	}

    	while (component._renderCallbacks.length) {
    		component._renderCallbacks.pop().call(component);
    	}if (!diffLevel && !isChild) flushMounts();
    }

    function buildComponentFromVNode(dom, vnode, context, mountAll) {
    	var c = dom && dom._component,
    	    originalComponent = c,
    	    oldDom = dom,
    	    isDirectOwner = c && dom._componentConstructor === vnode.nodeName,
    	    isOwner = isDirectOwner,
    	    props = getNodeProps(vnode);
    	while (c && !isOwner && (c = c._parentComponent)) {
    		isOwner = c.constructor === vnode.nodeName;
    	}

    	if (c && isOwner && (!mountAll || c._component)) {
    		setComponentProps(c, props, 3, context, mountAll);
    		dom = c.base;
    	} else {
    		if (originalComponent && !isDirectOwner) {
    			unmountComponent(originalComponent);
    			dom = oldDom = null;
    		}

    		c = createComponent(vnode.nodeName, props, context);
    		if (dom && !c.nextBase) {
    			c.nextBase = dom;

    			oldDom = null;
    		}
    		setComponentProps(c, props, 1, context, mountAll);
    		dom = c.base;

    		if (oldDom && dom !== oldDom) {
    			oldDom._component = null;
    			recollectNodeTree(oldDom, false);
    		}
    	}

    	return dom;
    }

    function unmountComponent(component) {

    	var base = component.base;

    	component._disable = true;

    	if (component.componentWillUnmount) component.componentWillUnmount();

    	component.base = null;

    	var inner = component._component;
    	if (inner) {
    		unmountComponent(inner);
    	} else if (base) {
    		if (base['__preactattr_'] != null) applyRef(base['__preactattr_'].ref, null);

    		component.nextBase = base;

    		removeNode(base);
    		recyclerComponents.push(component);

    		removeChildren(base);
    	}

    	applyRef(component.__ref, null);
    }

    function Component(props, context) {
    	this._dirty = true;

    	this.context = context;

    	this.props = props;

    	this.state = this.state || {};

    	this._renderCallbacks = [];
    }

    extend(Component.prototype, {
    	setState: function setState(state, callback) {
    		if (!this.prevState) this.prevState = this.state;
    		this.state = extend(extend({}, this.state), typeof state === 'function' ? state(this.state, this.props) : state);
    		if (callback) this._renderCallbacks.push(callback);
    		enqueueRender(this);
    	},
    	forceUpdate: function forceUpdate(callback) {
    		if (callback) this._renderCallbacks.push(callback);
    		renderComponent(this, 2);
    	},
    	render: function render() {}
    });

    function render(vnode, parent, merge) {
      return diff(merge, vnode, {}, false, parent, false);
    }

    function createRef() {
    	return {};
    }

    /*
    Copyright (c) 2018 Daybrush
    @name: @daybrush/utils
    license: MIT
    author: Daybrush
    repository: https://github.com/daybrush/utils
    @version 0.10.0
    */
    /**
    * get string "object"
    * @memberof Consts
    * @example
    import {OBJECT} from "@daybrush/utils";

    console.log(OBJECT); // "object"
    */

    var OBJECT = "object";
    /**
    * get string "undefined"
    * @memberof Consts
    * @example
    import {UNDEFINED} from "@daybrush/utils";

    console.log(UNDEFINED); // "undefined"
    */

    var UNDEFINED = "undefined";

    /**
    * @namespace
    * @name Utils
    */

    /**
     * Returns the inner product of two numbers(`a1`, `a2`) by two criteria(`b1`, `b2`).
     * @memberof Utils
     * @param - The first number
     * @param - The second number
     * @param - The first number to base on the inner product
     * @param - The second number to base on the inner product
     * @return - Returns the inner product
    import { dot } from "@daybrush/utils";

    console.log(dot(0, 15, 2, 3)); // 6
    console.log(dot(5, 15, 2, 3)); // 9
    console.log(dot(5, 15, 1, 1)); // 10
     */

    function dot(a1, a2, b1, b2) {
      return (a1 * b2 + a2 * b1) / (b1 + b2);
    }
    /**
    * Check the type that the value is undefined.
    * @memberof Utils
    * @param {string} value - Value to check the type
    * @return {boolean} true if the type is correct, false otherwise
    * @example
    import {isUndefined} from "@daybrush/utils";

    console.log(isUndefined(undefined)); // true
    console.log(isUndefined("")); // false
    console.log(isUndefined(1)); // false
    console.log(isUndefined(null)); // false
    */

    function isUndefined(value) {
      return typeof value === UNDEFINED;
    }
    /**
    * Check the type that the value is object.
    * @memberof Utils
    * @param {string} value - Value to check the type
    * @return {} true if the type is correct, false otherwise
    * @example
    import {isObject} from "@daybrush/utils";

    console.log(isObject({})); // true
    console.log(isObject(undefined)); // false
    console.log(isObject("")); // false
    console.log(isObject(null)); // false
    */

    function isObject(value) {
      return value && typeof value === OBJECT;
    }
    /**
    * divide text by comma.
    * @memberof Utils
    * @param {string} text - text to divide
    * @return {Array} divided texts
    * @example
    import {splitComma} from "@daybrush/utils";

    console.log(splitComma("a,b,c,d,e,f,g"));
    // ["a", "b", "c", "d", "e", "f", "g"]
    console.log(splitComma("'a,b',c,'d,e',f,g"));
    // ["'a,b'", "c", "'d,e'", "f", "g"]
    */

    function splitComma(text) {
      // divide comma(,)
      // "[^"]*"|'[^']*'
      var matches = text.match(/("[^"]*"|'[^']*'|[^,\s()]*\((?:[^()]*|\([^()]*\))*\)[^,\s()]*|[^,])+/g);
      return matches ? matches.map(function (str) {
        return str.trim();
      }) : [];
    }
    /**
    * Date.now() method
    * @memberof CrossBrowser
    * @return {number} milliseconds
    * @example
    import {now} from "@daybrush/utils";

    console.log(now()); // 12121324241(milliseconds)
    */

    function now() {
      return Date.now ? Date.now() : new Date().getTime();
    }
    /**
    * Returns the index of the first element in the array that satisfies the provided testing function.
    * @function
    * @memberof CrossBrowser
    * @param - The array `findIndex` was called upon.
    * @param - A function to execute on each value in the array until the function returns true, indicating that the satisfying element was found.
    * @param - Returns defaultIndex if not found by the function.
    * @example
    import { findIndex } from "@daybrush/utils";

    findIndex([{a: 1}, {a: 2}, {a: 3}, {a: 4}], ({ a }) => a === 2); // 1
    */

    function findIndex(arr, callback, defaultIndex) {
      if (defaultIndex === void 0) {
        defaultIndex = -1;
      }

      var length = arr.length;

      for (var i = 0; i < length; ++i) {
        if (callback(arr[i], i, arr)) {
          return i;
        }
      }

      return defaultIndex;
    }
    /**
    * Returns the value of the first element in the array that satisfies the provided testing function.
    * @function
    * @memberof CrossBrowser
    * @param - The array `find` was called upon.
    * @param - A function to execute on each value in the array,
    * @param - Returns defalutValue if not found by the function.
    * @example
    import { find } from "@daybrush/utils";

    find([{a: 1}, {a: 2}, {a: 3}, {a: 4}], ({ a }) => a === 2); // {a: 2}
    */

    function find(arr, callback, defalutValue) {
      var index = findIndex(arr, callback);
      return index > -1 ? arr[index] : defalutValue;
    }
    /**
    * Checks if the specified class value exists in the element's class attribute.
    * @memberof DOM
    * @param element - target
    * @param className - the class name to search
    * @return {boolean} return false if the class is not found.
    * @example
    import {hasClass} from "@daybrush/utils";

    console.log(hasClass(element, "start")); // true or false
    */

    function hasClass(element, className) {
      if (element.classList) {
        return element.classList.contains(className);
      }

      return !!element.className.match(new RegExp("(\\s|^)" + className + "(\\s|$)"));
    }
    /**
    * Sets up a function that will be called whenever the specified event is delivered to the target
    * @memberof DOM
    * @param - event target
    * @param - A case-sensitive string representing the event type to listen for.
    * @param - The object which receives a notification (an object that implements the Event interface) when an event of the specified type occurs
    * @param - An options object that specifies characteristics about the event listener. The available options are:
    * @example
    import {addEvent} from "@daybrush/utils";

    addEvent(el, "click", e => {
      console.log(e);
    });
    */

    function addEvent(el, type, listener, options) {
      el.addEventListener(type, listener, options);
    }

    /*
    Copyright (c) 2017 NAVER Corp.
    @egjs/component project is licensed under the MIT license

    @egjs/component JavaScript library
    https://naver.github.io/egjs-component

    @version 2.1.2
    */
    /**
     * Copyright (c) 2015 NAVER Corp.
     * egjs projects are licensed under the MIT license
     */
    function isUndefined$1(value) {
      return typeof value === "undefined";
    }
    /**
     * A class used to manage events in a component
     * @ko 컴포넌트의 이벤트을 관리할 수 있게 하는 클래스
     * @alias eg.Component
     */


    var Component$1 =
    /*#__PURE__*/
    function () {
      var Component =
      /*#__PURE__*/
      function () {
        /**
        * Version info string
        * @ko 버전정보 문자열
        * @name VERSION
        * @static
        * @type {String}
        * @example
        * eg.Component.VERSION;  // ex) 2.0.0
        * @memberof eg.Component
        */

        /**
         * @support {"ie": "7+", "ch" : "latest", "ff" : "latest",  "sf" : "latest", "edge" : "latest", "ios" : "7+", "an" : "2.1+ (except 3.x)"}
         */
        function Component() {
          this._eventHandler = {};
          this.options = {};
        }
        /**
         * Triggers a custom event.
         * @ko 커스텀 이벤트를 발생시킨다
         * @param {String} eventName The name of the custom event to be triggered <ko>발생할 커스텀 이벤트의 이름</ko>
         * @param {Object} customEvent Event data to be sent when triggering a custom event <ko>커스텀 이벤트가 발생할 때 전달할 데이터</ko>
         * @return {Boolean} Indicates whether the event has occurred. If the stop() method is called by a custom event handler, it will return false and prevent the event from occurring. <a href="https://github.com/naver/egjs-component/wiki/How-to-make-Component-event-design%3F">Ref</a> <ko>이벤트 발생 여부. 커스텀 이벤트 핸들러에서 stop() 메서드를 호출하면 'false'를 반환하고 이벤트 발생을 중단한다. <a href="https://github.com/naver/egjs-component/wiki/How-to-make-Component-event-design%3F">참고</a></ko>
         * @example
        class Some extends eg.Component {
         some(){
         	if(this.trigger("beforeHi")){ // When event call to stop return false.
        	this.trigger("hi");// fire hi event.
         	}
         }
        }
        const some = new Some();
        some.on("beforeHi", (e) => {
        if(condition){
        	e.stop(); // When event call to stop, `hi` event not call.
        }
        });
        some.on("hi", (e) => {
        // `currentTarget` is component instance.
        console.log(some === e.currentTarget); // true
        });
        // If you want to more know event design. You can see article.
        // https://github.com/naver/egjs-component/wiki/How-to-make-Component-event-design%3F
         */


        var _proto = Component.prototype;

        _proto.trigger = function trigger(eventName, customEvent) {
          if (customEvent === void 0) {
            customEvent = {};
          }

          var handlerList = this._eventHandler[eventName] || [];
          var hasHandlerList = handlerList.length > 0;

          if (!hasHandlerList) {
            return true;
          } // If detach method call in handler in first time then handler list calls.


          handlerList = handlerList.concat();
          customEvent.eventType = eventName;
          var isCanceled = false;
          var arg = [customEvent];
          var i = 0;

          customEvent.stop = function () {
            isCanceled = true;
          };

          customEvent.currentTarget = this;

          for (var _len = arguments.length, restParam = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
            restParam[_key - 2] = arguments[_key];
          }

          if (restParam.length >= 1) {
            arg = arg.concat(restParam);
          }

          for (i = 0; handlerList[i]; i++) {
            handlerList[i].apply(this, arg);
          }

          return !isCanceled;
        };
        /**
         * Executed event just one time.
         * @ko 이벤트가 한번만 실행된다.
         * @param {eventName} eventName The name of the event to be attached <ko>등록할 이벤트의 이름</ko>
         * @param {Function} handlerToAttach The handler function of the event to be attached <ko>등록할 이벤트의 핸들러 함수</ko>
         * @return {eg.Component} An instance of a component itself<ko>컴포넌트 자신의 인스턴스</ko>
         * @example
        class Some extends eg.Component {
         hi() {
           alert("hi");
         }
         thing() {
           this.once("hi", this.hi);
         }
        }
        var some = new Some();
        some.thing();
        some.trigger("hi");
        // fire alert("hi");
        some.trigger("hi");
        // Nothing happens
         */


        _proto.once = function once(eventName, handlerToAttach) {
          if (typeof eventName === "object" && isUndefined$1(handlerToAttach)) {
            var eventHash = eventName;
            var i;

            for (i in eventHash) {
              this.once(i, eventHash[i]);
            }

            return this;
          } else if (typeof eventName === "string" && typeof handlerToAttach === "function") {
            var self = this;
            this.on(eventName, function listener() {
              for (var _len2 = arguments.length, arg = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                arg[_key2] = arguments[_key2];
              }

              handlerToAttach.apply(self, arg);
              self.off(eventName, listener);
            });
          }

          return this;
        };
        /**
         * Checks whether an event has been attached to a component.
         * @ko 컴포넌트에 이벤트가 등록됐는지 확인한다.
         * @param {String} eventName The name of the event to be attached <ko>등록 여부를 확인할 이벤트의 이름</ko>
         * @return {Boolean} Indicates whether the event is attached. <ko>이벤트 등록 여부</ko>
         * @example
        class Some extends eg.Component {
         some() {
           this.hasOn("hi");// check hi event.
         }
        }
         */


        _proto.hasOn = function hasOn(eventName) {
          return !!this._eventHandler[eventName];
        };
        /**
         * Attaches an event to a component.
         * @ko 컴포넌트에 이벤트를 등록한다.
         * @param {eventName} eventName The name of the event to be attached <ko>등록할 이벤트의 이름</ko>
         * @param {Function} handlerToAttach The handler function of the event to be attached <ko>등록할 이벤트의 핸들러 함수</ko>
         * @return {eg.Component} An instance of a component itself<ko>컴포넌트 자신의 인스턴스</ko>
         * @example
        class Some extends eg.Component {
         hi() {
           console.log("hi");
         }
         some() {
           this.on("hi",this.hi); //attach event
         }
        }
        */


        _proto.on = function on(eventName, handlerToAttach) {
          if (typeof eventName === "object" && isUndefined$1(handlerToAttach)) {
            var eventHash = eventName;
            var name;

            for (name in eventHash) {
              this.on(name, eventHash[name]);
            }

            return this;
          } else if (typeof eventName === "string" && typeof handlerToAttach === "function") {
            var handlerList = this._eventHandler[eventName];

            if (isUndefined$1(handlerList)) {
              this._eventHandler[eventName] = [];
              handlerList = this._eventHandler[eventName];
            }

            handlerList.push(handlerToAttach);
          }

          return this;
        };
        /**
         * Detaches an event from the component.
         * @ko 컴포넌트에 등록된 이벤트를 해제한다
         * @param {eventName} eventName The name of the event to be detached <ko>해제할 이벤트의 이름</ko>
         * @param {Function} handlerToDetach The handler function of the event to be detached <ko>해제할 이벤트의 핸들러 함수</ko>
         * @return {eg.Component} An instance of a component itself <ko>컴포넌트 자신의 인스턴스</ko>
         * @example
        class Some extends eg.Component {
         hi() {
           console.log("hi");
         }
         some() {
           this.off("hi",this.hi); //detach event
         }
        }
         */


        _proto.off = function off(eventName, handlerToDetach) {
          // All event detach.
          if (isUndefined$1(eventName)) {
            this._eventHandler = {};
            return this;
          } // All handler of specific event detach.


          if (isUndefined$1(handlerToDetach)) {
            if (typeof eventName === "string") {
              this._eventHandler[eventName] = undefined;
              return this;
            } else {
              var eventHash = eventName;
              var name;

              for (name in eventHash) {
                this.off(name, eventHash[name]);
              }

              return this;
            }
          } // The handler of specific event detach.


          var handlerList = this._eventHandler[eventName];

          if (handlerList) {
            var k;
            var handlerFunction;

            for (k = 0; (handlerFunction = handlerList[k]) !== undefined; k++) {
              if (handlerFunction === handlerToDetach) {
                handlerList = handlerList.splice(k, 1);
                break;
              }
            }
          }

          return this;
        };

        return Component;
      }();

      Component.VERSION = "2.1.2";
      return Component;
    }();

    /*
    Copyright (c) 2019 Daybrush
    name: keycon
    license: MIT
    author: Daybrush
    repository: git+https://github.com/daybrush/keycon.git
    version: 0.2.2
    */

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
    var extendStatics$1 = function (d, b) {
      extendStatics$1 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };

      return extendStatics$1(d, b);
    };

    function __extends$1(d, b) {
      extendStatics$1(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    function createCommonjsModule(fn, module) {
      return module = {
        exports: {}
      }, fn(module, module.exports), module.exports;
    }

    var keycode = createCommonjsModule(function (module, exports) {
    // Source: http://jsfiddle.net/vWx8V/
    // http://stackoverflow.com/questions/5603195/full-list-of-javascript-keycodes

    /**
     * Conenience method returns corresponding value for given keyName or keyCode.
     *
     * @param {Mixed} keyCode {Number} or keyName {String}
     * @return {Mixed}
     * @api public
     */
    function keyCode(searchInput) {
      // Keyboard Events
      if (searchInput && 'object' === typeof searchInput) {
        var hasKeyCode = searchInput.which || searchInput.keyCode || searchInput.charCode;
        if (hasKeyCode) searchInput = hasKeyCode;
      } // Numbers


      if ('number' === typeof searchInput) return names[searchInput]; // Everything else (cast to string)

      var search = String(searchInput); // check codes

      var foundNamedKey = codes[search.toLowerCase()];
      if (foundNamedKey) return foundNamedKey; // check aliases

      var foundNamedKey = aliases[search.toLowerCase()];
      if (foundNamedKey) return foundNamedKey; // weird character?

      if (search.length === 1) return search.charCodeAt(0);
      return undefined;
    }
    /**
     * Compares a keyboard event with a given keyCode or keyName.
     *
     * @param {Event} event Keyboard event that should be tested
     * @param {Mixed} keyCode {Number} or keyName {String}
     * @return {Boolean}
     * @api public
     */


    keyCode.isEventKey = function isEventKey(event, nameOrCode) {
      if (event && 'object' === typeof event) {
        var keyCode = event.which || event.keyCode || event.charCode;

        if (keyCode === null || keyCode === undefined) {
          return false;
        }

        if (typeof nameOrCode === 'string') {
          // check codes
          var foundNamedKey = codes[nameOrCode.toLowerCase()];

          if (foundNamedKey) {
            return foundNamedKey === keyCode;
          } // check aliases


          var foundNamedKey = aliases[nameOrCode.toLowerCase()];

          if (foundNamedKey) {
            return foundNamedKey === keyCode;
          }
        } else if (typeof nameOrCode === 'number') {
          return nameOrCode === keyCode;
        }

        return false;
      }
    };

    exports = module.exports = keyCode;
    /**
     * Get by name
     *
     *   exports.code['enter'] // => 13
     */

    var codes = exports.code = exports.codes = {
      'backspace': 8,
      'tab': 9,
      'enter': 13,
      'shift': 16,
      'ctrl': 17,
      'alt': 18,
      'pause/break': 19,
      'caps lock': 20,
      'esc': 27,
      'space': 32,
      'page up': 33,
      'page down': 34,
      'end': 35,
      'home': 36,
      'left': 37,
      'up': 38,
      'right': 39,
      'down': 40,
      'insert': 45,
      'delete': 46,
      'command': 91,
      'left command': 91,
      'right command': 93,
      'numpad *': 106,
      'numpad +': 107,
      'numpad -': 109,
      'numpad .': 110,
      'numpad /': 111,
      'num lock': 144,
      'scroll lock': 145,
      'my computer': 182,
      'my calculator': 183,
      ';': 186,
      '=': 187,
      ',': 188,
      '-': 189,
      '.': 190,
      '/': 191,
      '`': 192,
      '[': 219,
      '\\': 220,
      ']': 221,
      "'": 222 // Helper aliases

    };
    var aliases = exports.aliases = {
      'windows': 91,
      '⇧': 16,
      '⌥': 18,
      '⌃': 17,
      '⌘': 91,
      'ctl': 17,
      'control': 17,
      'option': 18,
      'pause': 19,
      'break': 19,
      'caps': 20,
      'return': 13,
      'escape': 27,
      'spc': 32,
      'spacebar': 32,
      'pgup': 33,
      'pgdn': 34,
      'ins': 45,
      'del': 46,
      'cmd': 91
      /*!
       * Programatically add the following
       */
      // lower case chars

    };

    for (i = 97; i < 123; i++) codes[String.fromCharCode(i)] = i - 32; // numbers


    for (var i = 48; i < 58; i++) codes[i - 48] = i; // function keys


    for (i = 1; i < 13; i++) codes['f' + i] = i + 111; // numpad keys


    for (i = 0; i < 10; i++) codes['numpad ' + i] = i + 96;
    /**
     * Get by code
     *
     *   exports.name[13] // => 'Enter'
     */


    var names = exports.names = exports.title = {}; // title for backward compat
    // Create reverse mapping

    for (i in codes) names[codes[i]] = i; // Add aliases


    for (var alias in aliases) {
      codes[alias] = aliases[alias];
    }
    });
    var keycode_1 = keycode.code;
    var keycode_2 = keycode.codes;
    var keycode_3 = keycode.aliases;
    var keycode_4 = keycode.names;
    var keycode_5 = keycode.title;

    /*
    Copyright (c) 2018 Daybrush
    @name: @daybrush/utils
    license: MIT
    author: Daybrush
    repository: https://github.com/daybrush/utils
    @version 0.7.1
    */
    /**
    * get string "string"
    * @memberof Consts
    * @example
    import {STRING} from "@daybrush/utils";

    console.log(STRING); // "string"
    */

    var STRING = "string";
    /**
    * Check the type that the value is isArray.
    * @memberof Utils
    * @param {string} value - Value to check the type
    * @return {} true if the type is correct, false otherwise
    * @example
    import {isArray} from "@daybrush/utils";

    console.log(isArray([])); // true
    console.log(isArray({})); // false
    console.log(isArray(undefined)); // false
    console.log(isArray(null)); // false
    */


    function isArray(value) {
      return Array.isArray(value);
    }
    /**
    * Check the type that the value is string.
    * @memberof Utils
    * @param {string} value - Value to check the type
    * @return {} true if the type is correct, false otherwise
    * @example
    import {isString} from "@daybrush/utils";

    console.log(isString("1234")); // true
    console.log(isString(undefined)); // false
    console.log(isString(1)); // false
    console.log(isString(null)); // false
    */


    function isString(value) {
      return typeof value === STRING;
    }
    /**
    * Sets up a function that will be called whenever the specified event is delivered to the target
    * @memberof DOM
    * @param - event target
    * @param - A case-sensitive string representing the event type to listen for.
    * @param - The object which receives a notification (an object that implements the Event interface) when an event of the specified type occurs
    * @param - An options object that specifies characteristics about the event listener. The available options are:
    * @example
    import {addEvent} from "@daybrush/utils";

    addEvent(el, "click", e => {
      console.log(e);
    });
    */


    function addEvent$1(el, type, listener, options) {
      el.addEventListener(type, listener, options);
    }

    var codeData = {
      "+": "plus",
      "left command": "meta",
      "right command": "meta"
    };
    var keysSort = {
      shift: 1,
      ctrl: 2,
      alt: 3,
      meta: 4
    };

    function getKey(keyCode) {
      var key = keycode_4[keyCode] || "";

      for (var name in codeData) {
        key = key.replace(name, codeData[name]);
      }

      return key.replace(/\s/g, "");
    }

    function getCombi(e, key) {
      var keys = [e.shiftKey && "shift", e.ctrlKey && "ctrl", e.altKey && "alt", e.metaKey && "meta"];
      keys.indexOf(key) === -1 && keys.push(key);
      return keys.filter(Boolean);
    }

    function getArrangeCombi(keys) {
      var arrangeKeys = keys.slice();
      arrangeKeys.sort(function (prev, next) {
        var prevScore = keysSort[prev] || 5;
        var nextScore = keysSort[next] || 5;
        return prevScore - nextScore;
      });
      return arrangeKeys;
    }
    /**
     */


    var KeyController =
    /*#__PURE__*/
    function (_super) {
      __extends$1(KeyController, _super);
      /**
       *
       */


      function KeyController(container) {
        if (container === void 0) {
          container = window;
        }

        var _this = _super.call(this) || this;
        /**
         */


        _this.ctrlKey = false;
        /**
         */

        _this.altKey = false;
        /**
         *
         */

        _this.shiftKey = false;
        /**
         *
         */

        _this.metaKey = false;

        _this.clear = function () {
          _this.ctrlKey = false;
          _this.altKey = false;
          _this.shiftKey = false;
          _this.metaKey = false;
        };

        _this.keydownEvent = function (e) {
          _this.triggerEvent("keydown", e);
        };

        _this.keyupEvent = function (e) {
          _this.triggerEvent("keyup", e);
        };

        addEvent$1(container, "blur", _this.clear);
        addEvent$1(container, "keydown", _this.keydownEvent);
        addEvent$1(container, "keyup", _this.keyupEvent);
        return _this;
      }
      /**
       *
       */


      var __proto = KeyController.prototype;

      __proto.keydown = function (comb, callback) {
        return this.addEvent("keydown", comb, callback);
      };
      /**
       *
       */


      __proto.keyup = function (comb, callback) {
        return this.addEvent("keyup", comb, callback);
      };

      __proto.addEvent = function (type, comb, callback) {
        if (isArray(comb)) {
          this.on(type + "." + getArrangeCombi(comb).join("."), callback);
        } else if (isString(comb)) {
          this.on(type + "." + comb, callback);
        } else {
          this.on(type, comb);
        }

        return this;
      };

      __proto.triggerEvent = function (type, e) {
        this.ctrlKey = e.ctrlKey;
        this.shiftKey = e.shiftKey;
        this.altKey = e.altKey;
        this.metaKey = e.metaKey;
        var key = getKey(e.keyCode);
        var isToggle = key === "ctrl" || key === "shift" || key === "meta" || key === "alt";
        var param = {
          key: key,
          isToggle: isToggle,
          inputEvent: e,
          keyCode: e.keyCode,
          ctrlKey: e.ctrlKey,
          altKey: e.altKey,
          shiftKey: e.shiftKey,
          metaKey: e.metaKey
        };
        this.trigger(type, param);
        this.trigger(type + "." + key, param);
        var combi = getCombi(e, key);
        combi.length > 1 && this.trigger(type + "." + combi.join("."), param);
      };

      return KeyController;
    }(Component$1);

    /*
    Copyright (c) 2019 Daybrush
    name: @daybrush/drag
    license: MIT
    author: Daybrush
    repository: git+https://github.com/daybrush/drag.git
    version: 0.4.2
    */
    function setDrag(el, options) {
      var flag = false;
      var startX = 0;
      var startY = 0;
      var prevX = 0;
      var prevY = 0;
      var datas = {};
      var isDrag = false;
      var _a = options.container,
          container = _a === void 0 ? el : _a,
          dragstart = options.dragstart,
          drag = options.drag,
          dragend = options.dragend,
          _b = options.events,
          events = _b === void 0 ? ["touch", "mouse"] : _b;
      var isTouch = events.indexOf("touch") > -1;
      var isMouse = events.indexOf("mouse") > -1;

      function getPosition(e) {
        return e.touches && e.touches.length ? e.touches[0] : e;
      }

      function onDragStart(e) {
        flag = true;
        isDrag = false;

        var _a = getPosition(e),
            clientX = _a.clientX,
            clientY = _a.clientY;

        startX = clientX;
        startY = clientY;
        prevX = clientX;
        prevY = clientY;
        datas = {};
        (dragstart && dragstart({
          datas: datas,
          inputEvent: e,
          clientX: clientX,
          clientY: clientY
        })) === false && (flag = false);
        flag && e.preventDefault();
      }

      function onDrag(e) {
        if (!flag) {
          return;
        }

        var _a = getPosition(e),
            clientX = _a.clientX,
            clientY = _a.clientY;

        var deltaX = clientX - prevX;
        var deltaY = clientY - prevY;

        if (!deltaX && !deltaY) {
          return;
        }

        isDrag = true;
        drag && drag({
          datas: datas,
          clientX: clientX,
          clientY: clientY,
          deltaX: deltaX,
          deltaY: deltaY,
          distX: clientX - startX,
          distY: clientY - startY,
          inputEvent: e
        });
        prevX = clientX;
        prevY = clientY;
      }

      function onDragEnd(e) {
        if (!flag) {
          return;
        }

        flag = false;
        dragend && dragend({
          datas: datas,
          isDrag: isDrag,
          inputEvent: e,
          clientX: prevX,
          clientY: prevY,
          distX: prevX - startX,
          distY: prevY - startY
        });
      }

      if (isMouse) {
        el.addEventListener("mousedown", onDragStart);
        container.addEventListener("mousemove", onDrag);
        container.addEventListener("mouseup", onDragEnd); // container.addEventListener("mouseleave", onDragEnd);
      }

      if (isTouch) {
        el.addEventListener("touchstart", onDragStart);
        container.addEventListener("touchmove", onDrag);
        container.addEventListener("touchend", onDragEnd);
      }
    }

    /*! Hammer.JS - v2.0.15 - 2019-04-04
     * http://naver.github.io/egjs
     *
     * Forked By Naver egjs
     * Copyright (c) hammerjs
     * Licensed under the MIT license */
    function _extends() {
      _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
          var source = arguments[i];

          for (var key in source) {
            if (Object.prototype.hasOwnProperty.call(source, key)) {
              target[key] = source[key];
            }
          }
        }

        return target;
      };

      return _extends.apply(this, arguments);
    }

    function _inheritsLoose(subClass, superClass) {
      subClass.prototype = Object.create(superClass.prototype);
      subClass.prototype.constructor = subClass;
      subClass.__proto__ = superClass;
    }

    function _assertThisInitialized(self) {
      if (self === void 0) {
        throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
      }

      return self;
    }

    /**
     * @private
     * extend object.
     * means that properties in dest will be overwritten by the ones in src.
     * @param {Object} target
     * @param {...Object} objects_to_assign
     * @returns {Object} target
     */
    var assign;

    if (typeof Object.assign !== 'function') {
      assign = function assign(target) {
        if (target === undefined || target === null) {
          throw new TypeError('Cannot convert undefined or null to object');
        }

        var output = Object(target);

        for (var index = 1; index < arguments.length; index++) {
          var source = arguments[index];

          if (source !== undefined && source !== null) {
            for (var nextKey in source) {
              if (source.hasOwnProperty(nextKey)) {
                output[nextKey] = source[nextKey];
              }
            }
          }
        }

        return output;
      };
    } else {
      assign = Object.assign;
    }

    var assign$1 = assign;

    var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
    var TEST_ELEMENT = typeof document === "undefined" ? {
      style: {}
    } : document.createElement('div');
    var TYPE_FUNCTION = 'function';
    var round = Math.round,
        abs = Math.abs;
    var now$1 = Date.now;

    /**
     * @private
     * get the prefixed property
     * @param {Object} obj
     * @param {String} property
     * @returns {String|Undefined} prefixed
     */

    function prefixed(obj, property) {
      var prefix;
      var prop;
      var camelProp = property[0].toUpperCase() + property.slice(1);
      var i = 0;

      while (i < VENDOR_PREFIXES.length) {
        prefix = VENDOR_PREFIXES[i];
        prop = prefix ? prefix + camelProp : property;

        if (prop in obj) {
          return prop;
        }

        i++;
      }

      return undefined;
    }

    /* eslint-disable no-new-func, no-nested-ternary */
    var win;

    if (typeof window === "undefined") {
      // window is undefined in node.js
      win = {};
    } else {
      win = window;
    }

    var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
    var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;
    function getTouchActionProps() {
      if (!NATIVE_TOUCH_ACTION) {
        return false;
      }

      var touchMap = {};
      var cssSupports = win.CSS && win.CSS.supports;
      ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function (val) {
        // If css.supports is not supported but there is native touch-action assume it supports
        // all values. This is the case for IE 10 and 11.
        return touchMap[val] = cssSupports ? win.CSS.supports('touch-action', val) : true;
      });
      return touchMap;
    }

    var TOUCH_ACTION_COMPUTE = 'compute';
    var TOUCH_ACTION_AUTO = 'auto';
    var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented

    var TOUCH_ACTION_NONE = 'none';
    var TOUCH_ACTION_PAN_X = 'pan-x';
    var TOUCH_ACTION_PAN_Y = 'pan-y';
    var TOUCH_ACTION_MAP = getTouchActionProps();

    var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;
    var SUPPORT_TOUCH = 'ontouchstart' in win;
    var SUPPORT_POINTER_EVENTS = prefixed(win, 'PointerEvent') !== undefined;
    var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);
    var INPUT_TYPE_TOUCH = 'touch';
    var INPUT_TYPE_PEN = 'pen';
    var INPUT_TYPE_MOUSE = 'mouse';
    var INPUT_TYPE_KINECT = 'kinect';
    var COMPUTE_INTERVAL = 25;
    var INPUT_START = 1;
    var INPUT_MOVE = 2;
    var INPUT_END = 4;
    var INPUT_CANCEL = 8;
    var DIRECTION_NONE = 1;
    var DIRECTION_LEFT = 2;
    var DIRECTION_RIGHT = 4;
    var DIRECTION_UP = 8;
    var DIRECTION_DOWN = 16;
    var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
    var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
    var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;
    var PROPS_XY = ['x', 'y'];
    var PROPS_CLIENT_XY = ['clientX', 'clientY'];

    /**
     * @private
     * walk objects and arrays
     * @param {Object} obj
     * @param {Function} iterator
     * @param {Object} context
     */
    function each(obj, iterator, context) {
      var i;

      if (!obj) {
        return;
      }

      if (obj.forEach) {
        obj.forEach(iterator, context);
      } else if (obj.length !== undefined) {
        i = 0;

        while (i < obj.length) {
          iterator.call(context, obj[i], i, obj);
          i++;
        }
      } else {
        for (i in obj) {
          obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
        }
      }
    }

    /**
     * @private
     * let a boolean value also be a function that must return a boolean
     * this first item in args will be used as the context
     * @param {Boolean|Function} val
     * @param {Array} [args]
     * @returns {Boolean}
     */

    function boolOrFn(val, args) {
      if (typeof val === TYPE_FUNCTION) {
        return val.apply(args ? args[0] || undefined : undefined, args);
      }

      return val;
    }

    /**
     * @private
     * small indexOf wrapper
     * @param {String} str
     * @param {String} find
     * @returns {Boolean} found
     */
    function inStr(str, find) {
      return str.indexOf(find) > -1;
    }

    /**
     * @private
     * when the touchActions are collected they are not a valid value, so we need to clean things up. *
     * @param {String} actions
     * @returns {*}
     */

    function cleanTouchActions(actions) {
      // none
      if (inStr(actions, TOUCH_ACTION_NONE)) {
        return TOUCH_ACTION_NONE;
      }

      var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
      var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y); // if both pan-x and pan-y are set (different recognizers
      // for different directions, e.g. horizontal pan but vertical swipe?)
      // we need none (as otherwise with pan-x pan-y combined none of these
      // recognizers will work, since the browser would handle all panning

      if (hasPanX && hasPanY) {
        return TOUCH_ACTION_NONE;
      } // pan-x OR pan-y


      if (hasPanX || hasPanY) {
        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
      } // manipulation


      if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
        return TOUCH_ACTION_MANIPULATION;
      }

      return TOUCH_ACTION_AUTO;
    }

    /**
     * @private
     * Touch Action
     * sets the touchAction property or uses the js alternative
     * @param {Manager} manager
     * @param {String} value
     * @constructor
     */

    var TouchAction =
    /*#__PURE__*/
    function () {
      function TouchAction(manager, value) {
        this.manager = manager;
        this.set(value);
      }
      /**
       * @private
       * set the touchAction value on the element or enable the polyfill
       * @param {String} value
       */


      var _proto = TouchAction.prototype;

      _proto.set = function set(value) {
        // find out the touch-action by the event handlers
        if (value === TOUCH_ACTION_COMPUTE) {
          value = this.compute();
        }

        if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
          this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
        }

        this.actions = value.toLowerCase().trim();
      };
      /**
       * @private
       * just re-set the touchAction value
       */


      _proto.update = function update() {
        this.set(this.manager.options.touchAction);
      };
      /**
       * @private
       * compute the value for the touchAction property based on the recognizer's settings
       * @returns {String} value
       */


      _proto.compute = function compute() {
        var actions = [];
        each(this.manager.recognizers, function (recognizer) {
          if (boolOrFn(recognizer.options.enable, [recognizer])) {
            actions = actions.concat(recognizer.getTouchAction());
          }
        });
        return cleanTouchActions(actions.join(' '));
      };
      /**
       * @private
       * this method is called on each input cycle and provides the preventing of the browser behavior
       * @param {Object} input
       */


      _proto.preventDefaults = function preventDefaults(input) {
        var srcEvent = input.srcEvent;
        var direction = input.offsetDirection; // if the touch action did prevented once this session

        if (this.manager.session.prevented) {
          srcEvent.preventDefault();
          return;
        }

        var actions = this.actions;
        var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

        if (hasNone) {
          // do not prevent defaults if this is a tap gesture
          var isTapPointer = input.pointers.length === 1;
          var isTapMovement = input.distance < 2;
          var isTapTouchTime = input.deltaTime < 250;

          if (isTapPointer && isTapMovement && isTapTouchTime) {
            return;
          }
        }

        if (hasPanX && hasPanY) {
          // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
          return;
        }

        if (hasNone || hasPanY && direction & DIRECTION_HORIZONTAL || hasPanX && direction & DIRECTION_VERTICAL) {
          return this.preventSrc(srcEvent);
        }
      };
      /**
       * @private
       * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
       * @param {Object} srcEvent
       */


      _proto.preventSrc = function preventSrc(srcEvent) {
        this.manager.session.prevented = true;
        srcEvent.preventDefault();
      };

      return TouchAction;
    }();

    /**
     * @private
     * find if a node is in the given parent
     * @method hasParent
     * @param {HTMLElement} node
     * @param {HTMLElement} parent
     * @return {Boolean} found
     */
    function hasParent(node, parent) {
      while (node) {
        if (node === parent) {
          return true;
        }

        node = node.parentNode;
      }

      return false;
    }

    /**
     * @private
     * get the center of all the pointers
     * @param {Array} pointers
     * @return {Object} center contains `x` and `y` properties
     */

    function getCenter(pointers) {
      var pointersLength = pointers.length; // no need to loop when only one touch

      if (pointersLength === 1) {
        return {
          x: round(pointers[0].clientX),
          y: round(pointers[0].clientY)
        };
      }

      var x = 0;
      var y = 0;
      var i = 0;

      while (i < pointersLength) {
        x += pointers[i].clientX;
        y += pointers[i].clientY;
        i++;
      }

      return {
        x: round(x / pointersLength),
        y: round(y / pointersLength)
      };
    }

    /**
     * @private
     * create a simple clone from the input used for storage of firstInput and firstMultiple
     * @param {Object} input
     * @returns {Object} clonedInputData
     */

    function simpleCloneInputData(input) {
      // make a simple copy of the pointers because we will get a reference if we don't
      // we only need clientXY for the calculations
      var pointers = [];
      var i = 0;

      while (i < input.pointers.length) {
        pointers[i] = {
          clientX: round(input.pointers[i].clientX),
          clientY: round(input.pointers[i].clientY)
        };
        i++;
      }

      return {
        timeStamp: now$1(),
        pointers: pointers,
        center: getCenter(pointers),
        deltaX: input.deltaX,
        deltaY: input.deltaY
      };
    }

    /**
     * @private
     * calculate the absolute distance between two points
     * @param {Object} p1 {x, y}
     * @param {Object} p2 {x, y}
     * @param {Array} [props] containing x and y keys
     * @return {Number} distance
     */

    function getDistance(p1, p2, props) {
      if (!props) {
        props = PROPS_XY;
      }

      var x = p2[props[0]] - p1[props[0]];
      var y = p2[props[1]] - p1[props[1]];
      return Math.sqrt(x * x + y * y);
    }

    /**
     * @private
     * calculate the angle between two coordinates
     * @param {Object} p1
     * @param {Object} p2
     * @param {Array} [props] containing x and y keys
     * @return {Number} angle
     */

    function getAngle(p1, p2, props) {
      if (!props) {
        props = PROPS_XY;
      }

      var x = p2[props[0]] - p1[props[0]];
      var y = p2[props[1]] - p1[props[1]];
      return Math.atan2(y, x) * 180 / Math.PI;
    }

    /**
     * @private
     * get the direction between two points
     * @param {Number} x
     * @param {Number} y
     * @return {Number} direction
     */

    function getDirection(x, y) {
      if (x === y) {
        return DIRECTION_NONE;
      }

      if (abs(x) >= abs(y)) {
        return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
      }

      return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
    }

    function computeDeltaXY(session, input) {
      var center = input.center; // let { offsetDelta:offset = {}, prevDelta = {}, prevInput = {} } = session;
      // jscs throwing error on defalut destructured values and without defaults tests fail

      var offset = session.offsetDelta || {};
      var prevDelta = session.prevDelta || {};
      var prevInput = session.prevInput || {};

      if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
        prevDelta = session.prevDelta = {
          x: prevInput.deltaX || 0,
          y: prevInput.deltaY || 0
        };
        offset = session.offsetDelta = {
          x: center.x,
          y: center.y
        };
      }

      input.deltaX = prevDelta.x + (center.x - offset.x);
      input.deltaY = prevDelta.y + (center.y - offset.y);
    }

    /**
     * @private
     * calculate the velocity between two points. unit is in px per ms.
     * @param {Number} deltaTime
     * @param {Number} x
     * @param {Number} y
     * @return {Object} velocity `x` and `y`
     */
    function getVelocity(deltaTime, x, y) {
      return {
        x: x / deltaTime || 0,
        y: y / deltaTime || 0
      };
    }

    /**
     * @private
     * calculate the scale factor between two pointersets
     * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
     * @param {Array} start array of pointers
     * @param {Array} end array of pointers
     * @return {Number} scale
     */

    function getScale(start, end) {
      return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
    }

    /**
     * @private
     * calculate the rotation degrees between two pointersets
     * @param {Array} start array of pointers
     * @param {Array} end array of pointers
     * @return {Number} rotation
     */

    function getRotation(start, end) {
      return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
    }

    /**
     * @private
     * velocity is calculated every x ms
     * @param {Object} session
     * @param {Object} input
     */

    function computeIntervalInputData(session, input) {
      var last = session.lastInterval || input;
      var deltaTime = input.timeStamp - last.timeStamp;
      var velocity;
      var velocityX;
      var velocityY;
      var direction;

      if (input.eventType !== INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
        var deltaX = input.deltaX - last.deltaX;
        var deltaY = input.deltaY - last.deltaY;
        var v = getVelocity(deltaTime, deltaX, deltaY);
        velocityX = v.x;
        velocityY = v.y;
        velocity = abs(v.x) > abs(v.y) ? v.x : v.y;
        direction = getDirection(deltaX, deltaY);
        session.lastInterval = input;
      } else {
        // use latest velocity info if it doesn't overtake a minimum period
        velocity = last.velocity;
        velocityX = last.velocityX;
        velocityY = last.velocityY;
        direction = last.direction;
      }

      input.velocity = velocity;
      input.velocityX = velocityX;
      input.velocityY = velocityY;
      input.direction = direction;
    }

    /**
    * @private
     * extend the data with some usable properties like scale, rotate, velocity etc
     * @param {Object} manager
     * @param {Object} input
     */

    function computeInputData(manager, input) {
      var session = manager.session;
      var pointers = input.pointers;
      var pointersLength = pointers.length; // store the first input to calculate the distance and direction

      if (!session.firstInput) {
        session.firstInput = simpleCloneInputData(input);
      } // to compute scale and rotation we need to store the multiple touches


      if (pointersLength > 1 && !session.firstMultiple) {
        session.firstMultiple = simpleCloneInputData(input);
      } else if (pointersLength === 1) {
        session.firstMultiple = false;
      }

      var firstInput = session.firstInput,
          firstMultiple = session.firstMultiple;
      var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;
      var center = input.center = getCenter(pointers);
      input.timeStamp = now$1();
      input.deltaTime = input.timeStamp - firstInput.timeStamp;
      input.angle = getAngle(offsetCenter, center);
      input.distance = getDistance(offsetCenter, center);
      computeDeltaXY(session, input);
      input.offsetDirection = getDirection(input.deltaX, input.deltaY);
      var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
      input.overallVelocityX = overallVelocity.x;
      input.overallVelocityY = overallVelocity.y;
      input.overallVelocity = abs(overallVelocity.x) > abs(overallVelocity.y) ? overallVelocity.x : overallVelocity.y;
      input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
      input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;
      input.maxPointers = !session.prevInput ? input.pointers.length : input.pointers.length > session.prevInput.maxPointers ? input.pointers.length : session.prevInput.maxPointers;
      computeIntervalInputData(session, input); // find the correct target

      var target = manager.element;

      if (hasParent(input.srcEvent.target, target)) {
        target = input.srcEvent.target;
      }

      input.target = target;
    }

    /**
     * @private
     * handle input events
     * @param {Manager} manager
     * @param {String} eventType
     * @param {Object} input
     */

    function inputHandler(manager, eventType, input) {
      var pointersLen = input.pointers.length;
      var changedPointersLen = input.changedPointers.length;
      var isFirst = eventType & INPUT_START && pointersLen - changedPointersLen === 0;
      var isFinal = eventType & (INPUT_END | INPUT_CANCEL) && pointersLen - changedPointersLen === 0;
      input.isFirst = !!isFirst;
      input.isFinal = !!isFinal;

      if (isFirst) {
        manager.session = {};
      } // source event is the normalized value of the domEvents
      // like 'touchstart, mouseup, pointerdown'


      input.eventType = eventType; // compute scale, rotation etc

      computeInputData(manager, input); // emit secret event

      manager.emit('hammer.input', input);
      manager.recognize(input);
      manager.session.prevInput = input;
    }

    /**
     * @private
     * split string on whitespace
     * @param {String} str
     * @returns {Array} words
     */
    function splitStr(str) {
      return str.trim().split(/\s+/g);
    }

    /**
     * @private
     * addEventListener with multiple events at once
     * @param {EventTarget} target
     * @param {String} types
     * @param {Function} handler
     */

    function addEventListeners(target, types, handler) {
      each(splitStr(types), function (type) {
        target.addEventListener(type, handler, false);
      });
    }

    /**
     * @private
     * removeEventListener with multiple events at once
     * @param {EventTarget} target
     * @param {String} types
     * @param {Function} handler
     */

    function removeEventListeners(target, types, handler) {
      each(splitStr(types), function (type) {
        target.removeEventListener(type, handler, false);
      });
    }

    /**
     * @private
     * get the window object of an element
     * @param {HTMLElement} element
     * @returns {DocumentView|Window}
     */
    function getWindowForElement(element) {
      var doc = element.ownerDocument || element;
      return doc.defaultView || doc.parentWindow || window;
    }

    /**
     * @private
     * create new input type manager
     * @param {Manager} manager
     * @param {Function} callback
     * @returns {Input}
     * @constructor
     */

    var Input =
    /*#__PURE__*/
    function () {
      function Input(manager, callback) {
        var self = this;
        this.manager = manager;
        this.callback = callback;
        this.element = manager.element;
        this.target = manager.options.inputTarget; // smaller wrapper around the handler, for the scope and the enabled state of the manager,
        // so when disabled the input events are completely bypassed.

        this.domHandler = function (ev) {
          if (boolOrFn(manager.options.enable, [manager])) {
            self.handler(ev);
          }
        };

        this.init();
      }
      /**
       * @private
       * should handle the inputEvent data and trigger the callback
       * @virtual
       */


      var _proto = Input.prototype;

      _proto.handler = function handler() {};
      /**
       * @private
       * bind the events
       */


      _proto.init = function init() {
        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
      };
      /**
       * @private
       * unbind the events
       */


      _proto.destroy = function destroy() {
        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
      };

      return Input;
    }();

    /**
     * @private
     * find if a array contains the object using indexOf or a simple polyFill
     * @param {Array} src
     * @param {String} find
     * @param {String} [findByKey]
     * @return {Boolean|Number} false when not found, or the index
     */
    function inArray(src, find, findByKey) {
      if (src.indexOf && !findByKey) {
        return src.indexOf(find);
      } else {
        var i = 0;

        while (i < src.length) {
          if (findByKey && src[i][findByKey] == find || !findByKey && src[i] === find) {
            // do not use === here, test fails
            return i;
          }

          i++;
        }

        return -1;
      }
    }

    var POINTER_INPUT_MAP = {
      pointerdown: INPUT_START,
      pointermove: INPUT_MOVE,
      pointerup: INPUT_END,
      pointercancel: INPUT_CANCEL,
      pointerout: INPUT_CANCEL
    }; // in IE10 the pointer types is defined as an enum

    var IE10_POINTER_TYPE_ENUM = {
      2: INPUT_TYPE_TOUCH,
      3: INPUT_TYPE_PEN,
      4: INPUT_TYPE_MOUSE,
      5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816

    };
    var POINTER_ELEMENT_EVENTS = 'pointerdown';
    var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel'; // IE10 has prefixed support, and case-sensitive

    if (win.MSPointerEvent && !win.PointerEvent) {
      POINTER_ELEMENT_EVENTS = 'MSPointerDown';
      POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
    }
    /**
     * @private
     * Pointer events input
     * @constructor
     * @extends Input
     */


    var PointerEventInput =
    /*#__PURE__*/
    function (_Input) {
      _inheritsLoose(PointerEventInput, _Input);

      function PointerEventInput() {
        var _this;

        var proto = PointerEventInput.prototype;
        proto.evEl = POINTER_ELEMENT_EVENTS;
        proto.evWin = POINTER_WINDOW_EVENTS;
        _this = _Input.apply(this, arguments) || this;
        _this.store = _this.manager.session.pointerEvents = [];
        return _this;
      }
      /**
       * @private
       * handle mouse events
       * @param {Object} ev
       */


      var _proto = PointerEventInput.prototype;

      _proto.handler = function handler(ev) {
        var store = this.store;
        var removePointer = false;
        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;
        var isTouch = pointerType === INPUT_TYPE_TOUCH; // get index of the event in the store

        var storeIndex = inArray(store, ev.pointerId, 'pointerId'); // start and mouse must be down

        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
          if (storeIndex < 0) {
            store.push(ev);
            storeIndex = store.length - 1;
          }
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
          removePointer = true;
        } // it not found, so the pointer hasn't been down (so it's probably a hover)


        if (storeIndex < 0) {
          return;
        } // update the event in the store


        store[storeIndex] = ev;
        this.callback(this.manager, eventType, {
          pointers: store,
          changedPointers: [ev],
          pointerType: pointerType,
          srcEvent: ev
        });

        if (removePointer) {
          // remove from the store
          store.splice(storeIndex, 1);
        }
      };

      return PointerEventInput;
    }(Input);

    /**
     * @private
     * convert array-like objects to real arrays
     * @param {Object} obj
     * @returns {Array}
     */
    function toArray(obj) {
      return Array.prototype.slice.call(obj, 0);
    }

    /**
     * @private
     * unique array with objects based on a key (like 'id') or just by the array's value
     * @param {Array} src [{id:1},{id:2},{id:1}]
     * @param {String} [key]
     * @param {Boolean} [sort=False]
     * @returns {Array} [{id:1},{id:2}]
     */

    function uniqueArray(src, key, sort) {
      var results = [];
      var values = [];
      var i = 0;

      while (i < src.length) {
        var val = key ? src[i][key] : src[i];

        if (inArray(values, val) < 0) {
          results.push(src[i]);
        }

        values[i] = val;
        i++;
      }

      if (sort) {
        if (!key) {
          results = results.sort();
        } else {
          results = results.sort(function (a, b) {
            return a[key] > b[key];
          });
        }
      }

      return results;
    }

    var TOUCH_INPUT_MAP = {
      touchstart: INPUT_START,
      touchmove: INPUT_MOVE,
      touchend: INPUT_END,
      touchcancel: INPUT_CANCEL
    };
    var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';
    /**
     * @private
     * Multi-user touch events input
     * @constructor
     * @extends Input
     */

    var TouchInput =
    /*#__PURE__*/
    function (_Input) {
      _inheritsLoose(TouchInput, _Input);

      function TouchInput() {
        var _this;

        TouchInput.prototype.evTarget = TOUCH_TARGET_EVENTS;
        _this = _Input.apply(this, arguments) || this;
        _this.targetIds = {}; // this.evTarget = TOUCH_TARGET_EVENTS;

        return _this;
      }

      var _proto = TouchInput.prototype;

      _proto.handler = function handler(ev) {
        var type = TOUCH_INPUT_MAP[ev.type];
        var touches = getTouches.call(this, ev, type);

        if (!touches) {
          return;
        }

        this.callback(this.manager, type, {
          pointers: touches[0],
          changedPointers: touches[1],
          pointerType: INPUT_TYPE_TOUCH,
          srcEvent: ev
        });
      };

      return TouchInput;
    }(Input);

    function getTouches(ev, type) {
      var allTouches = toArray(ev.touches);
      var targetIds = this.targetIds; // when there is only one touch, the process can be simplified

      if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
        targetIds[allTouches[0].identifier] = true;
        return [allTouches, allTouches];
      }

      var i;
      var targetTouches;
      var changedTouches = toArray(ev.changedTouches);
      var changedTargetTouches = [];
      var target = this.target; // get target touches from touches

      targetTouches = allTouches.filter(function (touch) {
        return hasParent(touch.target, target);
      }); // collect touches

      if (type === INPUT_START) {
        i = 0;

        while (i < targetTouches.length) {
          targetIds[targetTouches[i].identifier] = true;
          i++;
        }
      } // filter changed touches to only contain touches that exist in the collected target ids


      i = 0;

      while (i < changedTouches.length) {
        if (targetIds[changedTouches[i].identifier]) {
          changedTargetTouches.push(changedTouches[i]);
        } // cleanup removed touches


        if (type & (INPUT_END | INPUT_CANCEL)) {
          delete targetIds[changedTouches[i].identifier];
        }

        i++;
      }

      if (!changedTargetTouches.length) {
        return;
      }

      return [// merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
      uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true), changedTargetTouches];
    }

    var MOUSE_INPUT_MAP = {
      mousedown: INPUT_START,
      mousemove: INPUT_MOVE,
      mouseup: INPUT_END
    };
    var MOUSE_ELEMENT_EVENTS = 'mousedown';
    var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';
    /**
     * @private
     * Mouse events input
     * @constructor
     * @extends Input
     */

    var MouseInput =
    /*#__PURE__*/
    function (_Input) {
      _inheritsLoose(MouseInput, _Input);

      function MouseInput() {
        var _this;

        var proto = MouseInput.prototype;
        proto.evEl = MOUSE_ELEMENT_EVENTS;
        proto.evWin = MOUSE_WINDOW_EVENTS;
        _this = _Input.apply(this, arguments) || this;
        _this.pressed = false; // mousedown state

        return _this;
      }
      /**
       * @private
       * handle mouse events
       * @param {Object} ev
       */


      var _proto = MouseInput.prototype;

      _proto.handler = function handler(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type]; // on start we want to have the left mouse button down

        if (eventType & INPUT_START && ev.button === 0) {
          this.pressed = true;
        }

        if (eventType & INPUT_MOVE && ev.which !== 1) {
          eventType = INPUT_END;
        } // mouse must be down


        if (!this.pressed) {
          return;
        }

        if (eventType & INPUT_END) {
          this.pressed = false;
        }

        this.callback(this.manager, eventType, {
          pointers: [ev],
          changedPointers: [ev],
          pointerType: INPUT_TYPE_MOUSE,
          srcEvent: ev
        });
      };

      return MouseInput;
    }(Input);

    /**
     * @private
     * Combined touch and mouse input
     *
     * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
     * This because touch devices also emit mouse events while doing a touch.
     *
     * @constructor
     * @extends Input
     */

    var DEDUP_TIMEOUT = 2500;
    var DEDUP_DISTANCE = 25;

    function setLastTouch(eventData) {
      var _eventData$changedPoi = eventData.changedPointers,
          touch = _eventData$changedPoi[0];

      if (touch.identifier === this.primaryTouch) {
        var lastTouch = {
          x: touch.clientX,
          y: touch.clientY
        };
        var lts = this.lastTouches;
        this.lastTouches.push(lastTouch);

        var removeLastTouch = function removeLastTouch() {
          var i = lts.indexOf(lastTouch);

          if (i > -1) {
            lts.splice(i, 1);
          }
        };

        setTimeout(removeLastTouch, DEDUP_TIMEOUT);
      }
    }

    function recordTouches(eventType, eventData) {
      if (eventType & INPUT_START) {
        this.primaryTouch = eventData.changedPointers[0].identifier;
        setLastTouch.call(this, eventData);
      } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
        setLastTouch.call(this, eventData);
      }
    }

    function isSyntheticEvent(eventData) {
      var x = eventData.srcEvent.clientX;
      var y = eventData.srcEvent.clientY;

      for (var i = 0; i < this.lastTouches.length; i++) {
        var t = this.lastTouches[i];
        var dx = Math.abs(x - t.x);
        var dy = Math.abs(y - t.y);

        if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
          return true;
        }
      }

      return false;
    }

    var TouchMouseInput =
    /*#__PURE__*/
    function () {
      var TouchMouseInput =
      /*#__PURE__*/
      function (_Input) {
        _inheritsLoose(TouchMouseInput, _Input);

        function TouchMouseInput(_manager, callback) {
          var _this;

          _this = _Input.call(this, _manager, callback) || this;

          _this.handler = function (manager, inputEvent, inputData) {
            var isTouch = inputData.pointerType === INPUT_TYPE_TOUCH;
            var isMouse = inputData.pointerType === INPUT_TYPE_MOUSE;

            if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
              return;
            } // when we're in a touch event, record touches to  de-dupe synthetic mouse event


            if (isTouch) {
              recordTouches.call(_assertThisInitialized(_assertThisInitialized(_this)), inputEvent, inputData);
            } else if (isMouse && isSyntheticEvent.call(_assertThisInitialized(_assertThisInitialized(_this)), inputData)) {
              return;
            }

            _this.callback(manager, inputEvent, inputData);
          };

          _this.touch = new TouchInput(_this.manager, _this.handler);
          _this.mouse = new MouseInput(_this.manager, _this.handler);
          _this.primaryTouch = null;
          _this.lastTouches = [];
          return _this;
        }
        /**
         * @private
         * handle mouse and touch events
         * @param {Hammer} manager
         * @param {String} inputEvent
         * @param {Object} inputData
         */


        var _proto = TouchMouseInput.prototype;

        /**
         * @private
         * remove the event listeners
         */
        _proto.destroy = function destroy() {
          this.touch.destroy();
          this.mouse.destroy();
        };

        return TouchMouseInput;
      }(Input);

      return TouchMouseInput;
    }();

    /**
     * @private
     * create new input type manager
     * called by the Manager constructor
     * @param {Hammer} manager
     * @returns {Input}
     */

    function createInputInstance(manager) {
      var Type; // let inputClass = manager.options.inputClass;

      var inputClass = manager.options.inputClass;

      if (inputClass) {
        Type = inputClass;
      } else if (SUPPORT_POINTER_EVENTS) {
        Type = PointerEventInput;
      } else if (SUPPORT_ONLY_TOUCH) {
        Type = TouchInput;
      } else if (!SUPPORT_TOUCH) {
        Type = MouseInput;
      } else {
        Type = TouchMouseInput;
      }

      return new Type(manager, inputHandler);
    }

    /**
     * @private
     * if the argument is an array, we want to execute the fn on each entry
     * if it aint an array we don't want to do a thing.
     * this is used by all the methods that accept a single and array argument.
     * @param {*|Array} arg
     * @param {String} fn
     * @param {Object} [context]
     * @returns {Boolean}
     */

    function invokeArrayArg(arg, fn, context) {
      if (Array.isArray(arg)) {
        each(arg, context[fn], context);
        return true;
      }

      return false;
    }

    var STATE_POSSIBLE = 1;
    var STATE_BEGAN = 2;
    var STATE_CHANGED = 4;
    var STATE_ENDED = 8;
    var STATE_RECOGNIZED = STATE_ENDED;
    var STATE_CANCELLED = 16;
    var STATE_FAILED = 32;

    /**
     * @private
     * get a unique id
     * @returns {number} uniqueId
     */
    var _uniqueId = 1;
    function uniqueId() {
      return _uniqueId++;
    }

    /**
     * @private
     * get a recognizer by name if it is bound to a manager
     * @param {Recognizer|String} otherRecognizer
     * @param {Recognizer} recognizer
     * @returns {Recognizer}
     */
    function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
      var manager = recognizer.manager;

      if (manager) {
        return manager.get(otherRecognizer);
      }

      return otherRecognizer;
    }

    /**
     * @private
     * get a usable string, used as event postfix
     * @param {constant} state
     * @returns {String} state
     */

    function stateStr(state) {
      if (state & STATE_CANCELLED) {
        return 'cancel';
      } else if (state & STATE_ENDED) {
        return 'end';
      } else if (state & STATE_CHANGED) {
        return 'move';
      } else if (state & STATE_BEGAN) {
        return 'start';
      }

      return '';
    }

    /**
     * @private
     * Recognizer flow explained; *
     * All recognizers have the initial state of POSSIBLE when a input session starts.
     * The definition of a input session is from the first input until the last input, with all it's movement in it. *
     * Example session for mouse-input: mousedown -> mousemove -> mouseup
     *
     * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
     * which determines with state it should be.
     *
     * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
     * POSSIBLE to give it another change on the next cycle.
     *
     *               Possible
     *                  |
     *            +-----+---------------+
     *            |                     |
     *      +-----+-----+               |
     *      |           |               |
     *   Failed      Cancelled          |
     *                          +-------+------+
     *                          |              |
     *                      Recognized       Began
     *                                         |
     *                                      Changed
     *                                         |
     *                                  Ended/Recognized
     */

    /**
     * @private
     * Recognizer
     * Every recognizer needs to extend from this class.
     * @constructor
     * @param {Object} options
     */

    var Recognizer =
    /*#__PURE__*/
    function () {
      function Recognizer(options) {
        if (options === void 0) {
          options = {};
        }

        this.options = _extends({
          enable: true
        }, options);
        this.id = uniqueId();
        this.manager = null; // default is enable true

        this.state = STATE_POSSIBLE;
        this.simultaneous = {};
        this.requireFail = [];
      }
      /**
       * @private
       * set options
       * @param {Object} options
       * @return {Recognizer}
       */


      var _proto = Recognizer.prototype;

      _proto.set = function set(options) {
        assign$1(this.options, options); // also update the touchAction, in case something changed about the directions/enabled state

        this.manager && this.manager.touchAction.update();
        return this;
      };
      /**
       * @private
       * recognize simultaneous with an other recognizer.
       * @param {Recognizer} otherRecognizer
       * @returns {Recognizer} this
       */


      _proto.recognizeWith = function recognizeWith(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
          return this;
        }

        var simultaneous = this.simultaneous;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);

        if (!simultaneous[otherRecognizer.id]) {
          simultaneous[otherRecognizer.id] = otherRecognizer;
          otherRecognizer.recognizeWith(this);
        }

        return this;
      };
      /**
       * @private
       * drop the simultaneous link. it doesnt remove the link on the other recognizer.
       * @param {Recognizer} otherRecognizer
       * @returns {Recognizer} this
       */


      _proto.dropRecognizeWith = function dropRecognizeWith(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
          return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        delete this.simultaneous[otherRecognizer.id];
        return this;
      };
      /**
       * @private
       * recognizer can only run when an other is failing
       * @param {Recognizer} otherRecognizer
       * @returns {Recognizer} this
       */


      _proto.requireFailure = function requireFailure(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
          return this;
        }

        var requireFail = this.requireFail;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);

        if (inArray(requireFail, otherRecognizer) === -1) {
          requireFail.push(otherRecognizer);
          otherRecognizer.requireFailure(this);
        }

        return this;
      };
      /**
       * @private
       * drop the requireFailure link. it does not remove the link on the other recognizer.
       * @param {Recognizer} otherRecognizer
       * @returns {Recognizer} this
       */


      _proto.dropRequireFailure = function dropRequireFailure(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
          return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        var index = inArray(this.requireFail, otherRecognizer);

        if (index > -1) {
          this.requireFail.splice(index, 1);
        }

        return this;
      };
      /**
       * @private
       * has require failures boolean
       * @returns {boolean}
       */


      _proto.hasRequireFailures = function hasRequireFailures() {
        return this.requireFail.length > 0;
      };
      /**
       * @private
       * if the recognizer can recognize simultaneous with an other recognizer
       * @param {Recognizer} otherRecognizer
       * @returns {Boolean}
       */


      _proto.canRecognizeWith = function canRecognizeWith(otherRecognizer) {
        return !!this.simultaneous[otherRecognizer.id];
      };
      /**
       * @private
       * You should use `tryEmit` instead of `emit` directly to check
       * that all the needed recognizers has failed before emitting.
       * @param {Object} input
       */


      _proto.emit = function emit(input) {
        var self = this;
        var state = this.state;

        function emit(event) {
          self.manager.emit(event, input);
        } // 'panstart' and 'panmove'


        if (state < STATE_ENDED) {
          emit(self.options.event + stateStr(state));
        }

        emit(self.options.event); // simple 'eventName' events

        if (input.additionalEvent) {
          // additional event(panleft, panright, pinchin, pinchout...)
          emit(input.additionalEvent);
        } // panend and pancancel


        if (state >= STATE_ENDED) {
          emit(self.options.event + stateStr(state));
        }
      };
      /**
       * @private
       * Check that all the require failure recognizers has failed,
       * if true, it emits a gesture event,
       * otherwise, setup the state to FAILED.
       * @param {Object} input
       */


      _proto.tryEmit = function tryEmit(input) {
        if (this.canEmit()) {
          return this.emit(input);
        } // it's failing anyway


        this.state = STATE_FAILED;
      };
      /**
       * @private
       * can we emit?
       * @returns {boolean}
       */


      _proto.canEmit = function canEmit() {
        var i = 0;

        while (i < this.requireFail.length) {
          if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
            return false;
          }

          i++;
        }

        return true;
      };
      /**
       * @private
       * update the recognizer
       * @param {Object} inputData
       */


      _proto.recognize = function recognize(inputData) {
        // make a new copy of the inputData
        // so we can change the inputData without messing up the other recognizers
        var inputDataClone = assign$1({}, inputData); // is is enabled and allow recognizing?

        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
          this.reset();
          this.state = STATE_FAILED;
          return;
        } // reset when we've reached the end


        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
          this.state = STATE_POSSIBLE;
        }

        this.state = this.process(inputDataClone); // the recognizer has recognized a gesture
        // so trigger an event

        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
          this.tryEmit(inputDataClone);
        }
      };
      /**
       * @private
       * return the state of the recognizer
       * the actual recognizing happens in this method
       * @virtual
       * @param {Object} inputData
       * @returns {constant} STATE
       */

      /* jshint ignore:start */


      _proto.process = function process(inputData) {};
      /* jshint ignore:end */

      /**
       * @private
       * return the preferred touch-action
       * @virtual
       * @returns {Array}
       */


      _proto.getTouchAction = function getTouchAction() {};
      /**
       * @private
       * called when the gesture isn't allowed to recognize
       * like when another is being recognized or it is disabled
       * @virtual
       */


      _proto.reset = function reset() {};

      return Recognizer;
    }();

    var defaults = {
      /**
       * @private
       * set if DOM events are being triggered.
       * But this is slower and unused by simple implementations, so disabled by default.
       * @type {Boolean}
       * @default false
       */
      domEvents: false,

      /**
       * @private
       * The value for the touchAction property/fallback.
       * When set to `compute` it will magically set the correct value based on the added recognizers.
       * @type {String}
       * @default compute
       */
      touchAction: TOUCH_ACTION_COMPUTE,

      /**
       * @private
       * @type {Boolean}
       * @default true
       */
      enable: true,

      /**
       * @private
       * EXPERIMENTAL FEATURE -- can be removed/changed
       * Change the parent input target element.
       * If Null, then it is being set the to main element.
       * @type {Null|EventTarget}
       * @default null
       */
      inputTarget: null,

      /**
       * @private
       * force an input class
       * @type {Null|Function}
       * @default null
       */
      inputClass: null,

      /**
       * @private
       * Default recognizer setup when calling `Hammer()`
       * When creating a new Manager these will be skipped.
       * @type {Array}
       */
      preset: [],

      /**
       * @private
       * Some CSS properties can be used to improve the working of Hammer.
       * Add them to this method and they will be set when creating a new Manager.
       * @namespace
       */
      cssProps: {
        /**
         * @private
         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userSelect: "none",

        /**
         * @private
         * Disable the Windows Phone grippers when pressing an element.
         * @type {String}
         * @default 'none'
         */
        touchSelect: "none",

        /**
         * @private
         * Disables the default callout shown when you touch and hold a touch target.
         * On iOS, when you touch and hold a touch target such as a link, Safari displays
         * a callout containing information about the link. This property allows you to disable that callout.
         * @type {String}
         * @default 'none'
         */
        touchCallout: "none",

        /**
         * @private
         * Specifies whether zooming is enabled. Used by IE10>
         * @type {String}
         * @default 'none'
         */
        contentZooming: "none",

        /**
         * @private
         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userDrag: "none",

        /**
         * @private
         * Overrides the highlight color shown when the user taps a link or a JavaScript
         * clickable element in iOS. This property obeys the alpha value, if specified.
         * @type {String}
         * @default 'rgba(0,0,0,0)'
         */
        tapHighlightColor: "rgba(0,0,0,0)"
      }
    };

    var STOP = 1;
    var FORCED_STOP = 2;
    /**
     * @private
     * add/remove the css properties as defined in manager.options.cssProps
     * @param {Manager} manager
     * @param {Boolean} add
     */

    function toggleCssProps(manager, add) {
      var element = manager.element;

      if (!element.style) {
        return;
      }

      var prop;
      each(manager.options.cssProps, function (value, name) {
        prop = prefixed(element.style, name);

        if (add) {
          manager.oldCssProps[prop] = element.style[prop];
          element.style[prop] = value;
        } else {
          element.style[prop] = manager.oldCssProps[prop] || "";
        }
      });

      if (!add) {
        manager.oldCssProps = {};
      }
    }
    /**
     * @private
     * trigger dom event
     * @param {String} event
     * @param {Object} data
     */


    function triggerDomEvent(event, data) {
      var gestureEvent = document.createEvent("Event");
      gestureEvent.initEvent(event, true, true);
      gestureEvent.gesture = data;
      data.target.dispatchEvent(gestureEvent);
    }
    /**
    * @private
     * Manager
     * @param {HTMLElement} element
     * @param {Object} [options]
     * @constructor
     */


    var Manager =
    /*#__PURE__*/
    function () {
      function Manager(element, options) {
        var _this = this;

        this.options = assign$1({}, defaults, options || {});
        this.options.inputTarget = this.options.inputTarget || element;
        this.handlers = {};
        this.session = {};
        this.recognizers = [];
        this.oldCssProps = {};
        this.element = element;
        this.input = createInputInstance(this);
        this.touchAction = new TouchAction(this, this.options.touchAction);
        toggleCssProps(this, true);
        each(this.options.recognizers, function (item) {
          var recognizer = _this.add(new item[0](item[1]));

          item[2] && recognizer.recognizeWith(item[2]);
          item[3] && recognizer.requireFailure(item[3]);
        }, this);
      }
      /**
       * @private
       * set options
       * @param {Object} options
       * @returns {Manager}
       */


      var _proto = Manager.prototype;

      _proto.set = function set(options) {
        assign$1(this.options, options); // Options that need a little more setup

        if (options.touchAction) {
          this.touchAction.update();
        }

        if (options.inputTarget) {
          // Clean up existing event listeners and reinitialize
          this.input.destroy();
          this.input.target = options.inputTarget;
          this.input.init();
        }

        return this;
      };
      /**
       * @private
       * stop recognizing for this session.
       * This session will be discarded, when a new [input]start event is fired.
       * When forced, the recognizer cycle is stopped immediately.
       * @param {Boolean} [force]
       */


      _proto.stop = function stop(force) {
        this.session.stopped = force ? FORCED_STOP : STOP;
      };
      /**
       * @private
       * run the recognizers!
       * called by the inputHandler function on every movement of the pointers (touches)
       * it walks through all the recognizers and tries to detect the gesture that is being made
       * @param {Object} inputData
       */


      _proto.recognize = function recognize(inputData) {
        var session = this.session;

        if (session.stopped) {
          return;
        } // run the touch-action polyfill


        this.touchAction.preventDefaults(inputData);
        var recognizer;
        var recognizers = this.recognizers; // this holds the recognizer that is being recognized.
        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
        // if no recognizer is detecting a thing, it is set to `null`

        var curRecognizer = session.curRecognizer; // reset when the last recognizer is recognized
        // or when we're in a new session

        if (!curRecognizer || curRecognizer && curRecognizer.state & STATE_RECOGNIZED) {
          session.curRecognizer = null;
          curRecognizer = null;
        }

        var i = 0;

        while (i < recognizers.length) {
          recognizer = recognizers[i]; // find out if we are allowed try to recognize the input for this one.
          // 1.   allow if the session is NOT forced stopped (see the .stop() method)
          // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
          //      that is being recognized.
          // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
          //      this can be setup with the `recognizeWith()` method on the recognizer.

          if (session.stopped !== FORCED_STOP && ( // 1
          !curRecognizer || recognizer === curRecognizer || // 2
          recognizer.canRecognizeWith(curRecognizer))) {
            // 3
            recognizer.recognize(inputData);
          } else {
            recognizer.reset();
          } // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
          // current active recognizer. but only if we don't already have an active recognizer


          if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
            session.curRecognizer = recognizer;
            curRecognizer = recognizer;
          }

          i++;
        }
      };
      /**
       * @private
       * get a recognizer by its event name.
       * @param {Recognizer|String} recognizer
       * @returns {Recognizer|Null}
       */


      _proto.get = function get(recognizer) {
        if (recognizer instanceof Recognizer) {
          return recognizer;
        }

        var recognizers = this.recognizers;

        for (var i = 0; i < recognizers.length; i++) {
          if (recognizers[i].options.event === recognizer) {
            return recognizers[i];
          }
        }

        return null;
      };
      /**
       * @private add a recognizer to the manager
       * existing recognizers with the same event name will be removed
       * @param {Recognizer} recognizer
       * @returns {Recognizer|Manager}
       */


      _proto.add = function add(recognizer) {
        if (invokeArrayArg(recognizer, "add", this)) {
          return this;
        } // remove existing


        var existing = this.get(recognizer.options.event);

        if (existing) {
          this.remove(existing);
        }

        this.recognizers.push(recognizer);
        recognizer.manager = this;
        this.touchAction.update();
        return recognizer;
      };
      /**
       * @private
       * remove a recognizer by name or instance
       * @param {Recognizer|String} recognizer
       * @returns {Manager}
       */


      _proto.remove = function remove(recognizer) {
        if (invokeArrayArg(recognizer, "remove", this)) {
          return this;
        }

        var targetRecognizer = this.get(recognizer); // let's make sure this recognizer exists

        if (recognizer) {
          var recognizers = this.recognizers;
          var index = inArray(recognizers, targetRecognizer);

          if (index !== -1) {
            recognizers.splice(index, 1);
            this.touchAction.update();
          }
        }

        return this;
      };
      /**
       * @private
       * bind event
       * @param {String} events
       * @param {Function} handler
       * @returns {EventEmitter} this
       */


      _proto.on = function on(events, handler) {
        if (events === undefined || handler === undefined) {
          return this;
        }

        var handlers = this.handlers;
        each(splitStr(events), function (event) {
          handlers[event] = handlers[event] || [];
          handlers[event].push(handler);
        });
        return this;
      };
      /**
       * @private unbind event, leave emit blank to remove all handlers
       * @param {String} events
       * @param {Function} [handler]
       * @returns {EventEmitter} this
       */


      _proto.off = function off(events, handler) {
        if (events === undefined) {
          return this;
        }

        var handlers = this.handlers;
        each(splitStr(events), function (event) {
          if (!handler) {
            delete handlers[event];
          } else {
            handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
          }
        });
        return this;
      };
      /**
       * @private emit event to the listeners
       * @param {String} event
       * @param {Object} data
       */


      _proto.emit = function emit(event, data) {
        // we also want to trigger dom events
        if (this.options.domEvents) {
          triggerDomEvent(event, data);
        } // no handlers, so skip it all


        var handlers = this.handlers[event] && this.handlers[event].slice();

        if (!handlers || !handlers.length) {
          return;
        }

        data.type = event;

        data.preventDefault = function () {
          data.srcEvent.preventDefault();
        };

        var i = 0;

        while (i < handlers.length) {
          handlers[i](data);
          i++;
        }
      };
      /**
       * @private
       * destroy the manager and unbinds all events
       * it doesn't unbind dom events, that is the user own responsibility
       */


      _proto.destroy = function destroy() {
        this.element && toggleCssProps(this, false);
        this.handlers = {};
        this.session = {};
        this.input.destroy();
        this.element = null;
      };

      return Manager;
    }();

    /**
     * @private
     * This recognizer is just used as a base for the simple attribute recognizers.
     * @constructor
     * @extends Recognizer
     */

    var AttrRecognizer =
    /*#__PURE__*/
    function (_Recognizer) {
      _inheritsLoose(AttrRecognizer, _Recognizer);

      function AttrRecognizer(options) {
        if (options === void 0) {
          options = {};
        }

        return _Recognizer.call(this, _extends({
          pointers: 1
        }, options)) || this;
      }
      /**
       * @private
       * Used to check if it the recognizer receives valid input, like input.distance > 10.
       * @memberof AttrRecognizer
       * @param {Object} input
       * @returns {Boolean} recognized
       */


      var _proto = AttrRecognizer.prototype;

      _proto.attrTest = function attrTest(input) {
        var optionPointers = this.options.pointers;
        return optionPointers === 0 || input.pointers.length === optionPointers;
      };
      /**
       * @private
       * Process the input and return the state for the recognizer
       * @memberof AttrRecognizer
       * @param {Object} input
       * @returns {*} State
       */


      _proto.process = function process(input) {
        var state = this.state;
        var eventType = input.eventType;
        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
        var isValid = this.attrTest(input); // on cancel input and we've recognized before, return STATE_CANCELLED

        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
          return state | STATE_CANCELLED;
        } else if (isRecognized || isValid) {
          if (eventType & INPUT_END) {
            return state | STATE_ENDED;
          } else if (!(state & STATE_BEGAN)) {
            return STATE_BEGAN;
          }

          return state | STATE_CHANGED;
        }

        return STATE_FAILED;
      };

      return AttrRecognizer;
    }(Recognizer);

    /**
     * @private
     * Pinch
     * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
     * @constructor
     * @extends AttrRecognizer
     */

    var PinchRecognizer =
    /*#__PURE__*/
    function (_AttrRecognizer) {
      _inheritsLoose(PinchRecognizer, _AttrRecognizer);

      function PinchRecognizer(options) {
        if (options === void 0) {
          options = {};
        }

        return _AttrRecognizer.call(this, _extends({
          event: 'pinch',
          threshold: 0,
          pointers: 2
        }, options)) || this;
      }

      var _proto = PinchRecognizer.prototype;

      _proto.getTouchAction = function getTouchAction() {
        return [TOUCH_ACTION_NONE];
      };

      _proto.attrTest = function attrTest(input) {
        return _AttrRecognizer.prototype.attrTest.call(this, input) && (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
      };

      _proto.emit = function emit(input) {
        if (input.scale !== 1) {
          var inOut = input.scale < 1 ? 'in' : 'out';
          input.additionalEvent = this.options.event + inOut;
        }

        _AttrRecognizer.prototype.emit.call(this, input);
      };

      return PinchRecognizer;
    }(AttrRecognizer);

    /*
    Copyright (c) 2017 NAVER Corp.
    @egjs/axes project is licensed under the MIT license

    @egjs/axes JavaScript library
    https://github.com/naver/egjs-axes

    @version 2.5.13
    */

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
    var extendStatics$2 = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    };

    function __extends$2(d, b) {
      extendStatics$2(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign$1 = Object.assign || function __assign(t) {
      for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];

        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }

      return t;
    };

    /* eslint-disable no-new-func, no-nested-ternary */
    var win$1;

    if (typeof window === "undefined") {
      // window is undefined in node.js
      win$1 = {};
    } else {
      win$1 = window;
    }

    // export const DIRECTION_NONE = 1;
    var FIXED_DIGIT = 100000;
    var TRANSFORM = function () {
      if (typeof document === "undefined") {
        return "";
      }

      var bodyStyle = (document.head || document.getElementsByTagName("head")[0]).style;
      var target = ["transform", "webkitTransform", "msTransform", "mozTransform"];

      for (var i = 0, len = target.length; i < len; i++) {
        if (target[i] in bodyStyle) {
          return target[i];
        }
      }

      return "";
    }();

    function toArray$1(nodes) {
      // const el = Array.prototype.slice.call(nodes);
      // for IE8
      var el = [];

      for (var i = 0, len = nodes.length; i < len; i++) {
        el.push(nodes[i]);
      }

      return el;
    }
    function $(param, multi) {
      if (multi === void 0) {
        multi = false;
      }

      var el;

      if (typeof param === "string") {
        // String (HTML, Selector)
        // check if string is HTML tag format
        var match = param.match(/^<([a-z]+)\s*([^>]*)>/); // creating element

        if (match) {
          // HTML
          var dummy = document.createElement("div");
          dummy.innerHTML = param;
          el = toArray$1(dummy.childNodes);
        } else {
          // Selector
          el = toArray$1(document.querySelectorAll(param));
        }

        if (!multi) {
          el = el.length >= 1 ? el[0] : undefined;
        }
      } else if (param === win$1) {
        // window
        el = param;
      } else if (param.nodeName && (param.nodeType === 1 || param.nodeType === 9)) {
        // HTMLElement, Document
        el = param;
      } else if ("jQuery" in win$1 && param instanceof jQuery || param.constructor.prototype.jquery) {
        // jQuery
        el = multi ? param.toArray() : param.get(0);
      } else if (Array.isArray(param)) {
        el = param.map(function (v) {
          return $(v);
        });

        if (!multi) {
          el = el.length >= 1 ? el[0] : undefined;
        }
      }

      return el;
    }
    var raf = win$1.requestAnimationFrame || win$1.webkitRequestAnimationFrame;
    var caf = win$1.cancelAnimationFrame || win$1.webkitCancelAnimationFrame;

    if (raf && !caf) {
      var keyInfo_1 = {};
      var oldraf_1 = raf;

      raf = function (callback) {
        function wrapCallback(timestamp) {
          if (keyInfo_1[key]) {
            callback(timestamp);
          }
        }

        var key = oldraf_1(wrapCallback);
        keyInfo_1[key] = true;
        return key;
      };

      caf = function (key) {
        delete keyInfo_1[key];
      };
    } else if (!(raf && caf)) {
      raf = function (callback) {
        return win$1.setTimeout(function () {
          callback(win$1.performance && win$1.performance.now && win$1.performance.now() || new Date().getTime());
        }, 16);
      };

      caf = win$1.clearTimeout;
    }
    /**
     * A polyfill for the window.requestAnimationFrame() method.
     * @see  https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
     * @private
     */


    function requestAnimationFrame(fp) {
      return raf(fp);
    }
    /**
    * A polyfill for the window.cancelAnimationFrame() method. It cancels an animation executed through a call to the requestAnimationFrame() method.
    * @param {Number} key −	The ID value returned through a call to the requestAnimationFrame() method. <ko>requestAnimationFrame() 메서드가 반환한 아이디 값</ko>
    * @see  https://developer.mozilla.org/en-US/docs/Web/API/Window/cancelAnimationFrame
    * @private
    */

    function cancelAnimationFrame(key) {
      caf(key);
    }
    function mapToFixed(obj) {
      return map(obj, function (value) {
        return toFixed(value);
      });
    }
    function map(obj, callback) {
      var tranformed = {};

      for (var k in obj) {
        k && (tranformed[k] = callback(obj[k], k));
      }

      return tranformed;
    }
    function filter(obj, callback) {
      var filtered = {};

      for (var k in obj) {
        k && callback(obj[k], k) && (filtered[k] = obj[k]);
      }

      return filtered;
    }
    function every(obj, callback) {
      for (var k in obj) {
        if (k && !callback(obj[k], k)) {
          return false;
        }
      }

      return true;
    }
    function equal(target, base) {
      return every(target, function (v, k) {
        return v === base[k];
      });
    }
    function toFixed(num) {
      return Math.round(num * FIXED_DIGIT) / FIXED_DIGIT;
    }

    function getInsidePosition(destPos, range, circular, bounce) {
      var toDestPos = destPos;
      var targetRange = [circular[0] ? range[0] : bounce ? range[0] - bounce[0] : range[0], circular[1] ? range[1] : bounce ? range[1] + bounce[1] : range[1]];
      toDestPos = Math.max(targetRange[0], toDestPos);
      toDestPos = Math.min(targetRange[1], toDestPos);
      return +toFixed(toDestPos);
    } // determine outside

    function isOutside(pos, range) {
      return pos < range[0] || pos > range[1];
    }
    function getDuration(distance, deceleration) {
      var duration = Math.sqrt(distance / deceleration * 2); // when duration is under 100, then value is zero

      return duration < 100 ? 0 : duration;
    }
    function isCircularable(destPos, range, circular) {
      return circular[1] && destPos > range[1] || circular[0] && destPos < range[0];
    }
    function getCirculatedPos(pos, range, circular, isAccurate) {
      var toPos = pos;
      var min = range[0];
      var max = range[1];
      var length = max - min;

      if (circular[1] && pos > max) {
        // right
        toPos = (toPos - max) % length + min;
      }

      if (circular[0] && pos < min) {
        // left
        toPos = (toPos - min) % length + max;
      }

      return isAccurate ? toPos : +toFixed(toPos);
    }

    function minMax(value, min, max) {
      return Math.max(Math.min(value, max), min);
    }

    var AnimationManager =
    /*#__PURE__*/
    function () {
      function AnimationManager(_a) {
        var options = _a.options,
            itm = _a.itm,
            em = _a.em,
            axm = _a.axm;
        this.options = options;
        this.itm = itm;
        this.em = em;
        this.axm = axm;
        this.animationEnd = this.animationEnd.bind(this);
      }

      var __proto = AnimationManager.prototype;

      __proto.getDuration = function (depaPos, destPos, wishDuration) {
        var _this = this;

        var duration;

        if (typeof wishDuration !== "undefined") {
          duration = wishDuration;
        } else {
          var durations_1 = map(destPos, function (v, k) {
            return getDuration(Math.abs(v - depaPos[k]), _this.options.deceleration);
          });
          duration = Object.keys(durations_1).reduce(function (max, v) {
            return Math.max(max, durations_1[v]);
          }, -Infinity);
        }

        return minMax(duration, this.options.minimumDuration, this.options.maximumDuration);
      };

      __proto.createAnimationParam = function (pos, duration, option) {
        var depaPos = this.axm.get();
        var destPos = pos;
        var inputEvent = option && option.event || null;
        return {
          depaPos: depaPos,
          destPos: destPos,
          duration: minMax(duration, this.options.minimumDuration, this.options.maximumDuration),
          delta: this.axm.getDelta(depaPos, destPos),
          inputEvent: inputEvent,
          input: option && option.input || null,
          isTrusted: !!inputEvent,
          done: this.animationEnd
        };
      };

      __proto.grab = function (axes, option) {
        if (this._animateParam && axes.length) {
          var orgPos_1 = this.axm.get(axes);
          var pos = this.axm.map(orgPos_1, function (v, opt) {
            return getCirculatedPos(v, opt.range, opt.circular, false);
          });

          if (!every(pos, function (v, k) {
            return orgPos_1[k] === v;
          })) {
            this.em.triggerChange(pos, false, orgPos_1, option, !!option);
          }

          this._animateParam = null;
          this._raf && cancelAnimationFrame(this._raf);
          this._raf = null;
          this.em.triggerAnimationEnd(!!(option && option.event));
        }
      };

      __proto.getEventInfo = function () {
        if (this._animateParam && this._animateParam.input && this._animateParam.inputEvent) {
          return {
            input: this._animateParam.input,
            event: this._animateParam.inputEvent
          };
        } else {
          return null;
        }
      };

      __proto.restore = function (option) {
        var pos = this.axm.get();
        var destPos = this.axm.map(pos, function (v, opt) {
          return Math.min(opt.range[1], Math.max(opt.range[0], v));
        });
        this.animateTo(destPos, this.getDuration(pos, destPos), option);
      };

      __proto.animationEnd = function () {
        var beforeParam = this.getEventInfo();
        this._animateParam = null; // for Circular

        var circularTargets = this.axm.filter(this.axm.get(), function (v, opt) {
          return isCircularable(v, opt.range, opt.circular);
        });
        Object.keys(circularTargets).length > 0 && this.setTo(this.axm.map(circularTargets, function (v, opt) {
          return getCirculatedPos(v, opt.range, opt.circular, false);
        }));
        this.itm.setInterrupt(false);
        this.em.triggerAnimationEnd(!!beforeParam);

        if (this.axm.isOutside()) {
          this.restore(beforeParam);
        } else {
          this.finish(!!beforeParam);
        }
      };

      __proto.finish = function (isTrusted) {
        this._animateParam = null;
        this.itm.setInterrupt(false);
        this.em.triggerFinish(isTrusted);
      };

      __proto.animateLoop = function (param, complete) {
        if (param.duration) {
          this._animateParam = __assign$1({}, param);
          var info_1 = this._animateParam;
          var self_1 = this;
          var prevPos_1 = info_1.depaPos;
          var prevEasingPer_1 = 0;
          var directions_1 = map(prevPos_1, function (value, key) {
            return value <= info_1.destPos[key] ? 1 : -1;
          });
          var prevTime_1 = new Date().getTime();
          info_1.startTime = prevTime_1;

          (function loop() {
            self_1._raf = null;
            var currentTime = new Date().getTime();
            var easingPer = self_1.easing((currentTime - info_1.startTime) / param.duration);
            var toPos = map(prevPos_1, function (pos, key) {
              return pos + info_1.delta[key] * (easingPer - prevEasingPer_1);
            });
            toPos = self_1.axm.map(toPos, function (pos, options, key) {
              // fix absolute position to relative position
              // fix the bouncing phenomenon by changing the range.
              var nextPos = getCirculatedPos(pos, options.range, options.circular, true);

              if (pos !== nextPos) {
                // circular
                param.destPos[key] += -directions_1[key] * (options.range[1] - options.range[0]);
                prevPos_1[key] += -directions_1[key] * (options.range[1] - options.range[0]);
              }

              return nextPos;
            });
            var isCanceled = !self_1.em.triggerChange(toPos, false, mapToFixed(prevPos_1));
            prevPos_1 = toPos;
            prevTime_1 = currentTime;
            prevEasingPer_1 = easingPer;

            if (easingPer >= 1) {
              var destPos = param.destPos;

              if (!equal(destPos, self_1.axm.get(Object.keys(destPos)))) {
                self_1.em.triggerChange(destPos, true, mapToFixed(prevPos_1));
              }

              complete();
              return;
            } else if (isCanceled) {
              self_1.finish(false);
            } else {
              // animationEnd
              self_1._raf = requestAnimationFrame(loop);
            }
          })();
        } else {
          this.em.triggerChange(param.destPos, true);
          complete();
        }
      };

      __proto.getUserControll = function (param) {
        var userWish = param.setTo();
        userWish.destPos = this.axm.get(userWish.destPos);
        userWish.duration = minMax(userWish.duration, this.options.minimumDuration, this.options.maximumDuration);
        return userWish;
      };

      __proto.animateTo = function (destPos, duration, option) {
        var _this = this;

        var param = this.createAnimationParam(destPos, duration, option);

        var depaPos = __assign$1({}, param.depaPos);

        var retTrigger = this.em.triggerAnimationStart(param); // to control

        var userWish = this.getUserControll(param); // You can't stop the 'animationStart' event when 'circular' is true.

        if (!retTrigger && this.axm.every(userWish.destPos, function (v, opt) {
          return isCircularable(v, opt.range, opt.circular);
        })) {
          console.warn("You can't stop the 'animation' event when 'circular' is true.");
        }

        if (retTrigger && !equal(userWish.destPos, depaPos)) {
          var inputEvent = option && option.event || null;
          this.animateLoop({
            depaPos: depaPos,
            destPos: userWish.destPos,
            duration: userWish.duration,
            delta: this.axm.getDelta(depaPos, userWish.destPos),
            isTrusted: !!inputEvent,
            inputEvent: inputEvent,
            input: option && option.input || null
          }, function () {
            return _this.animationEnd();
          });
        }
      };

      __proto.easing = function (p) {
        return p > 1 ? 1 : this.options.easing(p);
      };

      __proto.setTo = function (pos, duration) {
        if (duration === void 0) {
          duration = 0;
        }

        var axes = Object.keys(pos);
        this.grab(axes);
        var orgPos = this.axm.get(axes);

        if (equal(pos, orgPos)) {
          return this;
        }

        this.itm.setInterrupt(true);
        var movedPos = filter(pos, function (v, k) {
          return orgPos[k] !== v;
        });

        if (!Object.keys(movedPos).length) {
          return this;
        }

        movedPos = this.axm.map(movedPos, function (v, opt) {
          var range = opt.range,
              circular = opt.circular;

          if (circular && (circular[0] || circular[1])) {
            return v;
          } else {
            return getInsidePosition(v, range, circular);
          }
        });

        if (equal(movedPos, orgPos)) {
          return this;
        }

        if (duration > 0) {
          this.animateTo(movedPos, duration);
        } else {
          this.em.triggerChange(movedPos);
          this.finish(false);
        }

        return this;
      };

      __proto.setBy = function (pos, duration) {
        if (duration === void 0) {
          duration = 0;
        }

        return this.setTo(map(this.axm.get(Object.keys(pos)), function (v, k) {
          return v + pos[k];
        }), duration);
      };

      return AnimationManager;
    }();

    var EventManager =
    /*#__PURE__*/
    function () {
      function EventManager(axes) {
        this.axes = axes;
      }
      /**
       * This event is fired when a user holds an element on the screen of the device.
       * @ko 사용자가 기기의 화면에 손을 대고 있을 때 발생하는 이벤트
       * @name eg.Axes#hold
       * @event
       * @type {object} The object of data to be sent when the event is fired<ko>이벤트가 발생할 때 전달되는 데이터 객체</ko>
       * @property {Object.<string, number>} pos coordinate <ko>좌표 정보</ko>
       * @property {Object} input The instance of inputType where the event occurred<ko>이벤트가 발생한 inputType 인스턴스</ko>
       * @property {Object} inputEvent The event object received from inputType <ko>inputType으로 부터 받은 이벤트 객체</ko>
       * @property {Boolean} isTrusted Returns true if an event was generated by the user action, or false if it was caused by a script or API call <ko>사용자의 액션에 의해 이벤트가 발생하였으면 true, 스크립트나 API호출에 의해 발생하였을 경우에는 false를 반환한다.</ko>
       *
       * @example
       * const axes = new eg.Axes({
       *   "x": {
       *      range: [0, 100]
       *   },
       *   "zoom": {
       *      range: [50, 30]
       *   }
       * }).on("hold", function(event) {
       *   // event.pos
       *   // event.input
       *   // event.inputEvent
       *   // isTrusted
       * });
       */


      var __proto = EventManager.prototype;

      __proto.triggerHold = function (pos, option) {
        this.axes.trigger("hold", {
          pos: pos,
          input: option.input || null,
          inputEvent: option.event || null,
          isTrusted: true
        });
      };
      /**
       * Specifies the coordinates to move after the 'change' event. It works when the holding value of the change event is true.
       * @ko 'change' 이벤트 이후 이동할 좌표를 지정한다. change이벤트의 holding 값이 true일 경우에 동작한다
       * @name set
      * @function
       * @param {Object.<string, number>} pos The coordinate to move to <ko>이동할 좌표</ko>
       * @example
       * const axes = new eg.Axes({
       *   "x": {
       *      range: [0, 100]
       *   },
       *   "zoom": {
       *      range: [50, 30]
       *   }
       * }).on("change", function(event) {
       *   event.holding && event.set({x: 10});
       * });
       */

      /** Specifies the animation coordinates to move after the 'release' or 'animationStart' events.
       * @ko 'release' 또는 'animationStart' 이벤트 이후 이동할 좌표를 지정한다.
       * @name setTo
      * @function
       * @param {Object.<string, number>} pos The coordinate to move to <ko>이동할 좌표</ko>
       * @param {Number} [duration] Duration of the animation (unit: ms) <ko>애니메이션 진행 시간(단위: ms)</ko>
       * @example
       * const axes = new eg.Axes({
       *   "x": {
       *      range: [0, 100]
       *   },
       *   "zoom": {
       *      range: [50, 30]
       *   }
       * }).on("animationStart", function(event) {
       *   event.setTo({x: 10}, 2000);
       * });
       */

      /**
       * This event is fired when a user release an element on the screen of the device.
       * @ko 사용자가 기기의 화면에서 손을 뗐을 때 발생하는 이벤트
       * @name eg.Axes#release
       * @event
       * @type {object} The object of data to be sent when the event is fired<ko>이벤트가 발생할 때 전달되는 데이터 객체</ko>
       * @property {Object.<string, number>} depaPos The coordinates when releasing an element<ko>손을 뗐을 때의 좌표 </ko>
       * @property {Object.<string, number>} destPos The coordinates to move to after releasing an element<ko>손을 뗀 뒤에 이동할 좌표</ko>
       * @property {Object.<string, number>} delta  The movement variation of coordinate <ko>좌표의 변화량</ko>
       * @property {Object} inputEvent The event object received from inputType <ko>inputType으로 부터 받은 이벤트 객체</ko>
       * @property {Object} input The instance of inputType where the event occurred<ko>이벤트가 발생한 inputType 인스턴스</ko>
       * @property {setTo} setTo Specifies the animation coordinates to move after the event <ko>이벤트 이후 이동할 애니메이션 좌표를 지정한다</ko>
       * @property {Boolean} isTrusted Returns true if an event was generated by the user action, or false if it was caused by a script or API call <ko>사용자의 액션에 의해 이벤트가 발생하였으면 true, 스크립트나 API호출에 의해 발생하였을 경우에는 false를 반환한다.</ko>
       *
       * @example
       * const axes = new eg.Axes({
       *   "x": {
       *      range: [0, 100]
       *   },
       *   "zoom": {
       *      range: [50, 30]
       *   }
       * }).on("release", function(event) {
       *   // event.depaPos
       *   // event.destPos
       *   // event.delta
       *   // event.input
       *   // event.inputEvent
       *   // event.setTo
       *   // event.isTrusted
       *
       *   // if you want to change the animation coordinates to move after the 'release' event.
       *   event.setTo({x: 10}, 2000);
       * });
       */


      __proto.triggerRelease = function (param) {
        param.setTo = this.createUserControll(param.destPos, param.duration);
        this.axes.trigger("release", param);
      };
      /**
       * This event is fired when coordinate changes.
       * @ko 좌표가 변경됐을 때 발생하는 이벤트
       * @name eg.Axes#change
       * @event
       * @type {object} The object of data to be sent when the event is fired <ko>이벤트가 발생할 때 전달되는 데이터 객체</ko>
       * @property {Object.<string, number>} pos  The coordinate <ko>좌표</ko>
       * @property {Object.<string, number>} delta  The movement variation of coordinate <ko>좌표의 변화량</ko>
       * @property {Boolean} holding Indicates whether a user holds an element on the screen of the device.<ko>사용자가 기기의 화면을 누르고 있는지 여부</ko>
       * @property {Object} input The instance of inputType where the event occurred. If the value is changed by animation, it returns 'null'.<ko>이벤트가 발생한 inputType 인스턴스. 애니메이션에 의해 값이 변경될 경우에는 'null'을 반환한다.</ko>
       * @property {Object} inputEvent The event object received from inputType. If the value is changed by animation, it returns 'null'.<ko>inputType으로 부터 받은 이벤트 객체. 애니메이션에 의해 값이 변경될 경우에는 'null'을 반환한다.</ko>
       * @property {set} set Specifies the coordinates to move after the event. It works when the holding value is true <ko>이벤트 이후 이동할 좌표를 지정한다. holding 값이 true일 경우에 동작한다.</ko>
       * @property {Boolean} isTrusted Returns true if an event was generated by the user action, or false if it was caused by a script or API call <ko>사용자의 액션에 의해 이벤트가 발생하였으면 true, 스크립트나 API호출에 의해 발생하였을 경우에는 false를 반환한다.</ko>
       *
       * @example
       * const axes = new eg.Axes({
       *   "x": {
       *      range: [0, 100]
       *   },
       *   "zoom": {
       *      range: [50, 30]
       *   }
       * }).on("change", function(event) {
       *   // event.pos
       *   // event.delta
       *   // event.input
       *   // event.inputEvent
       *   // event.holding
       *   // event.set
       *   // event.isTrusted
       *
       *   // if you want to change the coordinates to move after the 'change' event.
       *   // it works when the holding value of the change event is true.
       *   event.holding && event.set({x: 10});
       * });
       */


      __proto.triggerChange = function (pos, isAccurate, depaPos, option, holding) {
        if (holding === void 0) {
          holding = false;
        }

        var am = this.am;
        var axm = am.axm;
        var eventInfo = am.getEventInfo();
        var moveTo = axm.moveTo(pos, isAccurate, depaPos);
        var inputEvent = option && option.event || eventInfo && eventInfo.event || null;
        var param = {
          pos: moveTo.pos,
          delta: moveTo.delta,
          holding: holding,
          inputEvent: inputEvent,
          isTrusted: !!inputEvent,
          input: option && option.input || eventInfo && eventInfo.input || null,
          set: inputEvent ? this.createUserControll(moveTo.pos) : function () {}
        };
        var result = this.axes.trigger("change", param);
        inputEvent && axm.set(param.set()["destPos"]);
        return result;
      };
      /**
       * This event is fired when animation starts.
       * @ko 에니메이션이 시작할 때 발생한다.
       * @name eg.Axes#animationStart
       * @event
       * @type {object} The object of data to be sent when the event is fired<ko>이벤트가 발생할 때 전달되는 데이터 객체</ko>
       * @property {Object.<string, number>} depaPos The coordinates when animation starts<ko>애니메이션이 시작 되었을 때의 좌표 </ko>
       * @property {Object.<string, number>} destPos The coordinates to move to. If you change this value, you can run the animation<ko>이동할 좌표. 이값을 변경하여 애니메이션을 동작시킬수 있다</ko>
       * @property {Object.<string, number>} delta  The movement variation of coordinate <ko>좌표의 변화량</ko>
       * @property {Number} duration Duration of the animation (unit: ms). If you change this value, you can control the animation duration time.<ko>애니메이션 진행 시간(단위: ms). 이값을 변경하여 애니메이션의 이동시간을 조절할 수 있다.</ko>
       * @property {Object} input The instance of inputType where the event occurred. If the value is changed by animation, it returns 'null'.<ko>이벤트가 발생한 inputType 인스턴스. 애니메이션에 의해 값이 변경될 경우에는 'null'을 반환한다.</ko>
       * @property {Object} inputEvent The event object received from inputType <ko>inputType으로 부터 받은 이벤트 객체</ko>
       * @property {setTo} setTo Specifies the animation coordinates to move after the event <ko>이벤트 이후 이동할 애니메이션 좌표를 지정한다</ko>
       * @property {Boolean} isTrusted Returns true if an event was generated by the user action, or false if it was caused by a script or API call <ko>사용자의 액션에 의해 이벤트가 발생하였으면 true, 스크립트나 API호출에 의해 발생하였을 경우에는 false를 반환한다.</ko>
       *
       * @example
       * const axes = new eg.Axes({
       *   "x": {
       *      range: [0, 100]
       *   },
       *   "zoom": {
       *      range: [50, 30]
       *   }
       * }).on("release", function(event) {
       *   // event.depaPos
       *   // event.destPos
       *   // event.delta
       *   // event.input
       *   // event.inputEvent
       *   // event.setTo
       *   // event.isTrusted
       *
       *   // if you want to change the animation coordinates to move after the 'animationStart' event.
       *   event.setTo({x: 10}, 2000);
       * });
       */


      __proto.triggerAnimationStart = function (param) {
        param.setTo = this.createUserControll(param.destPos, param.duration);
        return this.axes.trigger("animationStart", param);
      };
      /**
       * This event is fired when animation ends.
       * @ko 에니메이션이 끝났을 때 발생한다.
       * @name eg.Axes#animationEnd
       * @event
       * @type {object} The object of data to be sent when the event is fired<ko>이벤트가 발생할 때 전달되는 데이터 객체</ko>
       * @property {Boolean} isTrusted Returns true if an event was generated by the user action, or false if it was caused by a script or API call <ko>사용자의 액션에 의해 이벤트가 발생하였으면 true, 스크립트나 API호출에 의해 발생하였을 경우에는 false를 반환한다.</ko>
       *
       * @example
       * const axes = new eg.Axes({
       *   "x": {
       *      range: [0, 100]
       *   },
       *   "zoom": {
       *      range: [50, 30]
       *   }
       * }).on("animationEnd", function(event) {
       *   // event.isTrusted
       * });
       */


      __proto.triggerAnimationEnd = function (isTrusted) {
        if (isTrusted === void 0) {
          isTrusted = false;
        }

        this.axes.trigger("animationEnd", {
          isTrusted: isTrusted
        });
      };
      /**
       * This event is fired when all actions have been completed.
       * @ko 에니메이션이 끝났을 때 발생한다.
       * @name eg.Axes#finish
       * @event
       * @type {object} The object of data to be sent when the event is fired<ko>이벤트가 발생할 때 전달되는 데이터 객체</ko>
       * @property {Boolean} isTrusted Returns true if an event was generated by the user action, or false if it was caused by a script or API call <ko>사용자의 액션에 의해 이벤트가 발생하였으면 true, 스크립트나 API호출에 의해 발생하였을 경우에는 false를 반환한다.</ko>
       *
       * @example
       * const axes = new eg.Axes({
       *   "x": {
       *      range: [0, 100]
       *   },
       *   "zoom": {
       *      range: [50, 30]
       *   }
       * }).on("finish", function(event) {
       *   // event.isTrusted
       * });
       */


      __proto.triggerFinish = function (isTrusted) {
        if (isTrusted === void 0) {
          isTrusted = false;
        }

        this.axes.trigger("finish", {
          isTrusted: isTrusted
        });
      };

      __proto.createUserControll = function (pos, duration) {
        if (duration === void 0) {
          duration = 0;
        } // to controll


        var userControl = {
          destPos: __assign$1({}, pos),
          duration: duration
        };
        return function (toPos, userDuration) {
          toPos && (userControl.destPos = __assign$1({}, toPos));
          userDuration !== undefined && (userControl.duration = userDuration);
          return userControl;
        };
      };

      __proto.setAnimationManager = function (am) {
        this.am = am;
      };

      __proto.destroy = function () {
        this.axes.off();
      };

      return EventManager;
    }();

    var InterruptManager =
    /*#__PURE__*/
    function () {
      function InterruptManager(options) {
        this.options = options;
        this._prevented = false; //  check whether the animation event was prevented
      }

      var __proto = InterruptManager.prototype;

      __proto.isInterrupting = function () {
        // when interruptable is 'true', return value is always 'true'.
        return this.options.interruptable || this._prevented;
      };

      __proto.isInterrupted = function () {
        return !this.options.interruptable && this._prevented;
      };

      __proto.setInterrupt = function (prevented) {
        !this.options.interruptable && (this._prevented = prevented);
      };

      return InterruptManager;
    }();

    var AxisManager =
    /*#__PURE__*/
    function () {
      function AxisManager(axis, options) {
        var _this = this;

        this.axis = axis;
        this.options = options;

        this._complementOptions();

        this._pos = Object.keys(this.axis).reduce(function (acc, v) {
          acc[v] = _this.axis[v].range[0];
          return acc;
        }, {});
      }
      /**
         * set up 'css' expression
         * @private
         */


      var __proto = AxisManager.prototype;

      __proto._complementOptions = function () {
        var _this = this;

        Object.keys(this.axis).forEach(function (axis) {
          _this.axis[axis] = __assign$1({
            range: [0, 100],
            bounce: [0, 0],
            circular: [false, false]
          }, _this.axis[axis]);
          ["bounce", "circular"].forEach(function (v) {
            var axisOption = _this.axis;
            var key = axisOption[axis][v];

            if (/string|number|boolean/.test(typeof key)) {
              axisOption[axis][v] = [key, key];
            }
          });
        });
      };

      __proto.getDelta = function (depaPos, destPos) {
        var fullDepaPos = this.get(depaPos);
        return map(this.get(destPos), function (v, k) {
          return v - fullDepaPos[k];
        });
      };

      __proto.get = function (axes) {
        var _this = this;

        if (axes && Array.isArray(axes)) {
          return axes.reduce(function (acc, v) {
            if (v && v in _this._pos) {
              acc[v] = _this._pos[v];
            }

            return acc;
          }, {});
        } else {
          return __assign$1({}, this._pos, axes || {});
        }
      };

      __proto.moveTo = function (pos, isAccurate, depaPos) {
        if (depaPos === void 0) {
          depaPos = this._pos;
        }

        var delta = map(this._pos, function (v, key) {
          return key in pos && key in depaPos ? pos[key] - depaPos[key] : 0;
        });
        this.set(this.map(pos, function (v, opt) {
          return opt ? getCirculatedPos(v, opt.range, opt.circular, isAccurate) : 0;
        }));
        return {
          pos: __assign$1({}, this._pos),
          delta: delta
        };
      };

      __proto.set = function (pos) {
        for (var k in pos) {
          if (k && k in this._pos) {
            this._pos[k] = pos[k];
          }
        }
      };

      __proto.every = function (pos, callback) {
        var axisOptions = this.axis;
        return every(pos, function (value, key) {
          return callback(value, axisOptions[key], key);
        });
      };

      __proto.filter = function (pos, callback) {
        var axisOptions = this.axis;
        return filter(pos, function (value, key) {
          return callback(value, axisOptions[key], key);
        });
      };

      __proto.map = function (pos, callback) {
        var axisOptions = this.axis;
        return map(pos, function (value, key) {
          return callback(value, axisOptions[key], key);
        });
      };

      __proto.isOutside = function (axes) {
        return !this.every(axes ? this.get(axes) : this._pos, function (v, opt) {
          return !isOutside(v, opt.range);
        });
      };

      return AxisManager;
    }();

    var InputObserver =
    /*#__PURE__*/
    function () {
      function InputObserver(_a) {
        var options = _a.options,
            itm = _a.itm,
            em = _a.em,
            axm = _a.axm,
            am = _a.am;
        this.isOutside = false;
        this.moveDistance = null;
        this.isStopped = false;
        this.options = options;
        this.itm = itm;
        this.em = em;
        this.axm = axm;
        this.am = am;
      } // when move pointer is held in outside


      var __proto = InputObserver.prototype;

      __proto.atOutside = function (pos) {
        var _this = this;

        if (this.isOutside) {
          return this.axm.map(pos, function (v, opt) {
            var tn = opt.range[0] - opt.bounce[0];
            var tx = opt.range[1] + opt.bounce[1];
            return v > tx ? tx : v < tn ? tn : v;
          });
        } else {
          // when start pointer is held in inside
          // get a initialization slope value to prevent smooth animation.
          var initSlope_1 = this.am.easing(0.00001) / 0.00001;
          return this.axm.map(pos, function (v, opt) {
            var min = opt.range[0];
            var max = opt.range[1];
            var out = opt.bounce;
            var circular = opt.circular;

            if (circular && (circular[0] || circular[1])) {
              return v;
            } else if (v < min) {
              // left
              return min - _this.am.easing((min - v) / (out[0] * initSlope_1)) * out[0];
            } else if (v > max) {
              // right
              return max + _this.am.easing((v - max) / (out[1] * initSlope_1)) * out[1];
            }

            return v;
          });
        }
      };

      __proto.get = function (input) {
        return this.axm.get(input.axes);
      };

      __proto.hold = function (input, event) {
        if (this.itm.isInterrupted() || !input.axes.length) {
          return;
        }

        var changeOption = {
          input: input,
          event: event
        };
        this.isStopped = false;
        this.itm.setInterrupt(true);
        this.am.grab(input.axes, changeOption);
        !this.moveDistance && this.em.triggerHold(this.axm.get(), changeOption);
        this.isOutside = this.axm.isOutside(input.axes);
        this.moveDistance = this.axm.get(input.axes);
      };

      __proto.change = function (input, event, offset) {
        if (this.isStopped || !this.itm.isInterrupting() || this.axm.every(offset, function (v) {
          return v === 0;
        })) {
          return;
        }

        var depaPos = this.moveDistance || this.axm.get(input.axes);
        var destPos; // for outside logic

        destPos = map(depaPos, function (v, k) {
          return v + (offset[k] || 0);
        });
        this.moveDistance && (this.moveDistance = destPos); // from outside to inside

        if (this.isOutside && this.axm.every(depaPos, function (v, opt) {
          return !isOutside(v, opt.range);
        })) {
          this.isOutside = false;
        }

        depaPos = this.atOutside(depaPos);
        destPos = this.atOutside(destPos);
        var isCanceled = !this.em.triggerChange(destPos, false, depaPos, {
          input: input,
          event: event
        }, true);

        if (isCanceled) {
          this.isStopped = true;
          this.moveDistance = null;
          this.am.finish(false);
        }
      };

      __proto.release = function (input, event, offset, inputDuration) {
        if (this.isStopped || !this.itm.isInterrupting() || !this.moveDistance) {
          return;
        }

        var pos = this.axm.get(input.axes);
        var depaPos = this.axm.get();
        var destPos = this.axm.get(this.axm.map(offset, function (v, opt, k) {
          if (opt.circular && (opt.circular[0] || opt.circular[1])) {
            return pos[k] + v;
          } else {
            return getInsidePosition(pos[k] + v, opt.range, opt.circular, opt.bounce);
          }
        }));
        var duration = this.am.getDuration(destPos, pos, inputDuration);

        if (duration === 0) {
          destPos = __assign$1({}, depaPos);
        } // prepare params


        var param = {
          depaPos: depaPos,
          destPos: destPos,
          duration: duration,
          delta: this.axm.getDelta(depaPos, destPos),
          inputEvent: event,
          input: input,
          isTrusted: true
        };
        this.em.triggerRelease(param);
        this.moveDistance = null; // to contol

        var userWish = this.am.getUserControll(param);
        var isEqual = equal(userWish.destPos, depaPos);
        var changeOption = {
          input: input,
          event: event
        };

        if (isEqual || userWish.duration === 0) {
          !isEqual && this.em.triggerChange(userWish.destPos, false, depaPos, changeOption, true);
          this.itm.setInterrupt(false);

          if (this.axm.isOutside()) {
            this.am.restore(changeOption);
          } else {
            this.em.triggerFinish(true);
          }
        } else {
          this.am.animateTo(userWish.destPos, userWish.duration, changeOption);
        }
      };

      return InputObserver;
    }();

    /**
     * @typedef {Object} AxisOption The Axis information. The key of the axis specifies the name to use as the logical virtual coordinate system.
     * @ko 축 정보. 축의 키는 논리적인 가상 좌표계로 사용할 이름을 지정한다.
     * @property {Number[]} [range] The coordinate of range <ko>좌표 범위</ko>
     * @property {Number} [range.0=0] The coordinate of the minimum <ko>최소 좌표</ko>
     * @property {Number} [range.1=0] The coordinate of the maximum <ko>최대 좌표</ko>
     * @property {Number[]} [bounce] The size of bouncing area. The coordinates can exceed the coordinate area as much as the bouncing area based on user action. If the coordinates does not exceed the bouncing area when an element is dragged, the coordinates where bouncing effects are applied are retuned back into the coordinate area<ko>바운스 영역의 크기. 사용자의 동작에 따라 좌표가 좌표 영역을 넘어 바운스 영역의 크기만큼 더 이동할 수 있다. 사용자가 끌어다 놓는 동작을 했을 때 좌표가 바운스 영역에 있으면, 바운스 효과가 적용된 좌표가 다시 좌표 영역 안으로 들어온다</ko>
     * @property {Number} [bounce.0=0] The size of coordinate of the minimum area <ko>최소 좌표 바운스 영역의 크기</ko>
     * @property {Number} [bounce.1=0] The size of coordinate of the maximum area <ko>최대 좌표 바운스 영역의 크기</ko>
     * @property {Boolean[]} [circular] Indicates whether a circular element is available. If it is set to "true" and an element is dragged outside the coordinate area, the element will appear on the other side.<ko>순환 여부. 'true'로 설정한 방향의 좌표 영역 밖으로 엘리먼트가 이동하면 반대 방향에서 엘리먼트가 나타난다</ko>
     * @property {Boolean} [circular.0=false] Indicates whether to circulate to the coordinate of the minimum <ko>최소 좌표 방향의 순환 여부</ko>
     * @property {Boolean} [circular.1=false] Indicates whether to circulate to the coordinate of the maximum <ko>최대 좌표 방향의 순환 여부</ko>
    **/

    /**
     * @typedef {Object} AxesOption The option object of the eg.Axes module
     * @ko eg.Axes 모듈의 옵션 객체
     * @property {Function} [easing=easing.easeOutCubic] The easing function to apply to an animation <ko>애니메이션에 적용할 easing 함수</ko>
     * @property {Number} [maximumDuration=Infinity] Maximum duration of the animation <ko>가속도에 의해 애니메이션이 동작할 때의 최대 좌표 이동 시간</ko>
     * @property {Number} [minimumDuration=0] Minimum duration of the animation <ko>가속도에 의해 애니메이션이 동작할 때의 최소 좌표 이동 시간</ko>
     * @property {Number} [deceleration=0.0006] Deceleration of the animation where acceleration is manually enabled by user. A higher value indicates shorter running time. <ko>사용자의 동작으로 가속도가 적용된 애니메이션의 감속도. 값이 높을수록 애니메이션 실행 시간이 짧아진다</ko>
     * @property {Boolean} [interruptable=true] Indicates whether an animation is interruptible.<br>- true: It can be paused or stopped by user action or the API.<br>- false: It cannot be paused or stopped by user action or the API while it is running.<ko>진행 중인 애니메이션 중지 가능 여부.<br>- true: 사용자의 동작이나 API로 애니메이션을 중지할 수 있다.<br>- false: 애니메이션이 진행 중일 때는 사용자의 동작이나 API가 적용되지 않는다</ko>
    **/

    /**
     * @class eg.Axes
     * @classdesc A module used to change the information of user action entered by various input devices such as touch screen or mouse into the logical virtual coordinates. You can easily create a UI that responds to user actions.
     * @ko 터치 입력 장치나 마우스와 같은 다양한 입력 장치를 통해 전달 받은 사용자의 동작을 논리적인 가상 좌표로 변경하는 모듈이다. 사용자 동작에 반응하는 UI를 손쉽게 만들수 있다.
     * @extends eg.Component
     *
     * @param {Object.<string, AxisOption>} axis Axis information managed by eg.Axes. The key of the axis specifies the name to use as the logical virtual coordinate system.  <ko>eg.Axes가 관리하는 축 정보. 축의 키는 논리적인 가상 좌표계로 사용할 이름을 지정한다.</ko>
     * @param {AxesOption} [options] The option object of the eg.Axes module<ko>eg.Axes 모듈의 옵션 객체</ko>
     * @param {Object.<string, number>} [startPos] The coordinates to be moved when creating an instance. not triggering change event.<ko>인스턴스 생성시 이동할 좌표, change 이벤트는 발생하지 않음.</ko>
     *
     * @support {"ie": "10+", "ch" : "latest", "ff" : "latest",  "sf" : "latest", "edge" : "latest", "ios" : "7+", "an" : "2.3+ (except 3.x)"}
     * @example
     *
     * // 1. Initialize eg.Axes
     * const axes = new eg.Axes({
     *	something1: {
     *		range: [0, 150],
     *		bounce: 50
     *	},
     *	something2: {
     *		range: [0, 200],
     *		bounce: 100
     *	},
     *	somethingN: {
     *		range: [1, 10],
     *	}
     * }, {
     *  deceleration : 0.0024
     * });
     *
     * // 2. attach event handler
     * axes.on({
     *	"hold" : function(evt) {
     *	},
     *	"release" : function(evt) {
     *	},
     *	"animationStart" : function(evt) {
     *	},
     *	"animationEnd" : function(evt) {
     *	},
     *	"change" : function(evt) {
     *	}
     * });
     *
     * // 3. Initialize inputTypes
     * const panInputArea = new eg.Axes.PanInput("#area", {
     *	scale: [0.5, 1]
     * });
     * const panInputHmove = new eg.Axes.PanInput("#hmove");
     * const panInputVmove = new eg.Axes.PanInput("#vmove");
     * const pinchInputArea = new eg.Axes.PinchInput("#area", {
     *	scale: 1.5
     * });
     *
     * // 4. Connect eg.Axes and InputTypes
     * // [PanInput] When the mouse or touchscreen is down and moved.
     * // Connect the 'something2' axis to the mouse or touchscreen x position and
     * // connect the 'somethingN' axis to the mouse or touchscreen y position.
     * axes.connect(["something2", "somethingN"], panInputArea); // or axes.connect("something2 somethingN", panInputArea);
     *
     * // Connect only one 'something1' axis to the mouse or touchscreen x position.
     * axes.connect(["something1"], panInputHmove); // or axes.connect("something1", panInputHmove);
     *
     * // Connect only one 'something2' axis to the mouse or touchscreen y position.
     * axes.connect(["", "something2"], panInputVmove); // or axes.connect(" something2", panInputVmove);
     *
     * // [PinchInput] Connect 'something2' axis when two pointers are moving toward (zoom-in) or away from each other (zoom-out).
     * axes.connect("something2", pinchInputArea);
     */

    var Axes =
    /*#__PURE__*/
    function (_super) {
      __extends$2(Axes, _super);

      function Axes(axis, options, startPos) {
        if (axis === void 0) {
          axis = {};
        }

        if (options === void 0) {
          options = {};
        }

        var _this = _super.call(this) || this;

        _this.axis = axis;
        _this._inputs = [];
        _this.options = __assign$1({
          easing: function easeOutCubic(x) {
            return 1 - Math.pow(1 - x, 3);
          },
          interruptable: true,
          maximumDuration: Infinity,
          minimumDuration: 0,
          deceleration: 0.0006
        }, options);
        _this.itm = new InterruptManager(_this.options);
        _this.axm = new AxisManager(_this.axis, _this.options);
        _this.em = new EventManager(_this);
        _this.am = new AnimationManager(_this);
        _this.io = new InputObserver(_this);

        _this.em.setAnimationManager(_this.am);

        startPos && _this.em.triggerChange(startPos);
        return _this;
      }
      /**
       * Connect the axis of eg.Axes to the inputType.
       * @ko eg.Axes의 축과 inputType을 연결한다
       * @method eg.Axes#connect
       * @param {(String[]|String)} axes The name of the axis to associate with inputType <ko>inputType과 연결할 축의 이름</ko>
       * @param {Object} inputType The inputType instance to associate with the axis of eg.Axes <ko>eg.Axes의 축과 연결할 inputType 인스턴스<ko>
       * @return {eg.Axes} An instance of a module itself <ko>모듈 자신의 인스턴스</ko>
       * @example
       * const axes = new eg.Axes({
       *   "x": {
       *      range: [0, 100]
       *   },
       *   "xOther": {
       *      range: [-100, 100]
       *   }
       * });
       *
       * axes.connect("x", new eg.Axes.PanInput("#area1"))
       *    .connect("x xOther", new eg.Axes.PanInput("#area2"))
       *    .connect(" xOther", new eg.Axes.PanInput("#area3"))
       *    .connect(["x"], new eg.Axes.PanInput("#area4"))
       *    .connect(["xOther", "x"], new eg.Axes.PanInput("#area5"))
       *    .connect(["", "xOther"], new eg.Axes.PanInput("#area6"));
       */


      var __proto = Axes.prototype;

      __proto.connect = function (axes, inputType) {
        var mapped;

        if (typeof axes === "string") {
          mapped = axes.split(" ");
        } else {
          mapped = axes.concat();
        } // check same instance


        if (~this._inputs.indexOf(inputType)) {
          this.disconnect(inputType);
        } // check same element in hammer type for share


        if ("hammer" in inputType) {
          var targets = this._inputs.filter(function (v) {
            return v.hammer && v.element === inputType.element;
          });

          if (targets.length) {
            inputType.hammer = targets[0].hammer;
          }
        }

        inputType.mapAxes(mapped);
        inputType.connect(this.io);

        this._inputs.push(inputType);

        return this;
      };
      /**
       * Disconnect the axis of eg.Axes from the inputType.
       * @ko eg.Axes의 축과 inputType의 연결을 끊는다.
       * @method eg.Axes#disconnect
       * @param {Object} [inputType] An inputType instance associated with the axis of eg.Axes <ko>eg.Axes의 축과 연결한 inputType 인스턴스<ko>
       * @return {eg.Axes} An instance of a module itself <ko>모듈 자신의 인스턴스</ko>
       * @example
       * const axes = new eg.Axes({
       *   "x": {
       *      range: [0, 100]
       *   },
       *   "xOther": {
       *      range: [-100, 100]
       *   }
       * });
       *
       * const input1 = new eg.Axes.PanInput("#area1");
       * const input2 = new eg.Axes.PanInput("#area2");
       * const input3 = new eg.Axes.PanInput("#area3");
       *
       * axes.connect("x", input1);
       *    .connect("x xOther", input2)
       *    .connect(["xOther", "x"], input3);
       *
       * axes.disconnect(input1); // disconnects input1
       * axes.disconnect(); // disconnects all of them
       */


      __proto.disconnect = function (inputType) {
        if (inputType) {
          var index = this._inputs.indexOf(inputType);

          if (index >= 0) {
            this._inputs[index].disconnect();

            this._inputs.splice(index, 1);
          }
        } else {
          this._inputs.forEach(function (v) {
            return v.disconnect();
          });

          this._inputs = [];
        }

        return this;
      };
      /**
       * Returns the current position of the coordinates.
       * @ko 좌표의 현재 위치를 반환한다
       * @method eg.Axes#get
       * @param {Object} [axes] The names of the axis <ko>축 이름들</ko>
       * @return {Object.<string, number>} Axis coordinate information <ko>축 좌표 정보</ko>
       * @example
       * const axes = new eg.Axes({
       *   "x": {
       *      range: [0, 100]
       *   },
       *   "xOther": {
       *      range: [-100, 100]
       *   },
       * 	 "zoom": {
       *      range: [50, 30]
       *   }
       * });
       *
       * axes.get(); // {"x": 0, "xOther": -100, "zoom": 50}
       * axes.get(["x", "zoom"]); // {"x": 0, "zoom": 50}
       */


      __proto.get = function (axes) {
        return this.axm.get(axes);
      };
      /**
       * Moves an axis to specific coordinates.
       * @ko 좌표를 이동한다.
       * @method eg.Axes#setTo
       * @param {Object.<string, number>} pos The coordinate to move to <ko>이동할 좌표</ko>
       * @param {Number} [duration=0] Duration of the animation (unit: ms) <ko>애니메이션 진행 시간(단위: ms)</ko>
       * @return {eg.Axes} An instance of a module itself <ko>모듈 자신의 인스턴스</ko>
       * @example
       * const axes = new eg.Axes({
       *   "x": {
       *      range: [0, 100]
       *   },
       *   "xOther": {
       *      range: [-100, 100]
       *   },
       * 	 "zoom": {
       *      range: [50, 30]
       *   }
       * });
       *
       * axes.setTo({"x": 30, "zoom": 60});
       * axes.get(); // {"x": 30, "xOther": -100, "zoom": 60}
       *
       * axes.setTo({"x": 100, "xOther": 60}, 1000); // animatation
       *
       * // after 1000 ms
       * axes.get(); // {"x": 100, "xOther": 60, "zoom": 60}
       */


      __proto.setTo = function (pos, duration) {
        if (duration === void 0) {
          duration = 0;
        }

        this.am.setTo(pos, duration);
        return this;
      };
      /**
       * Moves an axis from the current coordinates to specific coordinates.
       * @ko 현재 좌표를 기준으로 좌표를 이동한다.
       * @method eg.Axes#setBy
       * @param {Object.<string, number>} pos The coordinate to move to <ko>이동할 좌표</ko>
       * @param {Number} [duration=0] Duration of the animation (unit: ms) <ko>애니메이션 진행 시간(단위: ms)</ko>
       * @return {eg.Axes} An instance of a module itself <ko>모듈 자신의 인스턴스</ko>
       * @example
       * const axes = new eg.Axes({
       *   "x": {
       *      range: [0, 100]
       *   },
       *   "xOther": {
       *      range: [-100, 100]
       *   },
       * 	 "zoom": {
       *      range: [50, 30]
       *   }
       * });
       *
       * axes.setBy({"x": 30, "zoom": 10});
       * axes.get(); // {"x": 30, "xOther": -100, "zoom": 60}
       *
       * axes.setBy({"x": 70, "xOther": 60}, 1000); // animatation
       *
       * // after 1000 ms
       * axes.get(); // {"x": 100, "xOther": -40, "zoom": 60}
       */


      __proto.setBy = function (pos, duration) {
        if (duration === void 0) {
          duration = 0;
        }

        this.am.setBy(pos, duration);
        return this;
      };
      /**
       * Returns whether there is a coordinate in the bounce area of ​​the target axis.
       * @ko 대상 축 중 bounce영역에 좌표가 존재하는지를 반환한다
       * @method eg.Axes#isBounceArea
       * @param {Object} [axes] The names of the axis <ko>축 이름들</ko>
       * @return {Boolen} Whether the bounce area exists. <ko>bounce 영역 존재 여부</ko>
       * @example
       * const axes = new eg.Axes({
       *   "x": {
       *      range: [0, 100]
       *   },
       *   "xOther": {
       *      range: [-100, 100]
       *   },
       * 	 "zoom": {
       *      range: [50, 30]
       *   }
       * });
       *
       * axes.isBounceArea(["x"]);
       * axes.isBounceArea(["x", "zoom"]);
       * axes.isBounceArea();
       */


      __proto.isBounceArea = function (axes) {
        return this.axm.isOutside(axes);
      };
      /**
      * Destroys properties, and events used in a module and disconnect all connections to inputTypes.
      * @ko 모듈에 사용한 속성, 이벤트를 해제한다. 모든 inputType과의 연결을 끊는다.
      * @method eg.Axes#destroy
      */


      __proto.destroy = function () {
        this.disconnect();
        this.em.destroy();
      };
      /**
       * Version info string
       * @ko 버전정보 문자열
       * @name VERSION
       * @static
       * @type {String}
       * @example
       * eg.Axes.VERSION;  // ex) 3.3.3
       * @memberof eg.Axes
       */


      Axes.VERSION = "2.5.13";
      /**
       * @name eg.Axes.TRANSFORM
       * @desc Returns the transform attribute with CSS vendor prefixes.
       * @ko CSS vendor prefixes를 붙인 transform 속성을 반환한다.
       *
       * @constant
       * @type {String}
       * @example
       * eg.Axes.TRANSFORM; // "transform" or "webkitTransform"
       */

      Axes.TRANSFORM = TRANSFORM;
      /**
       * @name eg.Axes.DIRECTION_NONE
       * @constant
       * @type {Number}
       */

      Axes.DIRECTION_NONE = DIRECTION_NONE;
      /**
       * @name eg.Axes.DIRECTION_LEFT
       * @constant
       * @type {Number}
      */

      Axes.DIRECTION_LEFT = DIRECTION_LEFT;
      /**
       * @name eg.Axes.DIRECTION_RIGHT
       * @constant
       * @type {Number}
      */

      Axes.DIRECTION_RIGHT = DIRECTION_RIGHT;
      /**
       * @name eg.Axes.DIRECTION_UP
       * @constant
       * @type {Number}
      */

      Axes.DIRECTION_UP = DIRECTION_UP;
      /**
       * @name eg.Axes.DIRECTION_DOWN
       * @constant
       * @type {Number}
      */

      Axes.DIRECTION_DOWN = DIRECTION_DOWN;
      /**
       * @name eg.Axes.DIRECTION_HORIZONTAL
       * @constant
       * @type {Number}
      */

      Axes.DIRECTION_HORIZONTAL = DIRECTION_HORIZONTAL;
      /**
       * @name eg.Axes.DIRECTION_VERTICAL
       * @constant
       * @type {Number}
      */

      Axes.DIRECTION_VERTICAL = DIRECTION_VERTICAL;
      /**
       * @name eg.Axes.DIRECTION_ALL
       * @constant
       * @type {Number}
      */

      Axes.DIRECTION_ALL = DIRECTION_ALL;
      return Axes;
    }(Component$1);

    var SUPPORT_POINTER_EVENTS$1 = "PointerEvent" in win$1 || "MSPointerEvent" in win$1;
    var SUPPORT_TOUCH$1 = "ontouchstart" in win$1;
    var UNIQUEKEY = "_EGJS_AXES_INPUTTYPE_";
    function toAxis(source, offset) {
      return offset.reduce(function (acc, v, i) {
        if (source[i]) {
          acc[source[i]] = v;
        }

        return acc;
      }, {});
    }
    function createHammer(element, options) {
      try {
        // create Hammer
        return new Manager(element, __assign$1({}, options));
      } catch (e) {
        return null;
      }
    }
    function convertInputType(inputType) {
      if (inputType === void 0) {
        inputType = [];
      }

      var hasTouch = false;
      var hasMouse = false;
      var hasPointer = false;
      inputType.forEach(function (v) {
        switch (v) {
          case "mouse":
            hasMouse = true;
            break;

          case "touch":
            hasTouch = SUPPORT_TOUCH$1;
            break;

          case "pointer":
            hasPointer = SUPPORT_POINTER_EVENTS$1;
          // no default
        }
      });

      if (hasPointer) {
        return PointerEventInput;
      } else if (hasTouch && hasMouse) {
        return TouchMouseInput;
      } else if (hasTouch) {
        return TouchInput;
      } else if (hasMouse) {
        return MouseInput;
      }

      return null;
    }

    /**
     * @typedef {Object} PinchInputOption The option object of the eg.Axes.PinchInput module
     * @ko eg.Axes.PinchInput 모듈의 옵션 객체
     * @property {Number} [scale=1] Coordinate scale that a user can move<ko>사용자의 동작으로 이동하는 좌표의 배율</ko>
     * @property {Number} [threshold=0] Minimal scale before recognizing <ko>사용자의 Pinch 동작을 인식하기 위해산 최소한의 배율</ko>
     * @property {Object} [hammerManagerOptions={cssProps: {userSelect: "none",touchSelect: "none",touchCallout: "none",userDrag: "none"}] Options of Hammer.Manager <ko>Hammer.Manager의 옵션</ko>
    **/

    /**
     * @class eg.Axes.PinchInput
     * @classdesc A module that passes the amount of change to eg.Axes when two pointers are moving toward (zoom-in) or away from each other (zoom-out). use one axis.
     * @ko 2개의 pointer를 이용하여 zoom-in하거나 zoom-out 하는 동작의 변화량을 eg.Axes에 전달하는 모듈. 한 개 의 축을 사용한다.
     * @example
     * const pinch = new eg.Axes.PinchInput("#area", {
     * 		scale: 1
     * });
     *
     * // Connect 'something' axis when two pointers are moving toward (zoom-in) or away from each other (zoom-out).
     * axes.connect("something", pinch);
     *
     * @param {HTMLElement|String|jQuery} element An element to use the eg.Axes.PinchInput module <ko>eg.Axes.PinchInput 모듈을 사용할 엘리먼트</ko>
     * @param {PinchInputOption} [options] The option object of the eg.Axes.PinchInput module<ko>eg.Axes.PinchInput 모듈의 옵션 객체</ko>
     */

    var PinchInput =
    /*#__PURE__*/
    function () {
      function PinchInput(el, options) {
        this.axes = [];
        this.hammer = null;
        this.element = null;
        this._base = null;
        this._prev = null;
        this.pinchRecognizer = null;
        /**
         * Hammer helps you add support for touch gestures to your page
         *
         * @external Hammer
         * @see {@link http://hammerjs.github.io|Hammer.JS}
         * @see {@link http://hammerjs.github.io/jsdoc/Hammer.html|Hammer.JS API documents}
         * @see Hammer.JS applies specific CSS properties by {@link http://hammerjs.github.io/jsdoc/Hammer.defaults.cssProps.html|default} when creating an instance. The eg.Axes module removes all default CSS properties provided by Hammer.JS
         */

        if (typeof Manager === "undefined") {
          throw new Error("The Hammerjs must be loaded before eg.Axes.PinchInput.\nhttp://hammerjs.github.io/");
        }

        this.element = $(el);
        this.options = __assign$1({
          scale: 1,
          threshold: 0,
          inputType: ["touch", "pointer"],
          hammerManagerOptions: {
            // css properties were removed due to usablility issue
            // http://hammerjs.github.io/jsdoc/Hammer.defaults.cssProps.html
            cssProps: {
              userSelect: "none",
              touchSelect: "none",
              touchCallout: "none",
              userDrag: "none"
            }
          }
        }, options);
        this.onPinchStart = this.onPinchStart.bind(this);
        this.onPinchMove = this.onPinchMove.bind(this);
        this.onPinchEnd = this.onPinchEnd.bind(this);
      }

      var __proto = PinchInput.prototype;

      __proto.mapAxes = function (axes) {
        this.axes = axes;
      };

      __proto.connect = function (observer) {
        var hammerOption = {
          threshold: this.options.threshold
        };

        if (this.hammer) {
          // for sharing hammer instance.
          // hammer remove previous PinchRecognizer.
          this.removeRecognizer();
          this.dettachEvent();
        } else {
          var keyValue = this.element[UNIQUEKEY];

          if (!keyValue) {
            keyValue = String(Math.round(Math.random() * new Date().getTime()));
          }

          var inputClass = convertInputType(this.options.inputType);

          if (!inputClass) {
            throw new Error("Wrong inputType parameter!");
          }

          this.hammer = createHammer(this.element, __assign$1({
            inputClass: inputClass
          }, this.options.hammerManagerOptions));
          this.element[UNIQUEKEY] = keyValue;
        }

        this.pinchRecognizer = new PinchRecognizer(hammerOption);
        this.hammer.add(this.pinchRecognizer);
        this.attachEvent(observer);
        return this;
      };

      __proto.disconnect = function () {
        this.removeRecognizer();

        if (this.hammer) {
          this.hammer.remove(this.pinchRecognizer);
          this.pinchRecognizer = null;
          this.dettachEvent();
        }

        return this;
      };
      /**
      * Destroys elements, properties, and events used in a module.
      * @ko 모듈에 사용한 엘리먼트와 속성, 이벤트를 해제한다.
      * @method eg.Axes.PinchInput#destroy
      */


      __proto.destroy = function () {
        this.disconnect();

        if (this.hammer && this.hammer.recognizers.length === 0) {
          this.hammer.destroy();
        }

        delete this.element[UNIQUEKEY];
        this.element = null;
        this.hammer = null;
      };

      __proto.removeRecognizer = function () {
        if (this.hammer && this.pinchRecognizer) {
          this.hammer.remove(this.pinchRecognizer);
          this.pinchRecognizer = null;
        }
      };

      __proto.onPinchStart = function (event) {
        this._base = this.observer.get(this)[this.axes[0]];
        var offset = this.getOffset(event.scale);
        this.observer.hold(this, event);
        this.observer.change(this, event, toAxis(this.axes, [offset]));
        this._prev = event.scale;
      };

      __proto.onPinchMove = function (event) {
        var offset = this.getOffset(event.scale, this._prev);
        this.observer.change(this, event, toAxis(this.axes, [offset]));
        this._prev = event.scale;
      };

      __proto.onPinchEnd = function (event) {
        var offset = this.getOffset(event.scale, this._prev);
        this.observer.change(this, event, toAxis(this.axes, [offset]));
        this.observer.release(this, event, toAxis(this.axes, [0]), 0);
        this._base = null;
        this._prev = null;
      };

      __proto.getOffset = function (pinchScale, prev) {
        if (prev === void 0) {
          prev = 1;
        }

        return this._base * (pinchScale - prev) * this.options.scale;
      };

      __proto.attachEvent = function (observer) {
        this.observer = observer;
        this.hammer.on("pinchstart", this.onPinchStart).on("pinchmove", this.onPinchMove).on("pinchend", this.onPinchEnd);
      };

      __proto.dettachEvent = function () {
        this.hammer.off("pinchstart", this.onPinchStart).off("pinchmove", this.onPinchMove).off("pinchend", this.onPinchEnd);
        this.observer = null;
        this._prev = null;
      };
      /**
       * Enables input devices
       * @ko 입력 장치를 사용할 수 있게 한다
       * @method eg.Axes.PinchInput#enable
       * @return {eg.Axes.PinchInput} An instance of a module itself <ko>모듈 자신의 인스턴스</ko>
       */


      __proto.enable = function () {
        this.hammer && (this.hammer.get("pinch").options.enable = true);
        return this;
      };
      /**
       * Disables input devices
       * @ko 입력 장치를 사용할 수 없게 한다.
       * @method eg.Axes.PinchInput#disable
       * @return {eg.Axes.PinchInput} An instance of a module itself <ko>모듈 자신의 인스턴스</ko>
       */


      __proto.disable = function () {
        this.hammer && (this.hammer.get("pinch").options.enable = false);
        return this;
      };
      /**
       * Returns whether to use an input device
       * @ko 입력 장치를 사용 여부를 반환한다.
       * @method eg.Axes.PinchInput#isEnable
       * @return {Boolean} Whether to use an input device <ko>입력장치 사용여부</ko>
       */


      __proto.isEnable = function () {
        return !!(this.hammer && this.hammer.get("pinch").options.enable);
      };

      return PinchInput;
    }();

    /*
    Copyright (c) 2019 Daybrush
    name: preact-timeline
    license: MIT
    author: Daybrush
    repository: git+https://github.com/daybrush/scenejs-timeline.git
    version: 0.2.3
    */

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

    var extendStatics$3 = function(d, b) {
        extendStatics$3 = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics$3(d, b);
    };

    function __extends$3(d, b) {
        extendStatics$3(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign$2 = function() {
        __assign$2 = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign$2.apply(this, arguments);
    };

    var PropTypes = {
      checkPropTypes: function () {}
    };

    function createEmitter(initialValue, bitmaskFactory) {
        var registeredUpdaters = [];
        var value = initialValue;
        var diff = function (newValue) { return bitmaskFactory(value, newValue) | 0; };
        return {
            register: function (updater) {
                registeredUpdaters.push(updater);
                updater(value, diff(value));
            },
            unregister: function (updater) {
                registeredUpdaters = registeredUpdaters.filter(function (i) { return i !== updater; });
            },
            val: function (newValue) {
                if (newValue === undefined || newValue == value) {
                    return value;
                }
                var bitmask = diff(newValue);
                value = newValue;
                registeredUpdaters.forEach(function (up) { return up(newValue, bitmask); });
                return value;
            }
        };
    }
    var noopEmitter = {
        register: function (_) {
            console.warn("Consumer used without a Provider");
        },
        unregister: function (_) {
            // do nothing
        },
        val: function (_) {
            //do nothing;
        }
    };

    /*
     * Extracts the children from the props and returns an object containing the
     * only element of the given array (preact always passes children as an array)
     * or null otherwise. The result contains always a reference to the original
     * array of children
     *
     * @param {RenderableProps<*>} props - the component's properties
     * @return {{ child: JSX.Element | null, children: JSX.Element[]}}
     */
    function getOnlyChildAndChildren(props) {
        var children = props.children;
        var child = children.length === 1 ? children[0] : null;
        return { child: child, children: children };
    }

    var __extends$1$1 = (function () {
        var extendStatics = function (d, b) {
            extendStatics = Object.setPrototypeOf ||
                ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
                function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
            return extendStatics(d, b);
        };
        return function (d, b) {
            extendStatics(d, b);
            function __() { this.constructor = d; }
            d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
        };
    })();
    function getRenderer(props) {
        var child = getOnlyChildAndChildren(props).child;
        // TODO: "render" in props check is only done to make TS happy
        return child || ("render" in props && props.render);
    }
    var MAX_SIGNED_31_BIT_INT = 1073741823;
    var defaultBitmaskFactory = function () { return MAX_SIGNED_31_BIT_INT; };
    var ids = 0;
    function _createContext(value, bitmaskFactory) {
        var key = "_preactContextProvider-" + ids++;
        var Provider = /*#__PURE__*/ (function (_super) {
            __extends$1$1(Provider, _super);
            function Provider(props) {
                var _this = _super.call(this, props) || this;
                _this._emitter = createEmitter(props.value, bitmaskFactory || defaultBitmaskFactory);
                return _this;
            }
            Provider.prototype.getChildContext = function () {
                var _a;
                return _a = {}, _a[key] = this._emitter, _a;
            };
            Provider.prototype.componentDidUpdate = function () {
                this._emitter.val(this.props.value);
            };
            Provider.prototype.render = function () {
                var _a = getOnlyChildAndChildren(this.props), child = _a.child, children = _a.children;
                if (child) {
                    return child;
                }
                // preact does not support fragments,
                // therefore we wrap the children in a span
                return h("span", null, children);
            };
            return Provider;
        }(Component));
        var Consumer = /*#__PURE__*/ (function (_super) {
            __extends$1$1(Consumer, _super);
            function Consumer(props, ctx) {
                var _this = _super.call(this, props, ctx) || this;
                _this._updateContext = function (value, bitmask) {
                    var unstable_observedBits = _this.props.unstable_observedBits;
                    var observed = unstable_observedBits === undefined || unstable_observedBits === null
                        ? MAX_SIGNED_31_BIT_INT
                        : unstable_observedBits;
                    observed = observed | 0;
                    if ((observed & bitmask) === 0) {
                        return;
                    }
                    _this.setState({ value: value });
                };
                _this.state = { value: _this._getEmitter().val() || value };
                return _this;
            }
            Consumer.prototype.componentDidMount = function () {
                this._getEmitter().register(this._updateContext);
            };
            Consumer.prototype.shouldComponentUpdate = function (nextProps, nextState) {
                return (this.state.value !== nextState.value ||
                    getRenderer(this.props) !== getRenderer(nextProps));
            };
            Consumer.prototype.componentWillUnmount = function () {
                this._getEmitter().unregister(this._updateContext);
            };
            Consumer.prototype.componentDidUpdate = function (_, __, prevCtx) {
                var previousProvider = prevCtx[key];
                if (previousProvider === this.context[key]) {
                    return;
                }
                (previousProvider || noopEmitter).unregister(this._updateContext);
                this.componentDidMount();
            };
            Consumer.prototype.render = function () {
                // TODO: "render" in props check is only done to make TS happy
                var render = "render" in this.props && this.props.render;
                var r = getRenderer(this.props);
                if (render && render !== r) {
                    console.warn("Both children and a render function are defined. Children will be used");
                }
                if (typeof r === "function") {
                    return r(this.state.value);
                }
                console.warn("Consumer is expecting a function as one and only child but didn't find any");
            };
            Consumer.prototype._getEmitter = function () {
                return this.context[key] || noopEmitter;
            };
            return Consumer;
        }(Component));
        return {
            Provider: Provider,
            Consumer: Consumer
        };
    }
    var createContext = _createContext;

    var version = '15.1.0'; // trick libraries to think we are react

    var ELEMENTS = 'a abbr address area article aside audio b base bdi bdo big blockquote body br button canvas caption cite code col colgroup data datalist dd del details dfn dialog div dl dt em embed fieldset figcaption figure footer form h1 h2 h3 h4 h5 h6 head header hgroup hr html i iframe img input ins kbd keygen label legend li link main map mark menu menuitem meta meter nav noscript object ol optgroup option output p param picture pre progress q rp rt ruby s samp script section select small source span strong style sub summary sup table tbody td textarea tfoot th thead time title tr track u ul var video wbr circle clipPath defs ellipse g image line linearGradient mask path pattern polygon polyline radialGradient rect stop svg text tspan'.split(
    	' '
    );

    var REACT_ELEMENT_TYPE = (typeof Symbol !== 'undefined' && Symbol.for && Symbol.for('react.element')) || 0xeac7;

    var COMPONENT_WRAPPER_KEY =
    	typeof Symbol !== 'undefined' && Symbol.for ? Symbol.for('__preactCompatWrapper') : '__preactCompatWrapper';

    // don't autobind these methods since they already have guaranteed context.
    var AUTOBIND_BLACKLIST = {
    	constructor: 1,
    	render: 1,
    	shouldComponentUpdate: 1,
    	componentWillReceiveProps: 1,
    	componentWillUpdate: 1,
    	componentDidUpdate: 1,
    	componentWillMount: 1,
    	componentDidMount: 1,
    	componentWillUnmount: 1,
    	componentDidUnmount: 1
    };

    var CAMEL_PROPS = /^(?:accent|alignment|arabic|baseline|cap|clip|color|fill|flood|font|glyph|horiz|marker|overline|paint|stop|strikethrough|stroke|text|underline|unicode|units|v|vector|vert|word|writing|x)[A-Z]/;

    var BYPASS_HOOK = {};

    /*global process*/
    var DEV = false;
    try {
    	DEV = process.env.NODE_ENV !== 'production';
    }
    catch (e) { }

    // a component that renders nothing. Used to replace components for unmountComponentAtNode.
    function EmptyComponent() {
    	return null;
    }

    // make react think we're react.
    var VNode$1 = h('a', null).constructor;
    VNode$1.prototype.$$typeof = REACT_ELEMENT_TYPE;
    VNode$1.prototype.preactCompatUpgraded = false;
    VNode$1.prototype.preactCompatNormalized = false;

    Object.defineProperty(VNode$1.prototype, 'type', {
    	get: function() {
    		return this.nodeName;
    	},
    	set: function(v) {
    		this.nodeName = v;
    	},
    	configurable: true
    });

    Object.defineProperty(VNode$1.prototype, 'props', {
    	get: function() {
    		return this.attributes;
    	},
    	set: function(v) {
    		this.attributes = v;
    	},
    	configurable: true
    });

    var oldEventHook = options.event;
    options.event = function (e) {
    	if (oldEventHook) { e = oldEventHook(e); }
    	e.persist = Object;
    	e.nativeEvent = e;
    	return e;
    };

    var oldVnodeHook = options.vnode;
    options.vnode = function (vnode) {
    	if (!vnode.preactCompatUpgraded) {
    		vnode.preactCompatUpgraded = true;

    		var tag = vnode.nodeName,
    			attrs = (vnode.attributes = vnode.attributes == null ? {} : extend$1({}, vnode.attributes));

    		if (typeof tag === 'function') {
    			if (tag[COMPONENT_WRAPPER_KEY] === true || (tag.prototype && 'isReactComponent' in tag.prototype)) {
    				if (vnode.children && String(vnode.children) === '') { vnode.children = undefined; }
    				if (vnode.children) { attrs.children = vnode.children; }

    				if (!vnode.preactCompatNormalized) {
    					normalizeVNode(vnode);
    				}
    				handleComponentVNode(vnode);
    			}
    		}
    		else {
    			if (vnode.children && String(vnode.children) === '') { vnode.children = undefined; }
    			if (vnode.children) { attrs.children = vnode.children; }

    			if (attrs.defaultValue) {
    				if (!attrs.value && attrs.value !== 0) {
    					attrs.value = attrs.defaultValue;
    				}
    				delete attrs.defaultValue;
    			}

    			handleElementVNode(vnode, attrs);
    		}
    	}

    	if (oldVnodeHook) { oldVnodeHook(vnode); }
    };

    function handleComponentVNode(vnode) {
    	var tag = vnode.nodeName,
    		a = vnode.attributes;

    	vnode.attributes = {};
    	if (tag.defaultProps) { extend$1(vnode.attributes, tag.defaultProps); }
    	if (a) { extend$1(vnode.attributes, a); }
    }

    function handleElementVNode(vnode, a) {
    	var shouldSanitize, attrs, i;
    	if (a) {
    		for (i in a) { if ((shouldSanitize = CAMEL_PROPS.test(i))) { break; } }
    		if (shouldSanitize) {
    			attrs = vnode.attributes = {};
    			for (i in a) {
    				if (a.hasOwnProperty(i)) {
    					attrs[CAMEL_PROPS.test(i) ? i.replace(/([A-Z0-9])/, '-$1').toLowerCase() : i] = a[i];
    				}
    			}
    		}
    	}
    }

    // proxy render() since React returns a Component reference.
    function render$1(vnode, parent, callback) {
    	var prev = parent && parent._preactCompatRendered && parent._preactCompatRendered.base;

    	// ignore impossible previous renders
    	if (prev && prev.parentNode !== parent) { prev = null; }

    	// default to first Element child
    	if (!prev && parent) { prev = parent.firstElementChild; }

    	// remove unaffected siblings
    	for (var i = parent.childNodes.length; i--;) {
    		if (parent.childNodes[i] !== prev) {
    			parent.removeChild(parent.childNodes[i]);
    		}
    	}

    	var out = render(vnode, parent, prev);
    	if (parent) { parent._preactCompatRendered = out && (out._component || { base: out }); }
    	if (typeof callback === 'function') { callback(); }
    	return (out && out._component) || out;
    }

    var ContextProvider = function () {};

    ContextProvider.prototype.getChildContext = function () {
    	return this.props.context;
    };
    ContextProvider.prototype.render = function (props) {
    	return props.children[0];
    };

    function renderSubtreeIntoContainer(parentComponent, vnode, container, callback) {
    	var wrap = h(ContextProvider, { context: parentComponent.context }, vnode);
    	var renderContainer = render$1(wrap, container);
    	var component = renderContainer._component || renderContainer.base;
    	if (callback) { callback.call(component, renderContainer); }
    	return component;
    }

    function Portal(props) {
    	renderSubtreeIntoContainer(this, props.vnode, props.container);
    }

    function createPortal(vnode, container) {
    	return h(Portal, { vnode: vnode, container: container });
    }

    function unmountComponentAtNode(container) {
    	var existing = container._preactCompatRendered && container._preactCompatRendered.base;
    	if (existing && existing.parentNode === container) {
    		render(h(EmptyComponent), container, existing);
    		return true;
    	}
    	return false;
    }

    var ARR = [];

    // This API is completely unnecessary for Preact, so it's basically passthrough.
    var Children = {
    	map: function(children, fn, ctx) {
    		if (children == null) { return null; }
    		children = Children.toArray(children);
    		if (ctx && ctx !== children) { fn = fn.bind(ctx); }
    		return children.map(fn);
    	},
    	forEach: function(children, fn, ctx) {
    		if (children == null) { return null; }
    		children = Children.toArray(children);
    		if (ctx && ctx !== children) { fn = fn.bind(ctx); }
    		children.forEach(fn);
    	},
    	count: function(children) {
    		return (children && children.length) || 0;
    	},
    	only: function(children) {
    		children = Children.toArray(children);
    		if (children.length !== 1) { throw new Error('Children.only() expects only one child.'); }
    		return children[0];
    	},
    	toArray: function(children) {
    		if (children == null) { return []; }
    		return ARR.concat(children);
    	}
    };

    /** Track current render() component for ref assignment */
    var currentComponent;

    function createFactory(type) {
    	return createElement.bind(null, type);
    }

    var DOM = {};
    for (var i = ELEMENTS.length; i--;) {
    	DOM[ELEMENTS[i]] = createFactory(ELEMENTS[i]);
    }

    function upgradeToVNodes(arr, offset) {
    	for (var i = offset || 0; i < arr.length; i++) {
    		var obj = arr[i];
    		if (Array.isArray(obj)) {
    			upgradeToVNodes(obj);
    		}
    		else if (
    			obj &&
    			typeof obj === 'object' &&
    			!isValidElement(obj) &&
    			((obj.props && obj.type) || (obj.attributes && obj.nodeName) || obj.children)
    		) {
    			arr[i] = createElement(obj.type || obj.nodeName, obj.props || obj.attributes, obj.children);
    		}
    	}
    }

    function isStatelessComponent(c) {
    	return typeof c === 'function' && !(c.prototype && c.prototype.render);
    }

    // wraps stateless functional components in a PropTypes validator
    function wrapStatelessComponent(WrappedComponent) {
    	return createClass({
    		displayName: WrappedComponent.displayName || WrappedComponent.name,
    		render: function() {
    			return WrappedComponent(this.props, this.context);
    		}
    	});
    }

    function statelessComponentHook(Ctor) {
    	var Wrapped = Ctor[COMPONENT_WRAPPER_KEY];
    	if (Wrapped) { return Wrapped === true ? Ctor : Wrapped; }

    	Wrapped = wrapStatelessComponent(Ctor);

    	Object.defineProperty(Wrapped, COMPONENT_WRAPPER_KEY, { configurable: true, value: true });
    	Wrapped.displayName = Ctor.displayName;
    	Wrapped.propTypes = Ctor.propTypes;
    	Wrapped.defaultProps = Ctor.defaultProps;

    	Object.defineProperty(Ctor, COMPONENT_WRAPPER_KEY, { configurable: true, value: Wrapped });

    	return Wrapped;
    }

    function createElement() {
    	var args = [], len = arguments.length;
    	while ( len-- ) args[ len ] = arguments[ len ];

    	upgradeToVNodes(args, 2);
    	return normalizeVNode(h.apply(void 0, args));
    }

    function normalizeVNode(vnode) {
    	vnode.preactCompatNormalized = true;

    	applyClassName(vnode);

    	if (isStatelessComponent(vnode.nodeName)) {
    		vnode.nodeName = statelessComponentHook(vnode.nodeName);
    	}

    	var ref = vnode.attributes.ref,
    		type = ref && typeof ref;
    	if (currentComponent && (type === 'string' || type === 'number')) {
    		vnode.attributes.ref = createStringRefProxy(ref, currentComponent);
    	}

    	applyEventNormalization(vnode);

    	return vnode;
    }

    function cloneElement$1(element, props) {
    	var children = [], len = arguments.length - 2;
    	while ( len-- > 0 ) children[ len ] = arguments[ len + 2 ];

    	if (!isValidElement(element)) { return element; }
    	var elementProps = element.attributes || element.props;
    	var node = h(
    		element.nodeName || element.type,
    		extend$1({}, elementProps),
    		element.children || (elementProps && elementProps.children)
    	);
    	// Only provide the 3rd argument if needed.
    	// Arguments 3+ overwrite element.children in preactCloneElement
    	var cloneArgs = [node, props];
    	if (children && children.length) {
    		cloneArgs.push(children);
    	}
    	else if (props && props.children) {
    		cloneArgs.push(props.children);
    	}
    	return normalizeVNode(cloneElement.apply(void 0, cloneArgs));
    }

    function isValidElement(element) {
    	return element && (element instanceof VNode$1 || element.$$typeof === REACT_ELEMENT_TYPE);
    }

    function createStringRefProxy(name, component) {
    	return (
    		component._refProxies[name] ||
    		(component._refProxies[name] = function (resolved) {
    			if (component && component.refs) {
    				component.refs[name] = resolved;
    				if (resolved === null) {
    					delete component._refProxies[name];
    					component = null;
    				}
    			}
    		})
    	);
    }

    function applyEventNormalization(ref) {
    	var nodeName = ref.nodeName;
    	var attributes = ref.attributes;

    	if (!attributes || typeof nodeName !== 'string') { return; }
    	var props = {};
    	for (var i in attributes) {
    		props[i.toLowerCase()] = i;
    	}
    	if (props.ondoubleclick) {
    		attributes.ondblclick = attributes[props.ondoubleclick];
    		delete attributes[props.ondoubleclick];
    	}
    	// for *textual inputs* (incl textarea), normalize `onChange` -> `onInput`:
    	if (
    		props.onchange &&
    		(nodeName === 'textarea' || (nodeName.toLowerCase() === 'input' && !/^fil|che|rad/i.test(attributes.type)))
    	) {
    		var normalized = props.oninput || 'oninput';
    		if (!attributes[normalized]) {
    			attributes[normalized] = multihook([attributes[normalized], attributes[props.onchange]]);
    			delete attributes[props.onchange];
    		}
    	}
    }

    function applyClassName(vnode) {
    	var a = vnode.attributes || (vnode.attributes = {});
    	classNameDescriptor.enumerable = 'className' in a;
    	if (a.className) { a.class = a.className; }
    	Object.defineProperty(a, 'className', classNameDescriptor);
    }

    var classNameDescriptor = {
    	configurable: true,
    	get: function() {
    		return this.class;
    	},
    	set: function(v) {
    		this.class = v;
    	}
    };

    function extend$1(base, props) {
    	var arguments$1 = arguments;

    	for (var i = 1, obj = (void 0); i < arguments.length; i++) {
    		if ((obj = arguments$1[i])) {
    			for (var key in obj) {
    				if (obj.hasOwnProperty(key)) {
    					base[key] = obj[key];
    				}
    			}
    		}
    	}
    	return base;
    }

    function shallowDiffers(a, b) {
    	for (var i in a) { if (!(i in b)) { return true; } }
    	for (var i$1 in b) { if (a[i$1] !== b[i$1]) { return true; } }
    	return false;
    }

    function findDOMNode(component) {
    	return (component && (component.base || (component.nodeType === 1 && component))) || null;
    }

    function F() { }

    function createClass(obj) {
    	function cl(props, context) {
    		bindAll(this);
    		Component$1$1.call(this, props, context, BYPASS_HOOK);
    		newComponentHook.call(this, props, context);
    	}

    	obj = extend$1({ constructor: cl }, obj);

    	// We need to apply mixins here so that getDefaultProps is correctly mixed
    	if (obj.mixins) {
    		applyMixins(obj, collateMixins(obj.mixins));
    	}
    	if (obj.statics) {
    		extend$1(cl, obj.statics);
    	}
    	if (obj.propTypes) {
    		cl.propTypes = obj.propTypes;
    	}
    	if (obj.defaultProps) {
    		cl.defaultProps = obj.defaultProps;
    	}
    	if (obj.getDefaultProps) {
    		cl.defaultProps = obj.getDefaultProps.call(cl);
    	}

    	F.prototype = Component$1$1.prototype;
    	cl.prototype = extend$1(new F(), obj);

    	cl.displayName = obj.displayName || 'Component';

    	return cl;
    }

    // Flatten an Array of mixins to a map of method name to mixin implementations
    function collateMixins(mixins) {
    	var keyed = {};
    	for (var i = 0; i < mixins.length; i++) {
    		var mixin = mixins[i];
    		for (var key in mixin) {
    			if (mixin.hasOwnProperty(key) && typeof mixin[key] === 'function') {
    				(keyed[key] || (keyed[key] = [])).push(mixin[key]);
    			}
    		}
    	}
    	return keyed;
    }

    // apply a mapping of Arrays of mixin methods to a component prototype
    function applyMixins(proto, mixins) {
    	for (var key in mixins)
    		{ if (mixins.hasOwnProperty(key)) {
    			proto[key] = multihook(
    				mixins[key].concat(proto[key] || ARR),
    				key === 'getDefaultProps' || key === 'getInitialState' || key === 'getChildContext'
    			);
    		} }
    }

    function bindAll(ctx) {
    	for (var i in ctx) {
    		var v = ctx[i];
    		if (typeof v === 'function' && !v.__bound && !AUTOBIND_BLACKLIST.hasOwnProperty(i)) {
    			(ctx[i] = v.bind(ctx)).__bound = true;
    		}
    	}
    }

    function callMethod(ctx, m, args) {
    	if (typeof m === 'string') {
    		m = ctx.constructor.prototype[m];
    	}
    	if (typeof m === 'function') {
    		return m.apply(ctx, args);
    	}
    }

    function multihook(hooks, skipDuplicates) {
    	return function () {
    		var arguments$1 = arguments;
    		var this$1 = this;

    		var ret;
    		for (var i = 0; i < hooks.length; i++) {
    			var r = callMethod(this$1, hooks[i], arguments$1);

    			if (skipDuplicates && r != null) {
    				if (!ret) { ret = {}; }
    				for (var key in r)
    					{ if (r.hasOwnProperty(key)) {
    						ret[key] = r[key];
    					} }
    			}
    			else if (typeof r !== 'undefined') { ret = r; }
    		}
    		return ret;
    	};
    }

    function newComponentHook(props, context) {
    	propsHook.call(this, props, context);
    	this.componentWillReceiveProps = multihook([
    		propsHook,
    		this.componentWillReceiveProps || 'componentWillReceiveProps'
    	]);
    	this.render = multihook([propsHook, beforeRender, this.render || 'render', afterRender]);
    }

    function propsHook(props, context) {
    	if (!props) { return; }

    	// React annoyingly special-cases single children, and some react components are ridiculously strict about this.
    	var c = props.children;
    	if (
    		c &&
    		Array.isArray(c) &&
    		c.length === 1 &&
    		(typeof c[0] === 'string' || typeof c[0] === 'function' || c[0] instanceof VNode$1)
    	) {
    		props.children = c[0];

    		// but its totally still going to be an Array.
    		if (props.children && typeof props.children === 'object') {
    			props.children.length = 1;
    			props.children[0] = props.children;
    		}
    	}

    	// add proptype checking
    	if (DEV) {
    		var ctor = typeof this === 'function' ? this : this.constructor,
    			propTypes = this.propTypes || ctor.propTypes;
    		var displayName = this.displayName || ctor.name;
    	}
    }

    function beforeRender(props) {
    	currentComponent = this;
    }

    function afterRender() {
    	if (currentComponent === this) {
    		currentComponent = null;
    	}
    }

    function Component$1$1(props, context, opts) {
    	Component.call(this, props, context);
    	this.state = this.getInitialState ? this.getInitialState() : {};
    	this.refs = {};
    	this._refProxies = {};
    	if (opts !== BYPASS_HOOK) {
    		newComponentHook.call(this, props, context);
    	}
    }
    extend$1((Component$1$1.prototype = new Component()), {
    	constructor: Component$1$1,

    	isReactComponent: {},

    	replaceState: function(state, callback) {
    		var this$1 = this;

    		this.setState(state, callback);
    		for (var i in this$1.state) {
    			if (!(i in state)) {
    				delete this$1.state[i];
    			}
    		}
    	},

    	getDOMNode: function() {
    		return this.base;
    	},

    	isMounted: function() {
    		return !!this.base;
    	}
    });

    function PureComponent(props, context) {
    	Component$1$1.call(this, props, context);
    }
    F.prototype = Component$1$1.prototype;
    PureComponent.prototype = new F();
    PureComponent.prototype.isPureReactComponent = true;
    PureComponent.prototype.shouldComponentUpdate = function (props, state) {
    	return shallowDiffers(this.props, props) || shallowDiffers(this.state, state);
    };

    function unstable_batchedUpdates(callback) {
    	callback();
    }

    var index = {
    	version: version,
    	DOM: DOM,
    	PropTypes: PropTypes,
    	Children: Children,
    	render: render$1,
    	hydrate: render$1,
    	createClass: createClass,
    	createContext: createContext,
    	createPortal: createPortal,
    	createFactory: createFactory,
    	createElement: createElement,
    	cloneElement: cloneElement$1,
    	createRef: createRef,
    	isValidElement: isValidElement,
    	findDOMNode: findDOMNode,
    	unmountComponentAtNode: unmountComponentAtNode,
    	Component: Component$1$1,
    	PureComponent: PureComponent,
    	unstable_renderSubtreeIntoContainer: renderSubtreeIntoContainer,
    	unstable_batchedUpdates: unstable_batchedUpdates,
    	__spread: extend$1
    };

    /*
    Copyright (c) 2016 Daybrush
    name: scenejs
    license: MIT
    author: Daybrush
    repository: https://github.com/daybrush/scenejs.git
    version: 1.0.4
    */

    var _a;
    var TIMING_FUNCTION = "animation-timing-function";
    var ROLES = {
      transform: {},
      filter: {},
      attribute: {}
    };
    var FIXED = (_a = {}, _a[TIMING_FUNCTION] = true, _a.contents = true, _a);

    //

    var shallowequal = function shallowEqual(objA, objB, compare, compareContext) {
      var ret = compare ? compare.call(compareContext, objA, objB) : void 0;

      if (ret !== void 0) {
        return !!ret;
      }

      if (objA === objB) {
        return true;
      }

      if (typeof objA !== "object" || !objA || typeof objB !== "object" || !objB) {
        return false;
      }

      var keysA = Object.keys(objA);
      var keysB = Object.keys(objB);

      if (keysA.length !== keysB.length) {
        return false;
      }

      var bHasOwnProperty = Object.prototype.hasOwnProperty.bind(objB);

      // Test for A's keys different from B.
      for (var idx = 0; idx < keysA.length; idx++) {
        var key = keysA[idx];

        if (!bHasOwnProperty(key)) {
          return false;
        }

        var valueA = objA[key];
        var valueB = objB[key];

        ret = compare ? compare.call(compareContext, valueA, valueB, key) : void 0;

        if (ret === false || (ret === void 0 && valueA !== valueB)) {
          return false;
        }
      }

      return true;
    };

    /*
    Copyright (c) 2019 Daybrush
    name: react-pure-props
    license: MIT
    author: Daybrush
    repository: git+https://github.com/daybrush/react-pure-props.git
    version: 0.1.2
    */

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
    var extendStatics$1$1 = function (d, b) {
      extendStatics$1$1 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };

      return extendStatics$1$1(d, b);
    };

    function __extends$2$1(d, b) {
      extendStatics$1$1(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var PureProps =
    /*#__PURE__*/
    function (_super) {
      __extends$2$1(PureProps, _super);

      function PureProps() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = PureProps.prototype;

      __proto.shouldComponentUpdate = function (prevProps, prevState) {
        return prevState !== this.state || !shallowequal(prevProps, this.props);
      };

      return PureProps;
    }(index.Component);

    /*
    Copyright (c) 2019 Daybrush
    name: react-css-styler
    license: MIT
    author: Daybrush
    repository: git+https://github.com/daybrush/react-css-styler.git
    version: 0.1.1
    */

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
    var extendStatics$2$1 = function (d, b) {
      extendStatics$2$1 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };

      return extendStatics$2$1(d, b);
    };

    function __extends$3$1(d, b) {
      extendStatics$2$1(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign$1$1 = function () {
      __assign$1$1 = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }

        return t;
      };

      return __assign$1$1.apply(this, arguments);
    };
    function __rest(s, e) {
      var t = {};

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

      if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
        if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
      }
      return t;
    }

    function hash(str) {
      var hash = 5381,
          i    = str.length;

      while(i) {
        hash = (hash * 33) ^ str.charCodeAt(--i);
      }

      /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
       * integers. Since we want the results to be always positive, convert the
       * signed int to an unsigned by doing an unsigned bitshift. */
      return hash >>> 0;
    }

    var stringHash = hash;

    function getHash(str) {
      return stringHash(str).toString(36);
    }
    function injectStyle(className, css) {
      var style = document.createElement("style");
      style.setAttribute("type", "text/css");
      style.innerHTML = css.replace(/([^}{]*){/mg, function (all, selector) {
        return splitComma(selector).map(function (subSelector) {
          return "." + className + " " + subSelector;
        }).join(", ") + "{";
      });
      (document.head || document.body).appendChild(style);
      return style;
    }

    function styled(Tag, css) {
      if (Tag === void 0) {
        Tag = "div";
      }

      var injectClassName = "rCS" + getHash(css);
      var injectCount = 0;
      var injectElement;
      return (
        /*#__PURE__*/
        function (_super) {
          __extends$3$1(Styler, _super);

          function Styler(props) {
            return _super.call(this, props) || this;
          }

          Styler.prototype.render = function () {
            var _a = this.props,
                className = _a.className,
                attributes = __rest(_a, ["className"]);

            return index.createElement(Tag, __assign$1$1({
              className: className + " " + injectClassName
            }, attributes));
          };

          Styler.prototype.componentDidMount = function () {
            if (injectCount === 0) {
              injectElement = injectStyle(injectClassName, css);
            }

            ++injectCount;
          };

          Styler.prototype.componentWillUnmount = function () {
            --injectCount;

            if (injectCount === 0 && injectElement) {
              injectElement.parentNode.removeChild(injectElement);
            }
          };

          return Styler;
        }(index.Component)
      );
    }

    /*
    Copyright (c) 2019 Daybrush
    name: react-scenejs-timeline
    license: MIT
    author: Daybrush
    repository: git+https://github.com/daybrush/scenejs-timeline.git
    version: 0.2.4
    */

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
    var extendStatics$3$1 = function (d, b) {
      extendStatics$3$1 = Object.setPrototypeOf || {
        __proto__: []
      } instanceof Array && function (d, b) {
        d.__proto__ = b;
      } || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
      };

      return extendStatics$3$1(d, b);
    };

    function __extends$4(d, b) {
      extendStatics$3$1(d, b);

      function __() {
        this.constructor = d;
      }

      d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign$2$1 = function () {
      __assign$2$1 = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];

          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }

        return t;
      };

      return __assign$2$1.apply(this, arguments);
    };
    function __rest$1(s, e) {
      var t = {};

      for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

      if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0) t[p[i]] = s[p[i]];
      return t;
    }

    var PREFIX = "scenejs-editor-";
    var SUPPORT_POINTER_EVENTS$2 = "PointerEvent" in window || "MSPointerEvent" in window;
    var SUPPORT_TOUCH$2 = "ontouchstart" in window;
    var CSS = "\n{\n    position: relative;\n    width: 100%;\n    font-size: 0;\n    background: #000;\n    display: flex;\n    flex-direction: column;\n}\n* {\n    box-sizing: border-box;\n    color: #fff;\n}\n.header-area, .scroll-area {\n   width: 100%;\n   position: relative;\n  display: flex;\n  -webkit-align-items: flex-start;\n  align-items: flex-start;\n}\n.header-area {\n  position: relative;\n  z-index: 10;\n  top: 0;\n  height: 30px;\n  min-height: 30px;\n}\n.header-area .keyframes {\n  padding: 0px;\n}\n.header-area .properties-area,\n.header-area .keyframes-area,\n.header-area .values-area,\n.header-area .keyframes-scroll-area {\n    height: 100%;\n}\n.header-area .keyframes-scroll-area {\n    overflow: hidden;\n}\n.header-area .property, .header-area .value, .header-area .keyframes {\n  height: 100%;\n}\n.header-area .property {\n    line-height: 30px;\n}\n.value .add {\n    text-align: center;\n    color: #fff;\n    line-height: 30px;\n    font-weight: bold;\n    font-size: 20px;\n    cursor: pointer;\n}\n.header-area .keyframes-area::-webkit-scrollbar {\n    display: none;\n}\n.header-area .keyframe-cursor {\n    position: absolute;\n    border-top: 10px solid #4af;\n    border-left: 6px solid transparent;\n    border-right: 6px solid transparent;\n    width: 0;\n    height: 0;\n    bottom: 0;\n    top: auto;\n    background: none;\n    cursor: pointer;\n}\n.control-area .keyframes {\n    padding-left: 10px;\n}\n.play-control-area {\n    position: absolute;\n    top: 50%;\n    left: 50%;\n    transform: translate(-50%, -50%);\n}\n.play-control-area .control {\n    position: relative;\n    display: inline-block;\n    vertical-align: middle;\n    color: white;\n    margin: 0px 15px;\n    cursor: pointer;\n}\n.play {\n    border-left: 14px solid white;\n    border-top: 8px solid transparent;\n    border-bottom: 8px solid transparent;\n}\n.pause {\n    border-left: 4px solid #fff;\n    border-right: 4px solid #fff;\n    width: 14px;\n    height: 16px;\n}\n.prev {\n    border-right: 10px solid white;\n    border-top: 6px solid transparent;\n    border-bottom: 6px solid transparent;\n}\n.prev:before {\n    position: absolute;\n    content: \"\";\n    width: 3px;\n    height: 10px;\n    top: 0;\n    right: 100%;\n    transform: translate(0, -50%);\n    background: white;\n}\n.next {\n    border-left: 10px solid white;\n    border-top: 6px solid transparent;\n    border-bottom: 6px solid transparent;\n}\n.next:before {\n    position: absolute;\n    content: \"\";\n    width: 3px;\n    height: 10px;\n    top: 0;\n    transform: translate(0, -50%);\n    background: white;\n}\n.keytime {\n  position: relative;\n  display: inline-block;\n  height: 100%;\n  font-size: 13px;\n  font-weight: bold;\n  color: #777;\n}\n.keytime:last-child {\n  max-width: 0px;\n}\n.keytime span {\n  position: absolute;\n  line-height: 1;\n  bottom: 12px;\n  display: inline-block;\n  transform: translate(-50%);\n  color: #eee;\n}\n.keytime .graduation {\n  position: absolute;\n  bottom: 0;\n  width: 1px;\n  height: 10px;\n  background: #666;\n  transform: translate(-50%);\n}\n.keytime .graduation.half {\n  left: 50%;\n  height: 7px;\n}\n.keytime .graduation.quarter {\n  left: 25%;\n  height: 5px;\n}\n.keytime .graduation.quarter3 {\n  left: 75%;\n  height: 5px;\n}\n.scroll-area {\n  position: relative;\n  width: 100%;\n  height: calc(100% - 60px);\n  overflow: auto;\n}\n.properties-area, .keyframes-area, .values-area {\n  display: inline-block;\n  position: relative;\n  font-size: 16px;\n  overflow: auto;\n}\n\n.properties-area::-webkit-scrollbar, .keyframes-area::-webkit-scrollbar {\n    display: none;\n}\n.properties-area {\n  width: 30%;\n  max-width: 200px;\n  box-sizing: border-box;\n}\n.values-area {\n    width: 50px;\n    min-width: 50px;\n    display: inline-block;\n    border-right: 1px solid #666;\n    box-sizing: border-box;\n}\n.value input {\n    appearance: none;\n    -webkit-appearance: none;\n    outline: none;\n    position: relative;\n    display: block;\n    width: 100%;\n    height: 100%;\n    background: transparent;\n    color: #4af;\n    font-weight: bold;\n    background: none;\n    border: 0;\n    box-sizing: border-box;\n    text-align: center;\n}\n.value {\n\n}\n.alt .value input {\n    cursor: ew-resize;\n}\n.value[data-object=\"1\"] input {\n    display: none;\n}\n.properties-scroll-area {\n  display: inline-block;\n  min-width: 100%;\n}\n.keyframes-area {\n  flex: 1;\n}\n.keyframes-scroll-area {\n  position: relative;\n  min-width: 300px;\n}\n.keyframes, .property, .value {\n  position: relative;\n  height: 30px;\n  line-height: 30px;\n  border-bottom: 1px solid #555;\n  box-sizing: border-box;\n  white-space: nowrap;\n  background: rgba(90, 90, 90, 0.7);\n  z-index: 1;\n}\n\n.property {\n  padding-left: 10px;\n  box-sizing: border-box;\n  font-size: 13px;\n  font-weight: bold;\n  color: #eee;\n}\n.property .remove {\n    position: absolute;\n    display: inline-block;\n    cursor: pointer;\n    width: 18px;\n    height: 18px;\n    top: 0;\n    bottom: 0;\n    right: 10px;\n    margin: auto;\n    border-radius: 50%;\n    border: 2px solid #fff;\n    vertical-align: middle;\n    display: none;\n    margin-left: 10px;\n    box-sizing: border-box;\n}\n.property .remove:before, .property .remove:after {\n    position: absolute;\n    content: \"\";\n    width: 8px;\n    height: 2px;\n    border-radius: 1px;\n    background: #fff;\n    top: 0;\n    left: 0;\n    right: 0;\n    bottom: 0;\n    margin: auto;\n}\n.property .remove:before {\n    transform: rotate(45deg);\n}\n.property .remove:after {\n    transform: rotate(-45deg);\n}\n.property:hover .remove {\n    display: inline-block;\n}\n\n[data-item=\"1\"], [data-item=\"1\"] .add {\n    height: 30px;\n    line-height: 30px;\n}\n.time-area {\n    position: absolute;\n    top: 0;\n    left: 10px;\n    font-size: 13px;\n    color: #4af;\n    line-height: 30px;\n    font-weight: bold;\n    height: 100%;\n    line-height: 30px;\n    border: 0;\n    background: transparent;\n    outline: 0;\n}\n.time-area:after {\n    content: \"s\";\n}\n.property .arrow {\n    position: relative;\n    display: inline-block;\n    width: 20px;\n    height: 25px;\n    cursor: pointer;\n    vertical-align: middle;\n}\n.property .arrow:after {\n    content: \"\";\n    position: absolute;\n    top: 0;\n    right: 0;\n    left: 0;\n    bottom: 0;\n    margin: auto;\n    width: 0;\n    height: 0;\n    border-top: 6px solid #eee;\n    border-left: 4px solid transparent;\n    border-right: 4px solid transparent;\n}\n.property[data-fold=\"1\"] .arrow:after {\n    border-top: 4px solid transparent;\n    border-bottom: 4px solid transparent;\n    border-right: 0;\n    border-left: 6px solid #eee;\n}\n.property[data-object=\"0\"] .arrow {\n    display: none;\n}\n.property.fold, .keyframes.fold, .value.fold {\n    display: none;\n}\n.property.select, .value.select, .keyframes.select {\n    background: rgba(120, 120, 120, 0.7);\n}\n.keyframes {\n\n}\n.keyframe-delay {\n  position: absolute;\n  top: 3px;\n  bottom: 3px;\n  left: 0;\n  background: #4af;\n  opacity: 0.2;\n  z-index: 0;\n}\n.keyframe-group {\n    position: absolute;\n    top: 3px;\n    bottom: 3px;\n    left: 0;\n    background: #4af;\n    opacity: 0.6;\n    border: 1px solid rgba(0, 0, 0, 0.2);\n    border-left-color: rgba(255, 255, 255, 0.2);\n    border-top-color: rgba(255, 255, 255, 0.2);\n    z-index: 0;\n}\n.keyframe-line {\n  position: absolute;\n  height: 8px;\n  top: 0;\n  bottom: 0;\n  margin: auto;\n  background: #666;\n  z-index: 0;\n}\n.keyframe {\n  position: absolute;\n  font-size: 0px;\n  width: 12px;\n  height: 12px;\n  top: 0px;\n  bottom: 0px;\n  margin: auto;\n  background: #fff;\n  border: 2px solid #383838;\n  border-radius: 2px;\n  box-sizing: border-box;\n  transform: translate(-50%) rotate(45deg);\n  z-index: 1;\n  cursor: pointer;\n}\n.keyframe[data-no=\"1\"] {\n    opacity: 0.2;\n}\n.select .keyframe {\n    border-color: #555;\n}\n.keyframe.select {\n    background: #4af;\n}\n.keyframes-container, .line-area {\n  position: relative;\n  width: calc(100% - 30px);\n  left: 15px;\n  height: 100%;\n}\n.line-area {\n  position: absolute;\n  top: 0;\n  z-index: 0;\n}\n.keyframe-cursor {\n  position: absolute;\n  top: 0;\n  z-index: 1;\n  background: #4af;\n  width: 1px;\n  height: 100%;\n  left: 15px;\n  transform: translate(-50%);\n}\n.scroll-aare .keyframe-cursor {\n  pointer-events: none;\n}\n.division-line {\n  position: absolute;\n  background: #333;\n  width: 1px;\n  height: 100%;\n  transform: translate(-50%);\n}\n".replace(/\.([^{,\s\d.]+)/g, "." + PREFIX + "$1");
    var DIRECTION = "direction";
    var ITERATION_COUNT = "iterationCount";
    var DELAY = "delay";
    var PLAY_SPEED = "playSpeed";
    var ALTERNATE = "alternate";
    var REVERSE = "reverse";
    var ALTERNATE_REVERSE = "alternate-reverse";
    var INFINITE = "infinite";

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
    function hasClass$1(target, className) {
      return hasClass(target, "" + PREFIX + className);
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
      foldedInfo[id] = !foldedInfo[id];

      if (!isNotUpdate) {
        target.setState({
          foldedInfo: __assign$2$1({}, foldedInfo)
        });
      }
    }

    var ElementComponent =
    /*#__PURE__*/
    function (_super) {
      __extends$4(ElementComponent, _super);

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
      __extends$4(TimeArea, _super);

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
      __extends$4(ControlArea, _super);

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
      __extends$4(KeyframeCursor, _super);

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
      __extends$4(KeytimesArea, _super);

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
        setDrag(this.cursor.getElement(), {
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
      __extends$4(HeaderArea, _super);

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
      __extends$4(Keyframe, _super);

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
      __extends$4(KeyframeGroup, _super);

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
    }(Component$1$1);

    var KeyframeDelay =
    /*#__PURE__*/
    function (_super) {
      __extends$4(KeyframeDelay, _super);

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
    }(Component$1$1);

    var KeyframeLine =
    /*#__PURE__*/
    function (_super) {
      __extends$4(KeyframeLine, _super);

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
    }(Component$1$1);

    var Keyframes =
    /*#__PURE__*/
    function (_super) {
      __extends$4(Keyframes, _super);

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
          var delayedIndex = 0;

          for (var i = 1; i < length; ++i) {
            var iterationTime = frames[i][1];

            if (frames[i - 1][1] === iterationTime && (iterationTime === 0 || iterationTime === duration)) {
              delayedIndex = i;
            } else {
              break;
            }
          }

          var index = findIndex(frames, function (_a) {
            var value = _a[2];
            return !isUndefined(value);
          });
          startIndex = Math.min(length - 2, Math.max(delayedIndex, index));
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
      __extends$4(KeyframesArea, _super);

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
      __extends$4(Property, _super);

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
      __extends$4(PropertiesArea, _super);

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
      __extends$4(Value, _super);

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
      __extends$4(ValuesArea, _super);

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
        setDrag(element, {
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
          return hasClass$1(el, "value");
        });

        if (!parentEl) {
          return;
        }

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
      __extends$4(ScrollArea, _super);

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

          if (isParent) {
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
            return hasClass$1(el, "arrow");
          });
          var isClickRemove = getTarget(e.target, function (el) {
            return hasClass$1(el, "remove");
          });
          var target = getTarget(e.target, function (el) {
            return hasClass$1(el, "property");
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
    function toFixed$1(num) {
      return Math.round(num * MAXIMUM) / MAXIMUM;
    }
    function addEntry(entries, time, keytime) {
      var prevEntry = entries[entries.length - 1];
      (!prevEntry || prevEntry[0] !== time || prevEntry[1] !== keytime) && entries.push([toFixed$1(time), toFixed$1(keytime)]);
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
                var divideTime = dot(prevEntry[1], time, lastTime - prevTime, currentTime - lastTime);
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
    function getFiniteEntries(times, states) {
      var infiniteIndex = findIndex(states, function (state) {
        return state[ITERATION_COUNT] === INFINITE;
      }, states.length - 1) + 1;
      return getEntries(times, states.slice(0, infiniteIndex));
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
      var entries = getFiniteEntries(times, states);
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
            var entries = getFiniteEntries(times, items.slice(1).map(function (animator) {
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

    var TimelineElement = styled("div", CSS);

    var Timeline =
    /*#__PURE__*/
    function (_super) {
      __extends$4(Timeline, _super);

      function Timeline(props) {
        var _this = _super.call(this, props) || this;

        _this.values = {};
        _this.state = {
          alt: false,
          zoom: 1,
          maxDuration: 0,
          maxTime: 0,
          timelineInfo: {},
          selectedProperty: "",
          selectedTime: -1,
          init: false,
          updateTime: false
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
            updateTime: true,
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

          var activeElement = document.activeElement;

          if (activeElement && activeElement.blur) {
            activeElement.blur();
          }

          var scene = _this.props.scene;

          if (!scene) {
            return;
          }

          scene.pause();
          var state = _this.state;

          if (_this.props.onSelect) {
            var prevSelectedProperty = state.selectedProperty,
                prevSelectedTime = state.selectedTime,
                timelineInfo = state.timelineInfo;
            var propertiesInfo = timelineInfo[property];
            var selectedItem = property ? propertiesInfo.item : _this.props.scene;
            var selectedName = property ? propertiesInfo.names.join("///") : "";

            _this.props.onSelect({
              selectedItem: selectedItem,
              selectedName: selectedName,
              selectedProperty: property,
              selectedTime: time,
              prevSelectedProperty: prevSelectedProperty,
              prevSelectedTime: prevSelectedTime
            });
          }

          if (isNotUpdate) {
            state.selectedProperty = property;
            state.selectedTime = time;
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

        _this.state = __assign$2$1({}, _this.state, _this.initScene(_this.props.scene, false));
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
            attributes = __rest$1(_a, ["scene", "className", "keyboard", "onSelect"]);

        var _b = this.state,
            zoom = _b.zoom,
            alt = _b.alt,
            maxDuration = _b.maxDuration,
            maxTime = _b.maxTime,
            timelineInfo = _b.timelineInfo,
            selectedProperty = _b.selectedProperty,
            selectedTime = _b.selectedTime;
        return createElement(TimelineElement, __assign$2$1({
          className: prefix("timeline" + (alt ? " alt" : "")) + (className ? " " + className : "")
        }, attributes), createElement(ControlArea, {
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
        var state = this.state;

        if (state.init) {
          state.init = false;
          this.scrollArea.foldAll();
        }

        if (prevProps.scene !== this.props.scene) {
          this.releaseScene(prevProps.scene);
          this.setState(this.initScene(this.props.scene, true));
        }

        if (state.updateTime) {
          state.updateTime = false;
          this.setTime();
        }
      };

      __proto.getValues = function () {
        return this.values;
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

        var roles = ROLES;
        var nextProperties = properties.concat([property]);
        var isRole = nextProperties.every(function (name) {
          if (isObject(roles[name])) {
            roles = roles[name];
            return true;
          }

          return false;
        });
        item.set.apply(item, [item.getIterationTime()].concat(nextProperties, [isRole ? {} : ""]));
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
        this.values = obj;
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

      __proto.initScene = function (scene, isInit) {
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
          init: isInit || false
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

        if (SUPPORT_TOUCH$2 || SUPPORT_POINTER_EVENTS$2) {
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
            return hasClass$1(el, "keyframe");
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
          setDrag(element, {
            container: window,
            dragstart: function (_a) {
              var inputEvent = _a.inputEvent;
              dragTarget = getTarget(inputEvent.target, function (el) {
                return hasClass$1(el, "keyframe-group");
              });

              if (dragTarget) {
                var properties = _this.scrollArea.propertiesArea.properties;
                var keyframesElement = getTarget(dragTarget, function (el) {
                  return hasClass$1(el, "keyframes");
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

              if (dragTarget && dragItem) {
                var nextDelay = Math.max(dragDelay + _this.getDistTime(distX), 0);

                if (dragItem.getDelay() !== nextDelay) {
                  dragItem.setDelay(nextDelay);

                  _this.update();
                }
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
          if (_this.state.alt === true) {
            _this.setState({
              alt: false
            });
          }
        });

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
    }(PureProps);

    var Timeline$1 =
    /*#__PURE__*/
    function (_super) {
      __extends$3(Timeline$1, _super);

      function Timeline$1() {
        return _super !== null && _super.apply(this, arguments) || this;
      }

      var __proto = Timeline$1.prototype;

      __proto.render = function () {
        var _this = this;

        return h(Timeline, __assign$2({}, this.props, {
          ref: function (e) {
            _this.timeline = e;
          }
        }));
      };

      __proto.update = function (isInit) {
        this.timeline.update(isInit);
      };

      __proto.prev = function () {
        this.timeline.prev();
      };

      __proto.next = function () {
        this.timeline.next();
      };

      __proto.finish = function () {
        this.timeline.finish();
      };

      __proto.togglePlay = function () {
        this.timeline.togglePlay();
      };

      return Timeline$1;
    }(Component);

    var Timeline$2 =
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
        render(h(Timeline$1, __assign({
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
    }(Component$1);

    return Timeline$2;

}));
//# sourceMappingURL=timeline.pkgd.js.map
