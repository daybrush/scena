export default class Debugger {
    constructor(private isDebug?: boolean) {}
    public log(...args: any[]) {
        if (!this.isDebug) {
            return;
        }
        console.log("%c Scena Debugger:", "padding: 1px; background: #4af; color: #fff;", ...args);
    }
}
