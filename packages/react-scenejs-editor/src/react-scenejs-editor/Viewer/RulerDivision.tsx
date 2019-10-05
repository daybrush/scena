import * as React from "react";
import styled from "react-css-styler";
import { prefixCSS } from "framework-utils";

const RulerDivisionElement = styled("div", prefixCSS("scenejs-editor-", `
{
    position: relative;
}
:host:before {
    content: "";
    position: absolute;
    background: #777;
    bottom: 0;
}

.horizontal :host {
    display: inline-block;
    width: 10%;
    height: 100%;
}
.vertical :host {
    display: block;
    width: 100%;
    height: 10%;
}

.horizontal :host:before {
    width: 1px;
    height: 10px;
}
.vertical :host:before {
    width: 10px;
    height: 1px;
    bottom: 0;
    right: 0;
}

.horizontal :host:nth-child(2n):before {
    height: 7px;
}
.vertical :host:nth-child(2n + 1):before {
    width: 7px;
}
.horizontal :host:first-child:before {
    width: 1px;
    height: 100%;
}
.vertical :host:last-child:before {
    height: 1px;
    width: 100%;
}
`));

export default RulerDivisionElement;
