import { isObject } from "@daybrush/utils";
import * as React from "react";

export interface ConnectContextProps {
    contexts: Record<string, React.Context<any>>;
    children: React.ReactNode;
}
export function ConnectContext(props: ConnectContextProps): React.ReactElement {
    const contexts = props.contexts;
    const value: Record<string, any> = {};
    for (const name in contexts) {
        value[name] = React.useContext(contexts[name]);
    }

    return <>{React.Children.toArray(props.children).map(jsx => {
        if (isObject(jsx) && "type" in jsx) {
            return React.cloneElement(jsx, value) as React.ReactElement;
        }
        return jsx as React.ReactElement;
    })}</>;
}


export function connectContext(context: React.Context<any>, properties: readonly string[]) {
    return function (Component: any) {
        const prototype = Component.prototype;

        Component.context = context;

        properties.forEach(name => {
            Object.defineProperty(prototype, name, {
                get: function () {
                    return this.context[name];
                },
                set: function () {
                    this.context[name](name);
                }
            });
        });
    }
};
