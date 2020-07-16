export default class Debugger {
    constructor(private isDebug?: boolean) {}
    public log(...args: any[]) {
        if (!this.isDebug) {
            return;
        }
        console.log("Scena Debugger:", ...args);
    }
}
