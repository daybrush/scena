import * as React from "react";
import { prefix } from "../../utils";
import LabelBox from "../Inputs/LabelBox";
import { IObject, isObject } from "@daybrush/utils";
import TabInputBox from "../Inputs/TabInputBox";
import TextBox from "../Inputs/TextBox";
import "./Folder.css";

export default class Folder extends React.PureComponent<{
    scope: string[],
    name: string,
    properties: IObject<any>,
}> {
    public state = {
        fold: false,
    };
    render() {
        const {
            scope,
            name,
        } = this.props;

        return <div className={prefix("properties")}>
            {name && <div className={prefix("tab-input", "full")}>
                <div className={prefix("fold-icon", this.state.fold ? "fold" : "")} onClick={this.onClickFold}></div><h3>{name}</h3>
            </div>}
            <div className={prefix("properties")} style={{
                marginLeft: scope.length ? "10px" : "",
            }}>
                {this.renderProperties()}
            </div>
        </div>
    }
    public renderProperties() {
        const {
            scope,
            properties,
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
                return <Folder key={fullName} name={name} scope={nextScope} properties={value} />;
            }
            return <div key={fullName} className={prefix("property")}>
                <LabelBox type={"third"} label={name}></LabelBox>
                <TabInputBox type={"twothird"} input={TextBox} inputProps={{
                    value,
                    updateValue: true,
                }}
                    onChange={e => { }}
                ></TabInputBox>
            </div>;
            // return <div key={fullName}>{name}, {value}</div>;
        });
    }
    private onClickFold = () => {
        this.setState({
            fold: !this.state.fold,
        })
    }
}
