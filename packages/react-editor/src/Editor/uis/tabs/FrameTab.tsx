

import * as React from "react";
import Folder, { FileProps } from "@scena/react-folder";
import { useStoreStateValue } from "@scena/react-store";
import { $editor, $layerManager, $selectedLayers } from "../../stores/stores";
import { prefix } from "../../utils/utils";
import styled from "react-css-styled";
import { SCENA_LAYER_SEPARATOR } from "../../consts";
import { isObject } from "@daybrush/utils";
import { useAction } from "../../hooks/useAction";
import { Frame } from "scenejs";
import { Text } from "./inputs/Text";
import { FOLDER_DEFAULT_STYLE } from "./FolderStyls";

const FrameElement = styled("div", `
${FOLDER_DEFAULT_STYLE}

.scena-folder-file, .scena-folder-empty {
    position: relative;
    box-sizing: border-box;
    height: 30px;
    line-height: 30px;
    display: inline-block;
    width: 100%;
    font-size: 12px;
    color: var(--scena-editor-color-text);
}
.scena-folder-empty {
    text-align: center;
}
.scena-folder-file-name {
    width: 100%;
}
.scena-property {
    display: flex;
    align-content: center;
    line-height: 30px;
}
.scena-property-label {
    flex: 1;
}
.scena-property-input {
    flex: 1;
}

`);



const FrameContext = React.createContext<Frame | null>(null);

function Property({ name, scope, path }: FileProps<string | number>) {
    const frame = React.useContext(FrameContext);

    const value = frame?.get(...path);

    return <div className={prefix("property")}>
        <div className={prefix("property-label")}>{name}</div>
        {!isObject(value) && <div className={prefix("property-input")}><Text value={value} onChange={e => {
        }}/></div>}
    </div>;
}


export default function FrameTab() {
    const layerManager = useStoreStateValue($layerManager);
    const [folded, setFolded] = React.useState<string[]>([]);
    const selectedLayers = useStoreStateValue($selectedLayers);
    const selected = layerManager.toFlatten(selectedLayers).map(layer => {
        const frame = layerManager.getFrame(layer);

        return frame;
    }).filter(Boolean) as Frame[] ?? [];

    useAction("render.end");

    const firstFrame = selected[0];
    const fisrtInfos = firstFrame?.getOrders([]) || [];
    return <FrameElement>
        <FrameContext.Provider value={firstFrame}>
            {fisrtInfos.length ? <Folder<string | number>
                scope={[]}
                infos={fisrtInfos}
                multiselect={true}
                folded={folded}
                isMove={true}
                isMoveChildren={true}
                nameProperty={value => value}
                idProperty={value => `${value}`}
                isPadding={true}
                pathSeperator={SCENA_LAYER_SEPARATOR}
                selectedColor="var(--scena-editor-color-folder-selected)"
                iconColor="var(--scena-editor-color-folder-fold)"
                fontColor="var(--scena-editor-color-text)"
                backgroundColor="transparent"
                borderColor="transparent"
                childrenProperty={(value: string | number, scope: string[]) => {
                    return firstFrame?.getOrders([...scope, value]) ?? [];
                }}
                selected={[]}
                FileComponent={Property}
                checkMove={() => false}
                onFold={e => {
                    setFolded(e.folded);
                }}
            /> : <div className={prefix("folder-empty")}>Empty</div>}
        </FrameContext.Provider>
    </FrameElement>;
}
