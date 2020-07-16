export default class Memory {
    public map = new Map<any, any>();
    public get(key: any) {
        return this.map.get(key);
    }
    public set(key: any, value: any) {
        return this.map.set(key, value);
    }
    public clear() {
        this.map.clear();
    }
}
