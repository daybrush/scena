export const FOLDER_DEFAULT_STYLE = `

.scena-folder-file.scena-folder-selected {
    color: var(--scena-editor-color-folder-selected-text);
    --scena-editor-color-icon: var(--scena-editor-color-folder-selected-text);
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
`;
