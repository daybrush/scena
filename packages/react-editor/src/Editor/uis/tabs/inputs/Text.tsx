import { getKey } from "keycon";
import * as React from "react";
import { styled, StyledElement } from "react-css-styled";


const TextElement = styled("input", `
{
    position: relative;
    text-align: left;
    appearance: none;
    -webkit-appearance: none;
    outline: none;
    display: block;
    width: 100%;
    height: 30px;
    color: var(--scena-editor-color-main);
    font-weight: bold;
    border: 0;
    padding: 5px;
    box-sizing: border-box;
    background: transparent;
    font-size: 12px;
}
`);

export interface TextProps extends React.InputHTMLAttributes<HTMLInputElement> {
    onChangeValue?(value: string): void;
}

export interface TextInstance {
    setValue(value: string): void;
    getElement(): HTMLInputElement;
}
export const Text = React.forwardRef<TextInstance, TextProps>((props, ref) => {
    const styledRef = React.useRef<HTMLInputElement>(null);
    const prevValueRef = React.useRef<string>("0");

    React.useImperativeHandle(ref, () => {
        const element = styledRef.current!;
        return {
            setValue(value: string) {
                prevValueRef.current = value;
                element.value = value;
            },
            getElement() {
                return element;
            },
        };
    }, []);

    const {
        onChangeValue,
        defaultValue,
        ...childProps
    } = props;

    React.useEffect(() => {
        const element = styledRef.current!;

        prevValueRef.current = defaultValue as any;
        element.value = defaultValue as any;
    }, [defaultValue]);
    return <TextElement
        ref={styledRef}
        type="text"
        {...childProps}
        defaultValue={defaultValue}
        onKeyDown={(e: any) => {
            e.stopPropagation();
            (e.nativeEvent || e).stopPropagation();
        }}
        onKeyUp={(e: any) => {
            const target = e.currentTarget as HTMLInputElement;
            const value = target.value;

            e.stopPropagation();
            if (getKey(e.keyCode) === "enter" && prevValueRef.current !== value) {
                onChangeValue?.(value);
            }
        }}
        onBlur={(e: any) => {
            const target = e.currentTarget as HTMLInputElement;
            const value = target.value;

            if (prevValueRef.current !== value) {
                onChangeValue?.(value);
            }
        }} />;
});


Text.displayName = "Text";
