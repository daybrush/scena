import { find } from "@daybrush/utils";
import { GroupManager, TargetGroupsType } from "@moveable/helper";
import { SCENA_LAYER_SEPARATOR } from "../consts";
import { ScenaElementLayer } from "../types";

export default class LayerManager extends GroupManager {
    private _layers: ScenaElementLayer[] = [];

    constructor() {
        super([], []);
    }

    public setLayers(layers: ScenaElementLayer[]) {
        this._layers = layers;
        this.calculateLayers();
    }
    public calculateLayers() {
        const layers = this._layers;
        const groupLayers = this._layers.filter(layer => layer.scope.length);
        const map: Record<string, TargetGroupsType> = {
            "": [],
        };

        groupLayers.forEach(layer => {
            const scope = layer.scope;

            scope.forEach((_, i) => {
                const parentPath = scope.slice(0, i).join(SCENA_LAYER_SEPARATOR);
                const currentPath = scope.slice(0, i + 1).join(SCENA_LAYER_SEPARATOR);

                if (!map[currentPath]) {
                    map[currentPath] = [];
                    map[parentPath].push(map[currentPath]);
                }
            });
            map[scope.join(SCENA_LAYER_SEPARATOR)].push(layer.ref.current!);
        });

        console.log(map[""], groupLayers.map(layer => layer.ref.current!));
        this.set(map[""], layers.map(layer => layer.ref.current!));
    }
    public getLayers() {
        return this._layers;
    }
    public getRefs() {
        return this._layers.map(layer => layer.ref);
    }
    public getElements() {
        return this.getRefs().map(ref => ref.current).filter(Boolean) as Array<HTMLElement | SVGElement>;
    }
    public getLayerByElement(element: HTMLElement | SVGElement) {
        return find(this._layers, layer => layer.ref.current === element);
    }
    public getCSSByElement(element: HTMLElement | SVGElement): Record<string, any> {
        return this.getFrame(this.getLayerByElement(element)!, 0).get();
    }
    public setCSS(layer: ScenaElementLayer, cssObject: string | Record<string, any>) {
        layer.item.set(0, cssObject);
    }
    public setCSSByElement(element: HTMLElement | SVGElement, cssObject: string | Record<string, any>) {
        const layer = this.getLayerByElement(element);

        if (!layer) {
            return;
        }
        this.setCSS(layer, cssObject);
    }

    public getFrame(layer: ScenaElementLayer, time = 0) {
        const item = layer.item;

        if (!item.hasFrame(time)) {
            item.newFrame(time);
        }
        return item.getFrame(0);
    }
}
