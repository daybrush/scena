import * as React from "react";
import { ClipboardItem, SavedInfo } from "../types";
import Editor from "../Editor";
import { checkInput } from "./utils";

export default class ClipboardManager {
    constructor(private editor: Editor) {
        document.addEventListener("copy", this.onCopy);
        document.addEventListener("paste", this.onPaste);
    }
    public destroy() {
        document.removeEventListener("copy", this.onCopy);
        document.removeEventListener("paste", this.onPaste);
    }
    private onCopy = (e: any) => {
        if (checkInput(e.target)) {
            return;
        }
        const clipboardData = (e as any).clipboardData as DataTransfer;
        const moveableData = this.editor.moveableData;
        const targets = moveableData.getSelectedTargets();
        const savedData = this.editor.saveTargets(targets);

        this.editor.console.log("copy scena data", savedData);


        clipboardData.setData("text/plain", "Scena Copy");
        clipboardData.setData("text/scena", JSON.stringify(savedData));

        e.preventDefault();
    }
    private onPaste = (e: any) => {
        this.read((e as any).clipboardData);
        e.preventDefault();
    }
    private readDataTransfter(data: DataTransfer) {
        const types = data.types;
        const hasScena = types.indexOf("text/scena") > -1;

        if (hasScena) {
            const scenaData = JSON.parse(data.getData("text/scena")) as SavedInfo[];

            this.editor.console.log("paste scena data", scenaData);
            this.editor.appendJSXs(scenaData.map(data => ({
                ...data,
                jsx: React.createElement(data.tagName),
            })));
            return true;
        }
        return false;
    }
    private async read(data: DataTransfer) {
        if (this.readDataTransfter(data)) {
            return true;
        }
        const clipboardItems: ClipboardItem[] = await(navigator.clipboard as any).read();

        let hasText = false;
        const isPaste = clipboardItems.filter(item => {
            const types = item.types;

            const hasImage = types.indexOf("image/png") > -1;
            hasText = hasText || types.indexOf("text/plain") > -1;

            if (hasImage) {
                item.getType("image/png").then(blob => {
                    this.editor.appendBlob(blob);
                });
                return true;
            }
            return false;
        }).length > 0;

        if (!isPaste && hasText) {
            const text = await navigator.clipboard.readText();

            const addedInfo = await this.editor.getViewport().appendJSXs([{
                jsx: <div contentEditable="true"></div>,
                name: "(Text)",
            }]);

            addedInfo.added[0].el!.innerText = text;
            this.editor.appendComplete(addedInfo);
        }
    }
}
