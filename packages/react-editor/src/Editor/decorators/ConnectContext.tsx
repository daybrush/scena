import * as React from "react";

export function connectContext(context: React.Context<any>, properties: readonly string[]) {
    return function (Component: any) {
        const prototype = Component.prototype;

        Component.contextType = context;

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
