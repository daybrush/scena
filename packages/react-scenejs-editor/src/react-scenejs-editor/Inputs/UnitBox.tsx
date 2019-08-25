import * as React from "react";
import Input from "./Input";
import { prefix } from "../../utils";
import NumberBox from "./NumberBox";
import SelectBox from "./SelectBox";
import { splitUnit } from "@daybrush/utils";
import { ref } from "framework-utils";

export default class UnitBox extends Input<{
    options: string[],
}> {
    private numberBox!: NumberBox;
    private selectBox!: SelectBox;
    public render() {
        const { value, unit } = this.splitUnit();
        return (
            <div className={prefix("unit")}>
                <NumberBox ref={ref(this, "numberBox")}
                    value={value} setCallback={this.setCallback} />
                <SelectBox ref={ref(this, "selectBox")}
                    value={unit} options={this.props.options} setCallback={this.props.setCallback} />
            </div>
        );
    }
    public setValue() {
        return;
    }
    protected setCallback = () => {
        this.props.setCallback(this.numberBox.getValue() + this.selectBox.getValue());
    }
    private splitUnit() {
        const { value, unit } = splitUnit(this.props.value);

        if (isNaN(value)) {
            return { value: "", unit: this.props.value };
        } else {
            return { value, unit };
        }
    }
}
