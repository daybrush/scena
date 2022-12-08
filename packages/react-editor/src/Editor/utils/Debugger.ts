let single!: Debugger;

export default class Debugger {
    public static log(...args: any[]) {
        console.log("%cScena", "padding: 1px 3px; background: #4af; color: #fff;", ...args);
    }
    public static groupLog(group: string, ...args: any[]) {
        console.log(
            `%cScena%c${group}`,
            "padding: 1px 3px; background: #4af; color: #fff;",
            "padding: 1px 3px; background: #fa4; color: #fff;",
            ...args,
        );
    }
}
