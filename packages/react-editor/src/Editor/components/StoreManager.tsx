import * as React from "react";
import { StoreRootContext, StoreState } from "../Store/Store";

export class StoreManager extends React.PureComponent {
    public static contextType = StoreRootContext;
    declare context: NonNullable<React.ContextType<typeof StoreRootContext>>;


    public get<T>(state: StoreState<T>) {
        return this.context.get(state);
    }
    public set<T>(state: StoreState<T>, value: T) {
        return this.context.set(state, value);
    }
}
