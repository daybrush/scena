

import * as React from "react";
import Folder, { FileProps } from "../Folder";
import { useStoreStateValue } from "../../Store/Store";
import { $editor, $historyManager, $layerManager, $selectedTargetList } from "../../stores/stores";
import { prefix } from "../../utils/utils";
import styled from "react-css-styled";
import { SCENA_LAYER_SEPARATOR } from "../../consts";
import { isObject } from "@daybrush/utils";
import { useAction } from "../../hooks/useAction";
import { Frame } from "scenejs";
import { Text } from "./inputs/Text";

const HistoryElement = styled("div", `
{
    max-height: 100px;
    overflow: auto;
}
.scena-tab-history {
    position: relative;
    box-sizing: border-box;
    height: 30px;
    line-height: 30px;
    width: 100%;
    font-size: 12px;
    color: #fff;
    padding: 0px 10px;
}
.scena-tab-history-selected {
    background: var(--scena-editor-color-selected);
}
.scena-tab-history:not(.scena-tab-history-selected):hover:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border: 1px solid var(--scena-editor-color-selected);
    box-sizing: border-box;
}
`);





export default function HistoryTab() {
    const historyManager = useStoreStateValue($historyManager);

    useAction("history.redo");
    useAction("history.undo");
    useAction("history.add");

    const currentHistory = historyManager.currentHistory;
    return <HistoryElement>
        {[
            ...historyManager.undoStack,
            ...historyManager.redoStack,
        ].map((history, i) => {
            return <div
                key={i}
                className={prefix("tab-history", currentHistory === history ? "tab-history-selected" : "")}
            >
                {history.description || history.type}
            </div>;
        })}
    </HistoryElement>;
}
