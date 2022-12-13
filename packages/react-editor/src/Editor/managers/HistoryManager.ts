import { IObject } from "@daybrush/utils";
import { EditorManagerInstance } from "../EditorManager";
import Debugger from "../utils/Debugger";

export type RestoreCallback = (props: any, editor: EditorManagerInstance) => any;
export interface HistoryAction {
    type: string;
    props: IObject<any>;
    description?: string;
}
export default class HistoryManager {
    public undoStack: HistoryAction[] = [];
    public redoStack: HistoryAction[] = [];
    public currentHistory: HistoryAction | null = null;
    private types: Record<string, {
        redo: RestoreCallback;
        undo: RestoreCallback;
        description?: string;
    }> = {};
    constructor(private _editorRef: React.MutableRefObject<EditorManagerInstance | undefined>) { }
    public registerType(
        type: string,
        undo: RestoreCallback,
        redo: RestoreCallback,
        description?: string,
    ) {
        this.types[type] = { undo, redo, description };
    }
    public addHistory(type: string, props: IObject<any>, description?: string) {
        const editor = this._editorRef.current!;
        Debugger.groupLog("history", `Add:`, type, props);

        this.currentHistory = {
            type,
            props,
            description: description || this.types[type]?.description,
        };
        this.undoStack.push(this.currentHistory);
        this.redoStack = [];

        editor.actionManager.emit("history.add");
    }
    public undo() {
        const editor = this._editorRef.current!;
        const undoAction = this.undoStack.pop();

        if (!undoAction) {
            if (this.currentHistory) {
                this.currentHistory = null;
                editor.actionManager.emit("history.undo");
            }
            return;
        }
        this.currentHistory = undoAction;
        Debugger.groupLog("history", `Undo: ${undoAction.type}`, undoAction.props);
        this.types[undoAction.type].undo(undoAction.props, editor);
        this.redoStack.push(undoAction);
        editor.actionManager.emit("history.undo");
    }
    public redo() {
        const editor = this._editorRef.current!;
        const redoAction = this.redoStack.pop();

        if (!redoAction) {
            if (this.currentHistory) {
                this.currentHistory = null;
                editor.actionManager.emit("history.redo");
            }
            return;
        }
        this.currentHistory = redoAction;
        Debugger.groupLog("history", `Redo: ${redoAction.type}`, redoAction.props);
        this.types[redoAction.type].redo(redoAction.props, editor);
        this.undoStack.push(redoAction);
        editor.actionManager.emit("history.redo");
    }
}
