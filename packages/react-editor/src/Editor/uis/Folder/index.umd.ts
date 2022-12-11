import Folder, * as modules from "./index.esm";

for (const name in modules) {
    (Folder as any)[name] = (modules as any)[name];
}
export default Folder;
