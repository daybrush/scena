export const EDITOR_PROPERTIES = ["memory", "eventBus", "keyManager", "moveableData", "moveableManager", "historyManager", "console"];
export const PREFIX = "scena-";
export const DATA_SCENA_ELEMENT_ID = "data-scena-element-id";
export const DATA_SCENA_ELEMENT = "data-scena-element";
export const userAgent = ((typeof navigator !== "undefined" && navigator) || {} as any).userAgent || "";
export const isMacintosh = userAgent.indexOf('Macintosh') >= 0 || userAgent.indexOf('iPad') >= 0 || userAgent.indexOf('iPhone') >= 0;
export const TYPE_SCENA_LAYERS = "application/x-scena-layers";
