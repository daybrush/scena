import * as React from "react";
import styled from "react-css-styled";


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

}
export function Text(props: TextProps) {
    return <TextElement type="text" {...props} />;
}
