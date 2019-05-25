import * as React from "react";
import * as ReactDOM from "react-dom";

export default class ElementComponent<T = {}, U = {}> extends React.PureComponent<T, U> {
    private element: HTMLElement;
    public getElement() {
        return this.element || (this.element = ReactDOM.findDOMNode(this) as HTMLElement);
    }
}
