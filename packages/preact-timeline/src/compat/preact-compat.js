import { createContext } from "preact-context";
import * as compat from "preact-compat";


const forwardRef = f => f;

const {
    cloneElement,
    Component,
    createElement,
    render,
    createClass,
    findDOMNode,
    PureComponent,
    version,
    DOM,
    PropTypes,
    Children,
    hydrate,
    createPortal,
    createFactory,
    createRef,
    isValidElement,
    unmountComponentAtNode,
    unstable_renderSubtreeIntoContainer,
    unstable_batchedUpdates,
    __spread,
} = compat;

const compat2 = compat;

compat2.createContext = createContext;
compat2.forwardRef = forwardRef;

export {
    render,
    createClass,
    findDOMNode,
    Component,
    createElement,
    cloneElement,
    createContext,
    PureComponent,
    forwardRef,
    version,
    DOM,
    PropTypes,
    Children,
    hydrate,
    createPortal,
    createFactory,
    createRef,
    isValidElement,
    unmountComponentAtNode,
    unstable_renderSubtreeIntoContainer,
    unstable_batchedUpdates,
    __spread,
};
export default compat2;
