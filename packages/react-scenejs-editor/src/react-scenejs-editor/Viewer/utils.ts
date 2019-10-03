import * as ReactDOM from "react-dom";

export function findDOMRef(component: any, name: string) {
    return (e: any) => {
        e && (component[name] = ReactDOM.findDOMNode(e));
    };
}
