

import * as React from "react";
import Folder, { FileProps } from "../Folder";
import { ScenaElementLayer, ScenaElementLayerGroup } from "../../types";
import { useStoreStateValue } from "@scena/react-store";
import { $editor, $layerManager, $selectedLayers } from "../../stores/stores";
import { flattenLayerGroup, isArrayContains, prefix } from "../../utils/utils";
import styled from "react-css-styled";
import { SCENA_LAYER_SEPARATOR } from "../../consts";
import { FolderIcon, InvisibleIcon, LayerIcon, VisibleIcon } from "../icons";

const LayersElement = styled("div", `
.scena-folder-file {
    position: relative;
    box-sizing: border-box;
    padding: 5px 0px;
    display: inline-block;
    width: 100%;
    font-size: 12px;
}
.scena-layer.scena-layer-invisible {
    color: #9aa;
}
.scena-layer.scena-layer-invisible svg, .scena-layer.scena-layer-invisible path {
    fill: #9aa;
    stroke: #9aa;
}
.scena-folder-file-name {
    width: 100%;
}
.scena-folder-file:hover .scena-layer-extra {
    opacity: 1;
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
.scena-layer-title {
    flex: 1;
}
.scena-layer-extra {
    margin-right: 5px;
    opacity: 0;
}

.scena-layer-extra svg {
    width: 18px;
    height: 18px;
    fill: #eee;
    padding: 2px;
    box-sizing: border-box;
}
.scena-layer-invisible .scena-layer-extra.scena-layer-invisible-extra {
    opacity: 1;
}
`);



// layerProperties 지원 가능성?

function Layer({ name, value }: FileProps<ScenaElementLayer | ScenaElementLayerGroup>) {
    const layerManager = useStoreStateValue($layerManager);
    let iconJsx: JSX.Element | null = <LayerIcon />;

    if (value.type === "group") {
        iconJsx = <FolderIcon />;
    }
    let invisible = false;

    if (value.type === "group") {
        invisible = value.display === "none";
    } else {
        invisible = layerManager.getFrame(value).get("display") === "none";
    }
    let parentInvisible = false;

    if (!invisible) {
        const composited = layerManager.compositeFrame(value);
        parentInvisible = composited.get("display") === "none";
    }
    return <div className={prefix("layer", invisible || parentInvisible ? "layer-invisible" : "")}>
        <div className={prefix("layer-icon")}>{iconJsx}</div>
        <div className={prefix("layer-title")}>{name || (value.type === "group" ? "(Group)" : "(Layer)")}</div>
        <div className={prefix(
            "layer-extra",
            invisible ? "layer-invisible-extra" : "layer-visible-extra",
        )}>
            {invisible ? <InvisibleIcon  /> : <VisibleIcon  />}
        </div>
    </div>;
}

export default function LayersTab() {
    const editorRef = useStoreStateValue($editor);
    const layerManager = useStoreStateValue($layerManager);
    const [folded, setFolded] = React.useState<string[]>([]);
    const children = layerManager.findChildren();
    const layers = layerManager.use();
    const selectedLayers = useStoreStateValue($selectedLayers);
    const selected = selectedLayers.map(layer => {
        return [...layer.scope, layer.id].join(SCENA_LAYER_SEPARATOR);
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

                    for (; lastIndex >= 0; --lastIndex) {
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

                editorRef.current!.setSelectedLayers(
                    selectedInfos.map(info => info.value),
                );
            }}
            onSelect={e => {

                editorRef.current!.setSelectedLayers(
                    e.selectedInfos.map(info => info.value),
                );
            }}
            onFold={e => {
                setFolded(e.folded);
            }}
        />
    </LayersElement>;
}
