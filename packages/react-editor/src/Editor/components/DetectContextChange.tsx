import { Context, forwardRef, MutableRefObject, RefObject, useContext, useEffect, useRef } from "react";

export interface DetectContextChangeProps<T> {
    context: Context<T>;
    contextRef: MutableRefObject<T>;
    onChange?: (value: T, prevValue: T) => any;
}

export default function DetectContextChange<T>({ context, contextRef, onChange }: DetectContextChangeProps<T>) {
    const value = useContext(context);
    const valueRef = useRef<T>(value);

    useEffect(() => {
        contextRef.current = value;
        const prevValue = valueRef.current;
        if (prevValue != value) {
            valueRef.current = value;
            onChange && onChange(value, prevValue);
        }
    }, [value, onChange]);

    return null;
}
