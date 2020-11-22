import { EditorContext, EDITOR_PROPERTIES } from "../consts";
import { connectContext } from "./ConnectContext";

export const connectEditorContext = connectContext(EditorContext, EDITOR_PROPERTIES);
