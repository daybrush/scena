import { getKeys } from "@daybrush/utils";
import { Context, createElement, ReactNode, useContext, useEffect, useRef } from "react";

export interface ContextConsumersProps<T extends Record<string, Context<any>>> {
    contexts: T;
    children: (value: { [key in keyof T]: T[key] extends Context<infer U> ? U : never }) => ReactNode;
}

export default function ContextConsumers<T extends Record<string, Context<any>>>(props: ContextConsumersProps<T>) {


    const contexts = props.contexts;
    const keys = getKeys(contexts);
    const obj: Record<string, any> = {};

    /*
    <Consumer>
        {v1 => {
            obj[k1] = v1;

            return <Consumer>
                {v2 => {
                    obj[k2] = v2;

                    return <Consumer>
                        {v3 => {
                            obj[k3] = v3;

                            return children(obj);
                        }}
                    </Consumer>
                }}
            </Consumer>
        }}
     */

    return keys.reduce((cur: ReactNode, key: string) => {
        return createElement(contexts[key].Consumer, null, (value: any) => {
            obj[key] = value;

            return cur || props.children(obj as any);
        });
    }, null);
}
