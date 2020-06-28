import * as React from "react";
import { prefix } from "../../../utils";
import LabelBox from "../../Inputs/LabelBox";
import { IObject, isObject } from "@daybrush/utils";
import TabInputBox from "../../Inputs/TabInputBox";
import TextBox from "../../Inputs/TextBox";
import "./Folder.css";
import File from "./File";

export default class Folder extends React.PureComponent<{
    scope: string[],
    name: string,
    properties: IObject<any>,
    selected: string | null,
    onSelect: (e: string) => any,
    FileComponent: ((props: File["props"]) => any) | typeof File,
}> {
    public state = {
        fold: false,
    };
    render() {
        const {
            scope,
            name,
            selected,
        } = this.props;

        const fullName = scope.join("///");
        return <div className={prefix("properties")}>
            {name && <div className={prefix("tab-input", "full", "property", fullName === selected ? "selected" : "")}
                data-property-name={fullName} onClick={this.onClick}>
                <div className={prefix("fold-icon", this.state.fold ? "fold" : "")} onClick={this.onClickFold}></div>
                <h3 >{name}</h3>
            </div>}
            <div className={prefix("properties")} style={{
                marginLeft: scope.length ? "10px" : "",
            }}>
                {this.renderProperties()}
            </div>
        </div>
    }
    public onClick = ({ currentTarget }: any) => {
        const name = currentTarget.getAttribute("data-property-name");

        this.props.onSelect(name);
    }
    public renderProperties() {
        const {
            scope,
            properties,
            selected,
            onSelect,
            FileComponent,
        } = this.props;

        if (this.state.fold) {
            return;
        }

        const keys = Object.keys(properties);

        return keys.map(name => {
            const nextScope = scope.slice();

            nextScope.push(name);
            const fullName = nextScope.join("///");
            const value = properties[name];

            if (isObject(value)) {
                return <Folder key={fullName} name={name} scope={nextScope} properties={value} selected={selected} onSelect={onSelect} FileComponent={FileComponent} />;
            }
            return <div key={fullName} className={prefix("property", fullName === selected ? "selected" : "")}
                data-property-name={fullName} onClick={this.onClick}>
                <FileComponent scope={nextScope} name={name} value={value} fullName={fullName} />
            </div>;
        });
    }
    private onClickFold = (e: any) => {
        e.stopPropagation();
        this.setState({
            fold: !this.state.fold,
        })
    }
}
