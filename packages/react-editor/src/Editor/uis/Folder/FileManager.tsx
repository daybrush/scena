import * as React from "react";
import Folder from "./FolderManager";
import { FileManagerProps } from "./types";
import { getChildren, getId, getName, getPath, prefix } from "./utils";

export default class FileManager<T extends {} = {}>
    extends React.PureComponent<FileManagerProps<T>> {
    public static defaultProps = {};
    public folderRef = React.createRef<Folder>();
    public render() {
        const {
            childrenProperty,
            pathProperty,
            nameProperty,
            idProperty,
            index,
            info,
            scope,
            FileComponent,
            isPadding,
            showFoldIcon = true,
            gap,
            multiselect,
            selected,
            folded,
            originalInfos,
            pathSeperator,
        } = this.props;
        const id = getId(idProperty, info, index, scope);
        const name = getName(nameProperty, info, index, scope);
        const children = getChildren(childrenProperty, info, scope);
        const path = getPath!(pathProperty, id, scope, info, index);
        const pathUrl = path.join(pathSeperator);
        const nextScope = [...scope, id];
        const length = scope.length;
        const isFolder = children && children.length > 0;
        const gapWidth = gap! * (length + 1);
        const isFolded = this.isFolded(pathUrl);
        return (
            <div className={prefix("property")}>
                <div
                    className={prefix("file", this.isSelected(pathUrl) ? "selected" : "")}
                    data-file-path={pathUrl}
                    style={{
                        [isPadding ? "paddingLeft" : "marginLeft"]: `${gapWidth}px`,
                        width: isPadding ? "100%" : `calc(100% - ${gapWidth}px)`,
                    }}
                >
                    <div className={prefix("file-name")}>
                        {isFolder && showFoldIcon && (
                            <div
                                className={prefix("fold-icon", isFolded ? "fold" : "")}
                            ></div>
                        )}
                        <FileComponent<T>
                            scope={scope}
                            name={name}
                            value={info}
                            path={path}
                        />
                    </div>
                </div>
                {isFolder && (
                    <Folder<T>
                        ref={this.folderRef}
                        scope={nextScope}
                        infos={children}
                        FileComponent={FileComponent}
                        nameProperty={nameProperty}
                        idProperty={idProperty}
                        pathProperty={pathProperty}
                        childrenProperty={childrenProperty}
                        showFoldIcon={showFoldIcon}
                        selected={selected}
                        folded={folded}
                        isPadding={isPadding}
                        gap={gap}
                        multiselect={multiselect}
                        originalInfos={originalInfos}
                        isChild={true}
                        display={isFolded ? "none" : "block"}
                        pathSeperator={pathSeperator}
                    />
                )}
            </div>
        );
    }
    public getInfo(): T {
        return this.props.info;
    }
    public isSelected(path: string) {
        const selected = this.props.selected;

        return selected && selected.indexOf(path) > -1;
    }
    public isFolded(path: string) {
        const folded = this.props.folded;

        return folded && folded.indexOf(path) > -1;
    }
    public findFile(targetPathUrl: string): FileManager<T> | null {
        const {
            childrenProperty,
            pathProperty,
            idProperty,
            index,
            info,
            scope,
            pathSeperator,
        } = this.props;
        const id = getId(idProperty, info, index, scope);
        const children = getChildren(childrenProperty, info, scope);
        const path = getPath!(pathProperty, id, scope, info, index);
        const pathUrl = path.join(pathSeperator);

        if (targetPathUrl === pathUrl) {
            return this;
        }
        const childFolder = this.folderRef.current;

        if (!children || !children.length || !childFolder) {
            return null;
        }

        return childFolder.findFile(targetPathUrl);
    }
}
