import * as React from "react";
import { useStoreStateValue } from "@scena/react-store";
import { $historyManager } from "../../stores/stores";
import { prefix } from "../../utils/utils";
import styled from "react-css-styled";
import { useAction } from "../../hooks/useAction";
import { FOLDER_DEFAULT_STYLE } from "./FolderStyls";

const HistoryElement = styled("div", `
${FOLDER_DEFAULT_STYLE}
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
    padding: 0px 10px;
}
.scena-folder-file {
    color: var(--scena-editor-color-text);
}
.scena-folder-selected {
    background: var(--scena-editor-color-folder-selected);
}
`);





export default function HistoryTab() {
    const historyManager = useStoreStateValue($historyManager);
    const currentHistory = historyManager.currentHistory;

    useAction("history.redo");
    useAction("history.undo");
    useAction("history.add");

    return <HistoryElement>
        <div
            className={prefix("tab-history", "folder-file", !currentHistory ? "folder-selected" : "")}
        >Initial History</div>
        {[
            ...historyManager.undoStack,
            ...historyManager.redoStack,
        ].map((history, i) => {
            return <div
                key={i}
                className={prefix("tab-history", "folder-file", currentHistory === history ? "folder-selected" : "")}
            >
                {history.description || history.type}
            </div>;
        })}
    </HistoryElement>;
}
