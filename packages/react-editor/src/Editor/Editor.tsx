import * as React from "react";
import EditorManager from "./EditorManager";
import { StoreRoot } from "./Store/Store";


export default function Editor() {
    return <StoreRoot>
        <EditorManager />
    </StoreRoot>
}
