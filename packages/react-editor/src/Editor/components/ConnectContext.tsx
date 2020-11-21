import { isObject } from "@daybrush/utils";
import * as React from "react";

export interface ConnectContextProps {
    context: React.Context<any>;
    children: React.ReactNode;
}
export function ConnectContext(props: ConnectContextProps): React.ReactElement {
    const value = React.useContext(props.context);

    return <>{React.Children.toArray(props.children).map(jsx => {
        if (isObject(jsx) && "type" in jsx) {
            return React.cloneElement(jsx, value) as React.ReactElement;
        }
        return jsx as React.ReactElement;
    })}</>;
}
