import * as React from "react";
import { useStoreStateValue } from "../../Store/Store";
import { $historyManager } from "../../stores/stores";
import { prefix } from "../../utils/utils";
import styled from "react-css-styled";
import { useAction } from "../../hooks/useAction";

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
    background: var(--scena-editor-color-selected2);
}
.scena-tab-history:not(.scena-tab-history-selected):hover:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border: 1px solid var(--scena-editor-color-selected2);
    box-sizing: border-box;
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
            className={prefix("tab-history", !currentHistory ? "tab-history-selected" : "")}
        >Initial History</div>
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
