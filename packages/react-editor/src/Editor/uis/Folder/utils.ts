import { isString } from "@daybrush/utils";
import { prefixNames } from "framework-utils";
import { PREFIX } from "./consts";
import { FileInfo, FolderProps } from "./types";

export function prefix(...classNames: string[]) {
    return prefixNames(PREFIX, ...classNames);
}

export function getId<T>(
    idProperty: FolderProps<T>["idProperty"],
    info: T,
    index: number,
    scope: string[]
) {
    return (isString(idProperty)
        ? info[idProperty]
        : idProperty!(info, index, scope)) as string;
}
export function getName<T>(
    nameProperty: FolderProps<T>["nameProperty"],
    info: T,
    index: number,
    scope: string[]
) {
    return (isString(nameProperty)
        ? info[nameProperty]
        : nameProperty!(info, index, scope)) as string;
}
export function getChildren<T>(
    childrenProperty: FolderProps<T>["childrenProperty"],
    info: T,
    scope: string[]
) {
    return (isString(childrenProperty)
        ? info[childrenProperty]
        : childrenProperty!(info, scope)) as T[];
}
export function getPath<T>(
    pathProperty: FolderProps<T>["pathProperty"],
    id: string,
    scope: string[],
    info: T,
    index: number,
): string[] {
    return (isString(pathProperty) ? info[pathProperty] : pathProperty!(id, scope, info, index)) as string[];
}

export function isEqualArray<T>(
    a: T[],
    b: T[],
) {
    return a.length === b.length && a.every((v, i) => v === b[i]);
}

export function findParentFileInfo(fileInfo: FileInfo<any> | null | undefined, pathUrl: string): FileInfo<any> | null {
    if (!fileInfo) {
        return null;
    }
    if (fileInfo.pathUrl === pathUrl) {
        return fileInfo;
    }
    return findParentFileInfo(fileInfo.parentFileInfo, pathUrl);
}
