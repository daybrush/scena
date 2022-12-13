import { IObject } from "@daybrush/utils";
import { EditorManagerInstance } from "../EditorManager";
import Debugger from "../utils/Debugger";

export type RestoreCallback = (props: any, editor: EditorManagerInstance) => any;
export interface HistoryAction {
    type: string;
    props: IObject<any>;
    description?: string;
}
export default class HistoryManager<Histories extends IObject<any> = any> {
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
    public addHistory<Name extends keyof Histories, Props extends Histories[Name]>(
        type: Name & string,
        props: Props,
        description?: string,
    ) {
        const historyType = (this.types as any)[type] as HistoryAction;

        if (!historyType) {
            return;
        }
        const editor = this._editorRef.current!;
        Debugger.groupLog("history", `Add:`, type, props);

        this.currentHistory = {
            type,
            props,
            description: description || historyType.description,
        };
        this.undoStack.push(this.currentHistory);
        this.redoStack = [];

        editor.actionManager.act("history.add");
    }
    public undo() {
        const editor = this._editorRef.current!;
        const undoStack = this.undoStack;
        const undoAction = undoStack.pop();

        if (!undoAction) {
            if (this.currentHistory) {
                this.currentHistory = null;
                editor.actionManager.act("history.undo");
            }
            return;
        }
        this.currentHistory = undoStack[undoStack.length - 1];
        Debugger.groupLog("history", `Undo: ${undoAction.type}`, undoAction.props);
        this.types[undoAction.type].undo(undoAction.props, editor);
        this.redoStack.push(undoAction);
        editor.actionManager.act("history.undo");
    }
    public redo() {
        const editor = this._editorRef.current!;
        const redoAction = this.redoStack.pop();

        if (!redoAction) {
            return;
        }
        this.currentHistory = redoAction;
        Debugger.groupLog("history", `Redo: ${redoAction.type}`, redoAction.props);
        this.types[redoAction.type].redo(redoAction.props, editor);
        this.undoStack.push(redoAction);
        editor.actionManager.act("history.redo");
    }
    public clear() {
        this.currentHistory = null;
        this.redoStack = [];
        this.undoStack = [];
    }
}
