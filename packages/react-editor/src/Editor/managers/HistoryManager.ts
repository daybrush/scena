import { IObject } from "@daybrush/utils";
import { EditorManagerInstance } from "../EditorManager";
import Debugger from "../utils/Debugger";

export type RestoreCallback = (props: any, editor: EditorManagerInstance) => any;
export interface HistoryAction {
    type: string;
    props: IObject<any>;
}
export default class HistoryManager {
    private undoStack: HistoryAction[] = [];
    private redoStack: HistoryAction[] = [];
    private types: IObject<{ redo: RestoreCallback, undo: RestoreCallback }> = {};
    constructor(private _editorRef: React.MutableRefObject<EditorManagerInstance | undefined>) { }
    public registerType(type: string, undo: RestoreCallback, redo: RestoreCallback) {
        this.types[type] = { undo, redo };
    }
    public addHistory(type: string, props: IObject<any>) {
        Debugger.groupLog("history", `Add:`, type, props);
        this.undoStack.push({
            type,
            props,
        });
        this.redoStack = [];
    }
    public undo() {
        const editor = this._editorRef.current!;
        const undoAction = this.undoStack.pop();

        if (!undoAction) {
            return;
        }
        Debugger.groupLog("history", `Undo: ${undoAction.type}`, undoAction.props);
        this.types[undoAction.type].undo(undoAction.props, editor);
        this.redoStack.push(undoAction);
    }
    public redo() {
        const editor = this._editorRef.current!;
        const redoAction = this.redoStack.pop();

        if (!redoAction) {
            return;
        }
        Debugger.groupLog("history", `Redo: ${redoAction.type}`, redoAction.props);
        this.types[redoAction.type].redo(redoAction.props, editor);
        this.undoStack.push(redoAction);
    }
}
