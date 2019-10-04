import * as ReactDOM from "react-dom";

export function findDOMRef(component: any, name: string) {
    return (e: any) => {
        e && (component[name] = ReactDOM.findDOMNode(e));
    };
}

export function getTranslateName(type: "vertical" | "horizontal", isReverse?: boolean) {
    const isHorizontal = type === "horizontal";

    return `translate${(!isReverse && isHorizontal) || (isReverse && !isHorizontal) ? "Y" : "X"}`;
}
