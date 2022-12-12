import { find } from "@daybrush/utils";
import { GroupManager, TargetGroupsType, TargetGroupWithId } from "../GroupManager";
import { SCENA_LAYER_SEPARATOR } from "../consts";
import { useStoreStateValue } from "../Store/Store";
import { $layers } from "../stores/stores";
import { ScenaElementLayer, ScenaElementLayerGroup } from "../types";

export default class LayerManager extends GroupManager {
    constructor(private _layers: ScenaElementLayer[] = [], private _groups: ScenaElementLayerGroup[] = []) {
        super([], []);

    }
    public use() {
        return useStoreStateValue($layers);
    }
    public setLayers(layers: ScenaElementLayer[], groups: ScenaElementLayerGroup[] = this._groups) {
        this._layers = layers;
        this._groups = groups;
    }
    public calculateLayers() {
        const layers = this._layers;
        // const groups = this._groups;
        const groupLayers = this._layers.filter(layer => layer.scope.length);
        const map: Record<string, TargetGroupWithId> = {
            "": {
                groupId: "",
                children: [],
            },
        };

        groupLayers.forEach(layer => {
            const scope = layer.scope;

            scope.forEach((_, i) => {
                const groupId = scope[i];
                const parentPath = scope.slice(0, i).join(SCENA_LAYER_SEPARATOR);
                const currentPath = scope.slice(0, i + 1).join(SCENA_LAYER_SEPARATOR);

                if (!map[currentPath]) {
                    map[currentPath] = {
                        groupId,
                        children: [],
                    };
                    map[parentPath]!.children.push(map[currentPath]);
                }
            });
            map[scope.join(SCENA_LAYER_SEPARATOR)].children.push(layer.ref.current!);
        });

        this.set(map[""].children, layers.map(layer => layer.ref.current!));
    }
    public selectCompletedChilds(
        targets: TargetGroupsType,
        added: (HTMLElement | SVGElement)[],
        removed: (HTMLElement | SVGElement)[],
        continueSelect?: boolean | undefined,
    ) {
        this.calculateLayers();

        return super.selectCompletedChilds(targets, added, removed, continueSelect);
    }
    public selectSubChilds(
        targets: TargetGroupsType,
        target: HTMLElement | SVGElement,
    ) {
        this.calculateLayers();

        return super.selectSubChilds(targets, target);
    }
    public selectSameDepthChilds(
        targets: TargetGroupsType,
        added: (HTMLElement | SVGElement)[],
        removed: (HTMLElement | SVGElement)[],
    ) {
        this.calculateLayers();

        return super.selectSameDepthChilds(targets, added, removed);
    }
    public selectSingleChilds(
        targets: TargetGroupsType,
        added: (HTMLElement | SVGElement)[],
        removed: (HTMLElement | SVGElement)[],
    ) {
        this.calculateLayers();

        return super.selectSingleChilds(targets, added, removed);
    }
    public findChildren(parentScope: string[] = []): Array<ScenaElementLayerGroup | ScenaElementLayer> {
        const length = parentScope.length;
        const layers = this._layers;
        const childrenLayers = layers.filter(({ scope }) => {
            return parentScope.every((path, i) => path === scope[i]);
        });

        let children = childrenLayers.map(layer => {
            const scope = layer.scope;
            const childLength = scope.length;

            if (length < childLength) {
                const groupId = scope[length];
                const group: ScenaElementLayerGroup = {
                    type: "group",
                    title: "No Named",
                    id: groupId,
                    children: [],
                    ...this._groups.find(g => g.id === groupId),
                    scope: scope.slice(0, length),
                };
                return group;
            } else {
                return layer;
            }
        });


        children = children.filter((child, i, arr) => {
            if (child.type === "group") {
                const id = child.id;

                return !arr.find((nextChild, j) => j < i && nextChild.type === "group" && nextChild.id === id);
            }
            return true;
        });

        children.forEach(child => {
            if (child.type === "group") {
                const childScope = [...child.scope, child.id];

                child.children = this.findChildren(childScope);
            }
        });

        return children;
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
