import * as React from "react";
import { prefix, between } from "../../utils/utils";
import { IObject, isObject, isArray, hasClass, findIndex } from "@daybrush/utils";
import "./Folder.css";
import File from "./File";
import KeyController from "keycon";
import Dragger from "@daybrush/drag";

export interface FileInfo<T> {
    id: string;
    fullId: string;
    parentId: string;
    depth: number;
    value: T;
}
export default class Folder<T = any> extends React.PureComponent<{
    scope: string[],
    name: string,
    properties: IObject<T> | T[],
    selected: string[] | null,
    multiselect?: boolean,
    isMove?: boolean,
    checkMove?: (prevInfo: FileInfo<T>) => boolean,
    onMove?: (parentInfo?: FileInfo<T>, prevInfo?: FileInfo<T>) => any,
    onSelect: (e: string[]) => any,
    FileComponent: ((props: File["props"]) => any) | typeof File,
    getId?: (value: any, id: any) => any,
    getFullId?: (id: string, scope: string[]) => string,
    getName?: (value: any, id: any) => any,
    getChildren?: (value: any, id: any) => any,
}> {
    public static defaultProps = {
        onMove: () => { },
        checkMove: () => true,
        getFullId: (id: string, scope: string[]) => [...scope, id].join("///"),
        getId: (_: any, id: any, scope: string[]) => id,
        getName: (_: any, id: any) => id,
        getChildren: (value: any) => value,
    }
    public moveDragger!: Dragger;
    public folderRef = React.createRef<HTMLDivElement>();
    public state = {
        fold: false,
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

        const fullName = scope.length ? getFullId!(scope[scope.length - 1], scope.slice(-1)) : "";
        return <div className={prefix("folder")} ref={this.folderRef}>
            {name && <div className={prefix("tab-input", "full", "file", this.isSelected(fullName) ? "selected" : "")}
                data-file-key={fullName} onClick={this.onClick}>
                <div className={prefix("fold-icon", this.state.fold ? "fold" : "")} onClick={this.onClickFold}></div>
                <h3 >{name}</h3>
            </div>}
            <div className={prefix("properties")}>
                {this.renderProperties()}
            </div>
        </div>
    }
    public componentDidMount() {
        if (this.props.isMove) {
            const folderElement = this.folderRef.current!;
            this.moveDragger = new Dragger(folderElement, {
                container: window,
                dragstart: e => {
                    const rect = folderElement.getBoundingClientRect();
                    e.datas.folderLine = rect.left + rect.width - 10;
                },
                drag: e => {
                    const { clientX, clientY, datas } = e;

                    this.clearPointers();
                    datas.prevInfo = null;
                    datas.isTop = false;

                    let target = document.elementFromPoint(datas.folderLine, e.clientY) as HTMLElement;

                    while (target) {
                        if (target.hasAttribute("data-file-key")) {
                            break;
                        }
                        target = target.parentElement as HTMLElement;
                    }

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
                        rect = target.getBoundingClientRect();
                        isTop = false;
                    }
                    const selected = this.props.selected!;
                    const isFolder = hasClass(target.parentElement!, prefix("folder"));
                    const nextInfo = infos[siblingIndex + 1];
                    const targetDepth = targetInfo.depth;
                    const nextDepth = nextInfo ? nextInfo.depth : 0;
                    const depthRange = [
                        Math.min(nextDepth, targetDepth) - targetDepth,
                        Math.max(targetDepth + 1, nextDepth) - targetDepth,
                    ];
                    let distX = clientX - rect.left;
                    console.log(distX);
                    const distDepth = isTop ? 0
                        : between(Math.round((distX > 0 ? distX * 0.2 : distX) / 10), depthRange[0], depthRange[1]);

                    if (nextInfo && !isTop && selected.indexOf(nextInfo.fullId) > -1 && targetDepth + distDepth === nextDepth) {
                        return;
                    }
                    if (selected.indexOf(key) > -1 && distDepth >= 0) {
                        return;
                    }
                    if (distDepth > 0 && !this.props.checkMove!(targetInfo)) {
                        console.log(distDepth, prevInfo);
                        return;
                    }
                    target.style.setProperty("--pointer-depth", `${distDepth}`);
                    target.classList.add(prefix(isTop ? "top-pointer" : "bottom-pointer"));


                    datas.depth = distDepth;
                    datas.isTop = isTop;
                    datas.prevInfo = targetInfo;
                },
                dragend: e => {
                    this.clearPointers();
                    const datas = e.datas;
                    const depth = datas.depth;
                    let prevInfo: FileInfo<T> | undefined = datas.prevInfo;
                    const isTop = datas.isTop;
                    const onMove = this.props.onMove!;
                    const objMap = this.flatMap();

                    let parentInfo: FileInfo<T> | undefined;

                    if (prevInfo) {
                        if (depth <= 0) {
                            const length = Math.abs(depth);

                            for (let i = 0; i < length; ++i) {
                                prevInfo = objMap[prevInfo!.parentId];
                            }
                            parentInfo = objMap[prevInfo.parentId];
                        } else {
                            parentInfo = prevInfo;
                            prevInfo = undefined;
                        }
                    }

                    if (!parentInfo && isTop) {
                        onMove();
                    } else if (parentInfo || prevInfo) {
                        onMove!(parentInfo, prevInfo);
                    }
                }
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
            const fullName = getFullId!(id, nextScope);
            nextScope.push(id);

            const children = getChildren!(value, key);

            if (children && (isArray(children) ? children.length : isObject(children))) {
                return <Folder<T> key={fullName}
                    name={name} scope={nextScope} properties={children}
                    multiselect={multiselect}
                    getId={getId}
                    getName={getName}
                    getFullId={getFullId}
                    getChildren={getChildren}
                    selected={selected} onSelect={onSelect} FileComponent={FileComponent} />;
            }
            return <div key={fullName} className={prefix("file", this.isSelected(fullName) ? "selected" : "")}
                data-file-key={fullName} onClick={this.onClick}>
                <FileComponent scope={nextScope} name={name} value={value} fullName={fullName} />
            </div>;
        });
    }
    private onClickFold = (e: any) => {
        e.stopPropagation();
        this.setState({
            fold: !this.state.fold,
        })
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
            onSelect(nextSelected);
        } else {
            onSelect([key]);
        }
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
            getName,
            getChildren,
        } = this.props;
        const depth = scope.length;
        keys.forEach(key => {
            const value = (properties as any)[key];
            const nextScope = scope.slice();
            const id = getId!(value, key);
            const fullId = getFullId!(id, nextScope);
            nextScope.push(id);

            const valueChildren = getChildren!(value, key);

            children.push({
                id,
                fullId,
                parentId,
                depth,
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
