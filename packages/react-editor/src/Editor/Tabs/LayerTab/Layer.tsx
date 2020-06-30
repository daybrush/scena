import * as React from "react";
import LabelBox from "../../Inputs/LabelBox";
import File from "../Folder/File";
import { ElementInfo } from "../../Viewport/Viewport";

export default class Layer extends File {
    public render() {
        const {
            name,
        } = this.props;
        return <><LabelBox type={"full"} label={name}></LabelBox></>;
    }
}
