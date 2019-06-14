import { createContext } from "preact-context";
// tslint:disable-next-line: no-var-requires
import * as compat from "preact-compat";

const forwardRef = (f: any) => f;

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
};
export default compat2;
