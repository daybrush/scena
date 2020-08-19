import * as React from "react";
import { prefix, between } from "../../utils/utils";
import { IObject, isObject, isArray, findIndex, hasClass } from "@daybrush/utils";
import "./Folder.css";
import File from "./File";
import KeyController from "keycon";
import Dragger, { OnDrag, OnDragStart, OnDragEnd } from "@daybrush/drag";

export interface FileInfo<T> {
    id: string;
    scope: string[],
    fullId: string;
    parentId: string;
    depth: number;
    value: T;
}

function getCurrentFile(target: HTMLElement) {
    while (target) {
        if (target.hasAttribute("data-file-key")) {
            break;
        }
        target = target.parentElement as HTMLElement;
    }
    return target;
}
export default class Folder<T = any> extends React.PureComponent<{
    scope: string[],
    name: string,
    properties: IObject<T> | T[],
    selected: string[] | null,
    multiselect?: boolean,
    isMove?: boolean,
    isMoveChildren?: boolean,
    checkMove?: (prevInfo: FileInfo<T>) => boolean,
    onMove?: (selectedInfos: Array<FileInfo<T>>, parentInfo?: FileInfo<T>, prevInfo?: FileInfo<T>) => any,
    onSelect?: (e: string[]) => any,
    FileComponent: ((props: File["props"]) => any) | typeof File,
    getId?: (value: any, id: any) => any,
    getFullId?: (id: string, scope: string[]) => string,
    getName?: (value: any, id: any) => any,
    getChildren?: (value: any, id: any, scope: any[]) => any,
}> {
    public static defaultProps = {
        selected: [],
        onMove: () => { },
        checkMove: () => true,
        onSelect: () => {},
        getFullId: (id: string, scope: string[]) => [...scope, id].join("///"),
        getId: (_: any, id: any, scope: string[]) => id,
        getName: (_: any, id: any) => id,
        getChildren: (value: any) => value,
    }
    public moveDragger!: Dragger;
    public folderRef = React.createRef<HTMLDivElement>();
    public shadowRef = React.createRef<HTMLDivElement>();
    public state: {
        fold: boolean,
        shadows: Array<FileInfo<T>>,
    } = {
            fold: false,
            shadows: [],
        };
    public isSelected(key: string) {
        const selected = this.props.selected;

        return selected && selected.indexOf(key) > -1;
    }
    public render() {
        const {
            scope,
            name,
            getFullId,
        } = this.props;

        const fullId = scope.length ? getFullId!(scope[scope.length - 1], scope.slice(0, -1)) : "";
        return <div className={prefix("folder")} ref={this.folderRef}>
            {name && <div className={prefix("tab-input", "full", "file", this.isSelected(fullId) ? "selected" : "")}
                data-file-key={fullId} onClick={this.onClick}>
                <div className={prefix("fold-icon", this.state.fold ? "fold" : "")} onClick={this.onClickFold}></div>
                <h3 >{name}</h3>
            </div>}
            <div className={prefix("properties")}>
                {this.renderProperties()}
            </div>
            {this.renderShadows()}
        </div>
    }
    public componentDidMount() {
        if (this.props.isMove) {
            const folderElement = this.folderRef.current!;
            this.moveDragger = new Dragger(folderElement, {
                container: window,
                checkInput: true,
                dragstart: this.onDragStart,
                drag: this.onDrag,
                dragend: this.onDragEnd,
            });
        }
    }
    public componentWillUnmount() {
        if (this.moveDragger) {
            this.moveDragger.unset();
        }
    }
    private renderProperties() {
        const {
            scope,
            properties,
            selected,
            multiselect,
            onSelect,
            getFullId,
            FileComponent,
            isMove,
            getId,
            getName,
            getChildren,
        } = this.props;

        if (this.state.fold) {
            return;
        }
        const keys = Object.keys(properties);

        return keys.map(key => {
            const value = (properties as any)[key];
            const name = getName!(value, key);
            const nextScope = scope.slice();
            const id = getId!(value, key);
            const fullId = getFullId!(id, nextScope);
            nextScope.push(id);

            const children = getChildren!(value, key, scope);

            if (children && (isArray(children) ? children.length : isObject(children))) {
                return <Folder<T> key={fullId}
                    name={name} scope={nextScope} properties={children}
                    multiselect={multiselect}
                    getId={getId}
                    getName={getName}
                    getFullId={getFullId}
                    getChildren={getChildren}
                    selected={selected} onSelect={isMove ? undefined : onSelect} FileComponent={FileComponent} />;
            }
            return <div key={fullId} className={prefix("file", this.isSelected(fullId) ? "selected" : "")}
                data-file-key={fullId} onClick={isMove ? undefined : this.onClick}>
                <FileComponent scope={nextScope} name={name} value={value} fullId={fullId} />
            </div>;
        });
    }
    private renderShadows() {
        const {
            FileComponent,
            getName,
            scope,
        } = this.props;
        if (scope.length) {
            return;
        }
        return <div className={prefix("shadows")} ref={this.shadowRef}>
            {this.state.shadows.map(info => {
                const {
                    scope: fileScope,
                    value,
                    fullId,
                    id,
                } = info;
                const name = getName!(value, id);
                return <div key={fullId} className={prefix("file", "selected", "shadow")}>
                    <FileComponent scope={fileScope} name={name} value={value} fullId={fullId} />
                </div>;
            })}
        </div>;
    }
    private onClickFold = (e: any) => {
        e.stopPropagation();
        this.setState({
            fold: !this.state.fold,
        });
    }
    private onClick = ({ currentTarget }: any) => {
        const key = currentTarget.getAttribute("data-file-key")!;
        const {
            multiselect,
            onSelect,
            selected,
        } = this.props;
        if (multiselect) {
            let nextSelected = (selected || []).slice();
            const index = nextSelected.indexOf(key);

            if (KeyController.global.shiftKey) {
                if (index > -1) {
                    nextSelected.splice(index, 1);
                } else {
                    nextSelected.push(key);
                }
            } else {
                nextSelected = [key];
            }
            onSelect!(nextSelected);
        } else {
            onSelect!([key]);
        }
    }
    private onDragStart = (e: OnDragStart) => {
        if (hasClass(e.inputEvent.target, prefix("fold-icon"))) {
            return false;
        }
        const folderElement = this.folderRef.current!;
        const rect = folderElement.getBoundingClientRect();
        const datas = e.datas;
        const offsetX = e.clientX - rect.left;
        // const offsetY = e.clientY - rect.top;

        datas.offsetX = offsetX;
        datas.folderRect = rect;
        datas.folderLine = rect.left + rect.width - 10;
        datas.objMap = this.flatMap();

        e.inputEvent.preventDefault();
        e.inputEvent.stopPropagation();
    }

    private onDrag = (e: OnDrag) => {
        const folderElement = this.folderRef.current!;
        const { clientX, clientY, datas } = e;

        this.clearPointers();
        datas.prevInfo = null;
        datas.isTop = false;
        const selected = this.props.selected!;
        const objMap = datas.objMap;


        if (!datas.dragFirst) {
            datas.dragFirst = true;
            const clickedTarget: HTMLElement = getCurrentFile(e.inputEvent.target);

            if (clickedTarget && selected.indexOf(clickedTarget.getAttribute("data-file-key")!) === -1) {
                this.onClick({ currentTarget: clickedTarget });
                return;
            }
        }
        if (!selected || !selected.length) {
            return;
        }
        const fileInfos: Array<FileInfo<T>> = selected.map(id => objMap[id]);

        if (!this.state.shadows.length) {
            this.setState({
                shadows: fileInfos,
            }, () => {
                // datas.offsetY = 0;
                this.updateShadowPosition(datas.folderRect, e);
            });
            return;
        } else {
            this.updateShadowPosition(datas.folderRect, e);
        }
        let target = getCurrentFile(document.elementFromPoint(datas.folderLine, e.clientY) as HTMLElement);

        if (!target) {
            return;
        }
        const infos = this.flatChildren();
        let rect = target.getBoundingClientRect();
        let isTop = rect.top + rect.height / 2 > clientY;

        let key = target.getAttribute("data-file-key")!;
        let siblingIndex = findIndex(infos, info => info.fullId === key);
        let targetInfo = infos[siblingIndex];
        let prevInfo = infos[siblingIndex - 1];

        if (prevInfo && isTop) {
            --siblingIndex;
            targetInfo = infos[siblingIndex];
            prevInfo = infos[siblingIndex - 1];
            key = targetInfo.fullId!;
            target = folderElement.querySelector<HTMLElement>(`[data-file-key="${key}"]`)!;

            if (!target) {
                return;
            }
            rect = target.getBoundingClientRect();
            isTop = false;
        }
        const nextInfo = infos[siblingIndex + 1];
        const targetDepth = targetInfo.depth;
        const nextDepth = nextInfo ? nextInfo.depth : 0;
        const depthRange = [
            Math.min(nextDepth, targetDepth) - targetDepth,
            Math.max(targetDepth + 1, nextDepth) - targetDepth,
        ];
        let distX = clientX - rect.left;
        let distDepth = isTop ? 0
            : between(Math.round((distX > 0 ? distX * 0.2 : distX) / 10), depthRange[0], depthRange[1]);

        if (nextInfo && !isTop && selected.indexOf(nextInfo.fullId) > -1 && targetDepth + distDepth === nextDepth) {
            return;
        }
        if (this.contains(selected, key)) {
            return;
        }
        if (selected.indexOf(key) > -1 && distDepth >= 0) {
            return;
        }
        const {
            isMoveChildren,
            checkMove,
        } = this.props;

        if (isMoveChildren) {
            const prevScope = targetInfo.scope;
            const parentScope = [...targetInfo.scope, targetInfo.id];

            if (fileInfos.every(info => info.scope.every((v, i) => v === prevScope[i]))) {
                distDepth = 0;
            } else if(fileInfos.every(info => info.scope.every((v, i) => v === parentScope[i]))) {
                distDepth = 1;
            } else {
                return;
            }
        } else if (distDepth > 0 && !checkMove!(targetInfo)) {
            distDepth = 0;
        }
        target.style.setProperty("--pointer-depth", `${distDepth}`);
        target.classList.add(prefix(isTop ? "top-pointer" : "bottom-pointer"));


        datas.depth = distDepth;
        datas.isTop = isTop;
        datas.prevInfo = targetInfo;
    }
    private onDragEnd = (e: OnDragEnd) => {
        this.clearPointers();

        if (!e.isDrag) {
            const currentTarget = getCurrentFile(e.inputEvent.target);

            if (currentTarget) {
                this.onClick({ currentTarget });
            }
            return;
        }
        const datas = e.datas;
        const depth = datas.depth;
        let prevInfo: FileInfo<T> | undefined = datas.prevInfo;
        const isTop = datas.isTop;
        const onMove = this.props.onMove!;
        const objMap = datas.objMap;
        const selectedInfos: Array<FileInfo<T>> = (this.props.selected || []).map(id => objMap[id]);

        let parentInfo: FileInfo<T> | undefined;

        if (prevInfo) {
            if (depth <= 0) {
                const length = Math.abs(depth);

                for (let i = 0; i < length; ++i) {
                    prevInfo = objMap[prevInfo!.parentId];
                }
                parentInfo = objMap[prevInfo!.parentId];
            } else {
                parentInfo = prevInfo;
                prevInfo = undefined;
            }
        }

        if (!parentInfo && isTop) {
            onMove([]);
        } else if (parentInfo || prevInfo) {
            onMove!(selectedInfos, parentInfo, prevInfo);
        }
        this.setState({
            shadows: [],
        }, () => {
            this.shadowRef.current!.style.cssText = "display: none";
        })
    }
    private updateShadowPosition(rect: ClientRect, e: OnDragStart | OnDrag) {
        const el = this.shadowRef.current;

        if (!el || !this.state.shadows.length) {
            return;
        }
        const datas = e.datas;
        el.style.cssText
            = `display: block; transform: translate(${e.clientX - rect.left - datas.offsetX}px, ${e.clientY - rect.top}px) translateY(-50%)`;
    }
    private contains(ids: string[], key: string, objMap = this.flatMap()): boolean {
        const info = objMap[key];
        const parentId = info.parentId;

        if (!parentId) {
            return false;
        }
        if (ids.indexOf(parentId) > -1) {
            return true;
        }
        return this.contains(ids, parentId, objMap);
    }
    private flatMap() {
        const children = this.flatChildren();
        const objMap: IObject<FileInfo<T>> = {};
        children.forEach(info => {
            objMap[info.fullId] = info;
        });

        return objMap;
    }
    private flatChildren(
        properties = this.props.properties!,
        parentId: string = "",
        scope: string[] = [],
        children: FileInfo<T>[] = []
    ) {
        const keys = Object.keys(properties);
        const {
            getFullId,
            getId,
            getChildren,
        } = this.props;
        const depth = scope.length;
        keys.forEach(key => {
            const value = (properties as any)[key];
            const nextScope = scope.slice();
            const id = getId!(value, key);
            const fullId = getFullId!(id, nextScope);
            nextScope.push(id);

            const valueChildren = getChildren!(value, key, scope);

            children.push({
                id,
                fullId,
                parentId,
                depth,
                scope,
                value,
            });
            if (valueChildren && (isArray(valueChildren) ? valueChildren.length : isObject(valueChildren))) {
                this.flatChildren(valueChildren, fullId, nextScope, children);
            }
        });

        return children;
    }
    private clearPointers() {
        [].slice.call(document.querySelectorAll<HTMLElement>(".scena-top-pointer, .scena-bottom-pointer")).forEach((el: HTMLElement) => {
            const classList = el.classList;

            classList.remove(prefix("top-pointer"));
            classList.remove(prefix("bottom-pointer"));
        });
    }
}
