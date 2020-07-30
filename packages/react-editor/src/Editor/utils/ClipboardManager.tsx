import * as React from "react";
import { ClipboardItem, SavedScenaData } from "../types";
import Editor from "../Editor";
import { checkInput } from "./utils";
import html2canvas from "html2canvas";
import { TYPE_SCENA_LAYERS } from "../consts";
import MoveableGroup from "react-moveable/declaration/MoveableGroup";


export default class ClipboardManager {
    constructor(private editor: Editor) {
        document.addEventListener("cut", this.onCut);
        document.addEventListener("copy", this.onCopy);
        document.addEventListener("paste", this.onPaste);
    }
    public destroy() {
        document.removeEventListener("cut", this.onCut);
        document.removeEventListener("copy", this.onCopy);
        document.removeEventListener("paste", this.onPaste);
    }
    public copy() {
        document.execCommand("copy");
    }
    public cut() {
        document.execCommand("cut");
    }
    public paste() {
        document.execCommand("paste");
    }
    public copyImage() {
        const moveableData = this.editor.moveableData;
        const targets = moveableData.getSelectedTargets();
        const moveable = this.editor.getMoveable();
        const length = targets.length;
        const moveables = length > 1 ? (moveable.moveable as MoveableGroup).moveables : [];

        return new Promise(resolve => {
            Promise.all(targets.map(target => html2canvas(target as HTMLElement))).then(images => {
                let imageCanvas: HTMLCanvasElement;
                if (length > 1) {
                    const parentRect = moveable.getRect();
                    const canvas = document.createElement("canvas");
                    canvas.width = parentRect.width;
                    canvas.height = parentRect.height;
                    const context = canvas.getContext("2d")!;
                    const rects = moveables.map(m => m.getRect());

                    rects.forEach((rect, i) => {
                        context.drawImage(images[i], rect.left - parentRect.left, rect.top - parentRect.top);
                    });

                    imageCanvas = canvas;
                } else {
                    imageCanvas = images[0];
                }
                imageCanvas.toBlob(blob => {
                    (navigator.clipboard as any).write([
                        new (window as any).ClipboardItem({
                            "image/png": blob,
                        }),
                    ]);
                    resolve();
                });
            });
        });
    }
    private onCut = (e: any) => {
        const copied = this.onCopy(e);

        if (!copied) {
            return;
        }
        this.editor.console.log("cut scena data");
        this.editor.removeElements(this.editor.getSelectedTargets());
    }

    private onCopy = async (e: any) => {
        if (checkInput(e.target)) {
            return false;
        }
        e.preventDefault();

        const clipboardData = (e as any).clipboardData as DataTransfer;
        const moveableData = this.editor.moveableData;
        const targets = moveableData.getSelectedTargets();
        const SavedScenaData = this.editor.saveTargets(targets);

        this.editor.console.log("copy scena data", SavedScenaData);
        clipboardData.setData(TYPE_SCENA_LAYERS, JSON.stringify(SavedScenaData));

        return true;
    }
    private onPaste = (e: any) => {
        if (checkInput(e.target)) {
            return;
        }

        this.read((e as any).clipboardData);
        e.preventDefault();
    }
    private readDataTransfter(data: DataTransfer) {
        const types = data.types;
        const hasScena = types.indexOf(TYPE_SCENA_LAYERS) > -1;

        if (hasScena) {
            const scenaDatas = JSON.parse(data.getData(TYPE_SCENA_LAYERS)) as SavedScenaData[];

            this.editor.console.log("paste scena data", scenaDatas);

            this.editor.loadDatas(scenaDatas);
            return true;
        }
        return false;
    }
    private async read(data: DataTransfer) {
        if (this.readDataTransfter(data)) {
            return true;
        }
        const clipboardItems: ClipboardItem[] = await (navigator.clipboard as any).read();

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

            this.editor.appendJSXs([{
                jsx: <div contentEditable="true"></div>,
                name: "(Text)",
                innerText: text,
            }]);
        }
    }
}
