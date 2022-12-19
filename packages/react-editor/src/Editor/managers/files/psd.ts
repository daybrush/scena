import Psd, { Layer } from "@webtoon/psd";
import {
    VectorStrokeDataAliBlock,
    VectorMaskSettingAliBlock, Point, DoubleDescriptorValue,
    DescriptorValue, VectorStrokeContentDataAliBlock, Descriptor, SolidColorSheetSettingAliBlock,
} from "@webtoon/psd/dist/interfaces";


function getDescriptorColorValue(descriptor?: Descriptor | DescriptorValue): number[] | null {
    if (!descriptor) {
        return null;
    }
    if (("type" in descriptor)) {
        const value = descriptor;

        if (value.type === "Objc") {
            return getDescriptorColorValue(value.descriptor);
        }
    } else {
        const items = descriptor.items;

        if (descriptor.classId === "RGBC") {
            const r = items.get("Rd  ") as DoubleDescriptorValue;
            const g = items.get("Grn ") as DoubleDescriptorValue;
            const b = items.get("Bl  ") as DoubleDescriptorValue;

            return [r.value, g.value, b.value];
        }
        const clr = items.get("Clr ")!;

        if (clr) {
            return getDescriptorColorValue(clr);
        }
    }
    return null;
}


export function compositeSVG(layer: Layer, psd: Psd) {
    const psdWidth = psd.width;
    const psdHeight = psd.height;
    const left = layer.left;
    const top = layer.top;

    function getRelativePosition(pos: { horiz: number, vert: number }) {
        return [
            pos.horiz * psdWidth - left,
            pos.vert * psdHeight - top,
        ].join(" ");
    }
    // background-color: vscg
    // stroke-color: vstk
    // path: vsms, vmsk
    const additionalProperties = layer.additionalProperties;
    const pathProperty = additionalProperties.find(({ key }) => {
        return key === "vmsk" || key === "vsms";
    }) as VectorMaskSettingAliBlock;

    if (!pathProperty) {
        return null;
    }
    interface PathRecord {
        preceding: Point;
        anchor: Point;
        leaving: Point;
    }

    const ds: string[] = [];
    const style: Record<string, any> = {};
    const pathRecords = pathProperty.pathRecords;

    pathRecords.forEach((record, i) => {
        if (record.type === 0) {
            const length = record.length;
            const subRecords = pathRecords.slice(i + 1, i + 1 + length) as PathRecord[];

            // if(record.operation === 0) {
            //     subRecords.reverse
            // }
            ds.push(subRecords.map((subRecord, j) => {
                const nextRecord = subRecords[j + 1] || subRecords[0];

                return `${j ? "L" : "M"} ${getRelativePosition(subRecord.anchor)} `
                    + `C ${getRelativePosition(subRecord.leaving)} `
                    + `${getRelativePosition(nextRecord.preceding)} `
                    + `${getRelativePosition(nextRecord.anchor)} `;
            }).join(" "));
        }
    });


    const strokeProperty = additionalProperties.find(({ key }) => {
        return key === "vstk";
    }) as VectorStrokeDataAliBlock;
    const fillProperty1 = additionalProperties.find(({ key }) => {
        return key === "vscg";
    }) as VectorStrokeContentDataAliBlock;
    const fillProperty2 = additionalProperties.find(({ key }) => {
        return key === "SoCo";
    }) as SolidColorSheetSettingAliBlock;

    if (strokeProperty) {
        const items = strokeProperty.data.descriptor.items;

        // type UntF = Unit Float
        // UnitType #Pnt = point
        const strokeWidthInfo = items.get("strokeStyleLineWidth");
        if (strokeWidthInfo?.type === "UntF") {
            style.strokeWidth = `${strokeWidthInfo.value}pt`;
        }
        const strokeColor = getDescriptorColorValue(items.get("strokeStyleContent"));

        if (strokeColor) {
            style.stroke = `rgb(${strokeColor.map(v => Math.floor(v)).join(",")})`;
        }
    }

    const fillColor
        = (fillProperty1 && getDescriptorColorValue(fillProperty1.data.descriptor))
        || (fillProperty2 && getDescriptorColorValue(fillProperty2.data));

    if (fillColor) {
        style.fill = `rgb(${fillColor.map(v => Math.floor(v)).join(",")})`;
    }

    const nextObj: Record<string, any> = {
        d: ds.join(" "),
        style,
    };

    return nextObj;
}
