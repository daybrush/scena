import * as React from "react";
import * as ReactDOM from "react-dom";

export default class ElementComponent<T = {}, U = {}, C extends HTMLElement = HTMLElement>
    extends React.PureComponent<T, U> {
    private element!: C;
    public getElement() {
        return this.element || (this.element = ReactDOM.findDOMNode(this) as C);
    }
}
