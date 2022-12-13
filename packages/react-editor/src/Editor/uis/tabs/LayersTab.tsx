

import * as React from "react";
import Folder, { FileInfo, FileProps } from "../Folder";
import { ScenaElementLayer, ScenaElementLayerGroup } from "../../types";
import { useStoreStateValue } from "../../Store/Store";
import { $editor, $layerManager, $selectedTargetList } from "../../stores/stores";
import { flattenLayerGroup, isArrayContains, prefix } from "../../utils/utils";
import styled from "react-css-styled";
import { SCENA_LAYER_SEPARATOR } from "../../consts";
import { FolderIcon, LayerIcon } from "../icons";
import { GroupChild, toTargetList } from "../../GroupManager";
import LayerManager from "../../managers/LayerManager";

const LayersElement = styled("div", `
.scena-folder-file {
    position: relative;
    box-sizing: border-box;
    padding: 5px 0px;
    display: inline-block;
    width: 100%;
    font-size: 12px;
}
.scena-folder-file:not(.scena-folder-selected):hover:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    border: 1px solid var(--scena-editor-color-selected);
    box-sizing: border-box;
}
.scena-layer {
    display: flex;
    align-content: center;
}
.scena-layer-icon {
    width: 16px;
    padding: 2px;
    box-sizing: border-box;
    margin-right: 5px;
}
`);



function Layer({ name, value }: FileProps<ScenaElementLayer | ScenaElementLayerGroup>) {
    let iconJsx: JSX.Element | null = <LayerIcon />;

    if (value.type === "group") {
        iconJsx = <FolderIcon />;
    }
    return <div className={prefix("layer")}>
        <div className={prefix("layer-icon")}>{iconJsx}</div>
        {name}
    </div>;
}

function convertInfosToTargetList(
    layerManager: LayerManager,
    infos: Array<FileInfo<ScenaElementLayer | ScenaElementLayerGroup>>,
) {
    return toTargetList(infos.map(info => {
        if (info.value.type === "group") {
            return layerManager.findArrayChildById(info.id);
        } else {
            return layerManager.toSingleChild(info.value.ref.current!);
        }
    }).filter(Boolean) as GroupChild[]);
}


export default function LayersTab() {
    const editorRef = useStoreStateValue($editor);
    const layerManager = useStoreStateValue($layerManager);
    const [folded, setFolded] = React.useState<string[]>([]);
    const children = layerManager.findChildren();
    const layers = layerManager.use();
    const selectedTargetList = useStoreStateValue($selectedTargetList);
    const selected = selectedTargetList?.raw().map(child => {
        if (child.type !== "single") {
            const originalChild = layerManager.findArrayChildById(child.id)!;

            return [...originalChild.scope, originalChild.id].join(SCENA_LAYER_SEPARATOR);
        }
        const layer = layerManager.getLayerByElement(child.value);

        if (layer) {
            return [...layer.scope, layer.id].join(SCENA_LAYER_SEPARATOR);
        }
    }).filter(Boolean) as string[] ?? [];

    return <LayersElement>
        <Folder<ScenaElementLayer | ScenaElementLayerGroup>
            scope={[]}
            name=""
            infos={children}
            multiselect={true}
            folded={folded}
            isMove={true}
            isMoveChildren={true}
            nameProperty="title"
            idProperty="id"
            isPadding={true}
            pathSeperator={SCENA_LAYER_SEPARATOR}
            borderColor="transparent"
            childrenProperty={React.useCallback((value: ScenaElementLayer | ScenaElementLayerGroup) => {
                if (value.type === "group") {
                    return value.children;
                } else {
                    return [];
                }
            }, [])}
            selected={selected}
            // onSelect={this.onSelect}
            // checkMove={this.checkMove}
            FileComponent={Layer}
            checkMove={e => {
                return !e.parentInfo || e.parentInfo.value.type === "group";
            }}
            onMove={e => {
                const selectedInfos = e.selectedInfos;
                const scope = e.parentInfo?.path || [];
                const flattenPrevInfo = e.flattenPrevInfo;

                const nextLayers = layers.filter(layer => {
                    const layerPath = [...layer.scope, layer.id];

                    if (selectedInfos.some(info => isArrayContains(info.path, layerPath))) {
                        return false;
                    }
                    return true;
                });

                const selectedLayers: ScenaElementLayer[] = [];

                selectedInfos.forEach(({ value }) => {
                    if (value.type === "group") {
                        const groupScope = value.scope;
                        const flattenLayers = flattenLayerGroup(value);

                        flattenLayers.forEach(layer => {
                            layer.scope.splice(0, groupScope.length, ...scope);
                        });
                        selectedLayers.push(...flattenLayers);
                    } else {
                        value.scope = scope;
                        selectedLayers.push(value);
                    }
                });
                let prevIndex = 0;

                if (flattenPrevInfo) {
                    const flattenInfos = e.flattenInfos;

                    let lastIndex = flattenInfos.findIndex(info => {
                        return info.id === flattenPrevInfo.id;
                    });

                    for (;lastIndex >= 0; --lastIndex) {
                        const info = flattenInfos[lastIndex];
                        const value = info.value;

                        if (value.type === "group") {
                            continue;
                        } else {
                            prevIndex = nextLayers.findIndex(layer => layer.id === value.id) + 1;
                            break;
                        }
                    }
                }

                nextLayers.splice(prevIndex, 0, ...selectedLayers);


                editorRef.current!.changeLayers(nextLayers);
                setFolded(e.nextFolded);

                editorRef.current!.setSelectedTargetList(
                    convertInfosToTargetList(layerManager, selectedInfos)
                );
            }}
            onSelect={e => {

                editorRef.current!.setSelectedTargetList(
                    convertInfosToTargetList(layerManager, e.selectedInfos),
                );
            }}
            onFold={e => {
                setFolded(e.folded);
            }}
        />
    </LayersElement>;
}
