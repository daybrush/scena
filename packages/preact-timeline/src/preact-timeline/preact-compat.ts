import { createContext } from "preact-context";
// tslint:disable-next-line: no-var-requires
import * as compat from "preact-compat";

const {
    cloneElement,
    Component,
    createElement,
    render,
    createClass,
    findDOMNode,
    PureComponent,
} = compat;

const compat2 = compat;

compat2.createContext = createContext;

export {
    render,
    createClass,
    findDOMNode,
    Component,
    createElement,
    cloneElement,
    createContext,
    PureComponent,
};
export default compat2;
