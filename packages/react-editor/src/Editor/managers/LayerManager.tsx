import * as React from "react";
import { deepFlat, find } from "@daybrush/utils";
import {
    GroupArrayChild, GroupManager, GroupSingleChild,
    TargetGroupsType, TargetGroupWithId, TargetList, toTargetList,
} from "@moveable/helper";
import { useStoreStateValue } from "@scena/react-store";
import { Frame, SceneItem } from "scenejs";
import { $layers } from "../stores/stores";
import { ScenaElementLayer, ScenaElementLayerGroup } from "../types";


let id = 0;

export interface TargetListWithDispayed extends TargetList {
    displayed(): TargetGroupsType;
    flattenDisplayed(): Array<HTMLElement | SVGElement>;
}
export function getNextId() {
    return `scena-id-${++id}`;
}

export function createLayer(
    layerInfo: Partial<ScenaElementLayer> = {},
): ScenaElementLayer {
    return {
        id: layerInfo.id || getNextId(),
        scope: [],
        item: new SceneItem(),
        jsx: layerInfo.jsx || <div></div>,
        ref: React.createRef<HTMLElement | null>() as React.MutableRefObject<HTMLElement | null>,
        ...layerInfo,
        title: layerInfo.title || "",
    };
}
export function createGroup(
    groupInfo: Partial<ScenaElementLayerGroup> = {},
): ScenaElementLayerGroup {
    return {
        type: "group",
        id: groupInfo.id ? groupInfo.id : getNextId(),
        scope: [],
        children: [],
        opacity: 1,
        display: "block",
        ...groupInfo,
        title: groupInfo.title || "",
    };
}
export default class LayerManager extends GroupManager {
    public groups: ScenaElementLayerGroup[] = [];
    public layers: ScenaElementLayer[] = [];

    private _targetGroupMap: Record<string, TargetGroupWithId> = {};
    private _groupMap: Record<string, ScenaElementLayerGroup> = {};

    constructor(layers: ScenaElementLayer[] = [], groups: ScenaElementLayerGroup[] = []) {
        super([], []);

        this.setLayers(layers, groups);
    }
    public use() {
        return useStoreStateValue($layers);
    }
    public setLayers(layers: ScenaElementLayer[], groups: ScenaElementLayerGroup[] = this.groups) {
        this.layers = layers;

        const groupLayers = this.layers.filter(layer => layer.scope.length);
        const groupMap: Record<string, ScenaElementLayerGroup> = {};
        const nextGroups: ScenaElementLayerGroup[] = [];
        const prevGroupMap: Record<string, ScenaElementLayerGroup> = {};
        const map: Record<string, TargetGroupWithId> = {
            "": {
                groupId: "",
                children: [],
            },
        };

        groups.forEach(group => {
            prevGroupMap[group.id] = group;
        });

        groupLayers.forEach(layer => {
            const scope = layer.scope;

            scope.forEach((_, i) => {
                const groupId = scope[i];
                const parentId = scope[i - 1] || "";

                if (!map[groupId]) {
                    map[groupId] = {
                        groupId,
                        children: [],
                    };
                    map[parentId]!.children.push(map[groupId]);
                }
                // parentId
                if (!groupMap[groupId]) {
                    // new group
                    const group = prevGroupMap[groupId] || createGroup({
                        id: groupId,
                    });
                    group.children = [];
                    nextGroups.push(group);
                    groupMap[groupId] = group;
                    groupMap[parentId]?.children.push(group);
                }
            });
            map[scope[scope.length - 1] || ""].children.push(layer.ref);
            groupMap[scope[scope.length - 1] || ""]?.children.push(layer);
        });

        this.groups = nextGroups.filter(group => {
            return map[group.id];
        });

        this._targetGroupMap = map;
        this._groupMap = groupMap;
    }
    public calculateLayers() {
        this.set(
            this._targetGroupMap[""].children,
            this.layers.map(layer => layer.ref.current!),
        );
    }
    public compositeStyle(layer: ScenaElementLayer | ScenaElementLayerGroup) {
        const isGroup = layer.type === "group";
        const layerFrame = isGroup ? null : this.getFrame(layer);
        const scope = layer.scope;
        const groupMap = this._groupMap;
        let display = isGroup ? layer.display : layerFrame?.get("display") || "block";
        let opacity = isGroup ? layer.opacity :layerFrame?.get("opacity") ?? 1;
        let composited = false;

        function composite() {
            if (!composited) {
                return;
            }
            composited = true;
            [...scope].reverse().forEach(groupId => {
                const group = groupMap[groupId];

                if (!group) {
                    return;
                }

                if (group.display === "none") {
                    display = "none";
                }
                opacity *= group.opacity;
            });
        }

        return {
            get opacity() {
                composite();
                return opacity;
            },
            get display() {
                if (display === "none") {
                    return display;
                }
                composite();
                return display;
            },
        };
    }
    public compositeFrame(layer: ScenaElementLayer | ScenaElementLayerGroup) {
        const isGroup = layer.type === "group";
        const layerFrame = isGroup ? null : this.getFrame(layer);
        const nextFrame = isGroup ? new Frame() : layerFrame!.clone();
        const scope = layer.scope;
        const groupMap = this._groupMap;
        let display = layerFrame?.get("display") || "block";
        let opacity = layerFrame?.get("opacity") ?? 1;

        [...scope].reverse().forEach(groupId => {
            const group = groupMap[groupId];

            if (!group) {
                return;
            }

            if (group.display === "none") {
                display = "none";
            }
            opacity *= group.opacity;
        });

        nextFrame.set({
            opacity,
            display,
        });

        return nextFrame;
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
        const layers = this.layers;
        const childrenLayers = layers.filter(({ scope }) => {
            return parentScope.every((path, i) => path === scope[i]);
        });

        let children = childrenLayers.map(layer => {
            const scope = layer.scope;
            const childLength = scope.length;

            if (length < childLength) {
                const groupId = scope[length];
                const group = createGroup({
                    id: groupId,
                    ...this.groups.find(g => g.id === groupId),
                    scope: scope.slice(0, length),
                });


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
    public getRefs() {
        return this.layers.map(layer => layer.ref);
    }
    public getElements() {
        return this.getRefs().map(ref => ref.current).filter(Boolean) as Array<HTMLElement | SVGElement>;
    }
    public getLayerByElement(element: HTMLElement | SVGElement) {
        return find(this.layers, layer => layer.ref.current === element);
    }
    public getCSSByElement(element: HTMLElement | SVGElement): Record<string, any> {
        return this.getFrame(this.getLayerByElement(element)!, 0).toCSSObject();
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
    public toLayerGroups(targetList: TargetList) {
        const childs = targetList.raw();
        const self = this;

        return childs.map(function toLayerGroups(child) {
            if (child.type === "single") {
                return self.getLayerByElement(child.value)!;
            } else {
                return self._groupMap[child.id]!;
            }
        });
    }

    public toFlatten(layerGroups: Array<ScenaElementLayer | ScenaElementLayerGroup>): ScenaElementLayer[] {
        const result: ScenaElementLayer[] = [];

        layerGroups.forEach(layerGroup => {
            if (layerGroup.type === "group") {
                result.push(...this.toFlatten(layerGroup.children));
            } else {
                result.push(layerGroup);
            }
        });
        return result;
    }
    public toFlattenElement(layerGroups: Array<ScenaElementLayer | ScenaElementLayerGroup>) {
        return this.toFlatten(layerGroups).map(layer => layer.ref.current!);
    }
    public toTargetList(layerGroups: Array<ScenaElementLayer | ScenaElementLayerGroup>) {
        const childs = layerGroups.map(layerGroup => {
            if (layerGroup.type === "group") {
                return this.findArrayChildById(layerGroup.id)!;
            }
            return this.map.get(layerGroup.ref.current!)!;
        }).filter(Boolean);

        const result = toTargetList(childs) as TargetListWithDispayed;

        result.displayed = () => {
            return this.filterDisplayedTargets(result.raw());
        };
        result.flattenDisplayed = () => {
            return deepFlat(result.displayed());
        };

        return result;
    }
    public filterDisplayedLayers<T extends ScenaElementLayer | ScenaElementLayerGroup>(
        layerGroups: T[]
    ): T[] {
        return layerGroups.filter(layerGroup => {
            return this.compositeStyle(layerGroup).display !== "none";
        });
    }
    public filterDisplayedTargets(childs: Array<GroupArrayChild | GroupSingleChild>): TargetGroupsType {
        return childs.map(child => {
            if (child.type === "single") {
                const layer = this.getLayerByElement(child.value)!;

                return layer && this.compositeStyle(layer).display !== "none" ? child.value : null;
            } else {
                const group = this._groupMap[child.id];

                return group && this.compositeStyle(group).display !== "none"
                    ? this.filterDisplayedTargets(child.value)
                    : null;
            }
        }).filter(Boolean) as TargetGroupsType;
    }
}
