import Editor, * as modules from "./index";

for (const name in modules) {
    (Editor as any)[name] = (modules as any)[name];
}
export default Editor;
