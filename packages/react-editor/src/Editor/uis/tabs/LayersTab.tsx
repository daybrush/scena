

import * as React from "react";
import Folder, { FileProps } from "../Folder";
import { ScenaElementLayer, ScenaElementLayerGroup } from "../../types";
import { useStoreStateValue } from "../../Store/Store";
import { $editor, $layerManager } from "../../stores/stores";
import { flattenLayerGroup, isArrayContains, prefix } from "../../utils/utils";
import styled from "react-css-styled";
import { SCENA_LAYER_SEPARATOR } from "../../consts";


function Layer({ name, scope }: FileProps) {
    return <div className={prefix("layer")}>{name}</div>;
}

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
    border: 1px solid var(--folder-selected-color);
    box-sizing: border-box;
}
.scena-layer {

}
`);
export default function LayersTab() {
    const editorRef = useStoreStateValue($editor);
    const layerManager = useStoreStateValue($layerManager);
    const [folded, setFolded] = React.useState<string[]>([]);
    const [selected, setSelected] = React.useState<string[]>([]);
    const children = layerManager.findChildren();
    const layers = layerManager.use();

    return <LayersElement>
        <Folder<ScenaElementLayer | ScenaElementLayerGroup>
            scope={[]}
            name=""
            infos={children}
            multiselect={true}
            folded={folded}
            isMove={true}
            isMoveChildren={true}
            nameProperty="id"
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
                const prevLayerGroup = e.flattenPrevInfo?.value;


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

                if (prevLayerGroup) {
                    if (prevLayerGroup.type === "group") {
                        const prevScope = prevLayerGroup.scope;

                        prevIndex = nextLayers.findIndex(layer => isArrayContains(prevScope, layer.scope));

                    } else {
                        prevIndex = nextLayers.indexOf(prevLayerGroup) + 1;
                    }
                }

                nextLayers.splice(prevIndex, 0, ...selectedLayers);

                editorRef.current!.setLayers(nextLayers).then(() => {
                    const nextSelected = selectedInfos.map(info => {
                        const infoPath = info.path;

                        return [...scope, infoPath[infoPath.length - 1]].join(SCENA_LAYER_SEPARATOR);
                    });
                    setSelected(nextSelected);
                });
            }}
            onSelect={e => {
                setSelected(e.selected);
            }}
            onFold={e => {
                setFolded(e.folded);
            }}
        />
    </LayersElement>;
}
