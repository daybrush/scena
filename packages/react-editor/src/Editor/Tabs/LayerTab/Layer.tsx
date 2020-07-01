import * as React from "react";
import LabelBox from "../../Inputs/LabelBox";
import File from "../Folder/File";

export default class Layer extends File {
    public render() {
        const {
            name,
        } = this.props;
        return <><LabelBox type={"full"} label={name}></LabelBox></>;
    }
}
