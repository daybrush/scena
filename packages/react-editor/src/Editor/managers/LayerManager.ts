import { find } from "@daybrush/utils";
import MoveableHelper from "moveable-helper";
import { OnRender } from "react-moveable";
import { Frame, NameType } from "scenejs";
import { ScenaElementLayer } from "../types";
import { getId } from "../utils/utils";
import MemoryManager from "./MemoryManager";

export default class LayerManager {
    private _layers: ScenaElementLayer[] = [];

    public setLayers(layers: ScenaElementLayer[]) {
        this._layers = layers;
    }
    public getLayerByElement(element: HTMLElement | SVGElement) {
        return find(this._layers, layer => layer.ref.current === element);
    }
    public getCSSByElement(element: HTMLElement | SVGElement): Record<string, any> {
        return this._getFrame(this.getLayerByElement(element)!, 0).get();
    }
    public setCSS(layer: ScenaElementLayer, cssObject: string | Record<string, any>) {
        layer.item.set(0, cssObject);
    }
    public setCSSByElement(element: HTMLElement | SVGElement, cssObject: string | Record<string, any>) {
        const layer = this.getLayerByElement(element);

        if (!layer) {
            return;
        }
        this.setCSS(layer, cssObject)
    }

    private _getFrame(layer: ScenaElementLayer, time: number) {
        const item = layer.item;

        if (!item.hasFrame(time)) {
            item.newFrame(time);
        }
        return item.getFrame(0);
    }
}
