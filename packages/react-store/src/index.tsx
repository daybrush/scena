/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react";
import EventEmitter from "@scena/event-emitter";

export interface StoreRootValue {
    map: Map<StoreState<any>, StoreValue<any>>;
    get<T>(state: StoreState<T>): T;
    set<T>(state: StoreState<T>, value: T): boolean;
}

export interface StoreValue<T> {
    value: NonNullable<T>;
    update(value: T): boolean;
    subscribe(callback: () => void): void;
    unsubscribe(callback?: () => void): void;
}

export type StoreCompute = <T>(state: StoreState<T>) => T;


export interface StoreState<T> {
    id: number;
    defaultValue: T;
    compute?(e: { get: StoreCompute }): T;
}

export type StoreStateType<T extends StoreState<any>> = T extends StoreState<infer U> ? U : never;

export const StoreRootContext = React.createContext<StoreRootValue | null>(null);

let id = 0;

function clone(value: any) {
    return JSON.parse(JSON.stringify(value));
}

function getStoreValue(root: StoreRootValue, state: StoreState<any>, hooksDefaultValue?: any) {
    const defaultValue = state.defaultValue;

    if (!root.map.has(state)) {
        const emitter = new EventEmitter();

        root.map.set(state, {
            value: hooksDefaultValue ?? (defaultValue == null ? defaultValue : clone(state.defaultValue)),
            update(value: any) {
                if (value === this.value) {
                    return false;
                }
                this.value = value;
                emitter.emit("update");
                return true;
            },
            subscribe(callback: () =>void) {
                emitter.on("update", callback);
            },
            unsubscribe(callback: () =>void) {
                emitter.off("update", callback);
            },
        });
    }
    const result =  root.map.get(state)!;

    if (hooksDefaultValue) {
        result.value = hooksDefaultValue;
    }
    return result;
}

export function atom<T>(defaultValue: T) {
    const value: StoreState<T> = {
        id: ++id,
        defaultValue,
    };

    return value;
}

export function compute<T>(callback: (e: { get: StoreCompute }) => T) {
    const value: StoreState<T> = {
        id: ++id,
        defaultValue: null as any,
        compute: callback,
    };
    return value;
}

export function useStoreRoot() {
    return useContext(StoreRootContext)!;
}

export function useStoreValue<T>(state: StoreState<T>, hooksDefaultValue?: NonNullable<T>): StoreValue<T> {
    const root = useStoreRoot();

    return getStoreValue(root, state, hooksDefaultValue);
}

export function useStoreState<T>(state: StoreState<T>): [NonNullable<T>, (value: T) => void] {
    return [useStoreStateValue(state), useStoreStateSetValue(state)];
}

export function useStoreStateSetValue<T>(state: StoreState<T>): (value: T) => void {
    const storeValue = useStoreValue(state);

    return useCallback((value: T) => {
        storeValue.update(value);
    }, [storeValue]);
}

export function useStoreStateSetPromise<T>(state: StoreState<T>): (value: T) => Promise<boolean> {
    const value = useStoreStateValue(state);
    const storeValue = useStoreValue(state);
    const [queue] = useState<Array<(value: boolean) => void>>([]);

    useEffect(() => {
        queue.forEach(resolve => {
            resolve(true);
        });
        queue.length = 0;
    }, [value]);

    return useCallback((value: T) => {
        if (storeValue.update(value)) {
            return new Promise(resolve => {
                queue.push(resolve);
            });
        }
        return Promise.resolve(false);
    }, [storeValue]);
}

export function useStoreStateValue<T>(value: StoreState<T>): NonNullable<T> {
    const storeValue = useStoreValue(value);
    const [state, setState] = useState(storeValue?.value);

    useEffect(() => {
        const callback = () => {
            setState(storeValue.value);
        };
        storeValue.subscribe(callback);

        return () => {
            storeValue.unsubscribe(callback);
        };
    }, [storeValue]);

    return state;
}


export function StoreRoot(props: { children?: React.ReactNode }) {
    const rootValue = useMemo<StoreRootValue>(() => {
        const rootValue = {
            map: new Map(),
            get<T>(state: StoreState<T>): T {
                const storeValue = getStoreValue(rootValue, state);

                return storeValue.value;
            },
            set<T>(state: StoreState<T>, value: T): boolean {
                const storeValue = getStoreValue(rootValue, state);

                return storeValue.update(value);
            },
        };

        return rootValue;
    }, []);

    useEffect(() => {
        return () => {
            rootValue.map.clear();
        };
    }, []);

    return <StoreRootContext.Provider value={rootValue}>
        {props.children}
    </StoreRootContext.Provider>;
}
