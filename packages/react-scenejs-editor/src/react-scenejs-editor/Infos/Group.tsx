import * as React from "react";
import { prefix } from "../../utils";
import Option from "./Option";
import { IObject, isObject } from "@daybrush/utils";
import PureProps from "react-pure-props";
import { PROPERTY_TYPES } from "../../consts";

function getFullname(scope: string, name: string) {
    return `${scope ? scope + "///" : scope}${name}`;
}
export default class Group extends PureProps<{
    scope: string,
    name: string,
    properties: IObject<any>,
    enable?: boolean,
    setCallback: (name: string, value: any) => void,
}> {
    public render() {
        const { name, enable } = this.props;

        return (
            <div className={prefix("info")}>
                <div className={prefix("option", "title")}><h3>{name}</h3></div>
                <div className={prefix("group")}>
                    {this.renderProperties()}
                    <div className={prefix("option", "add")}>
                        <div className={prefix("button", enable ? "" : "disable")} onClick={this.onClick}>+</div>
                    </div>
                </div>
            </div>);
    }
    public renderProperties() {
        const { scope, properties, setCallback } = this.props;
        const keys = Object.keys(properties);

        return keys.map(name => {
            const nextScope = getFullname(scope, name);
            const [type, param] = [].concat(PROPERTY_TYPES[nextScope] || []);
            const value = properties[name];

            if (isObject(properties[name]) || type === "group") {
                return <Group
                    key={name}
                    scope={nextScope}
                    name={name}
                    enable={true}
                    properties={value} setCallback={setCallback} />;
            }
            return <Option
                key={name}
                type={type}
                param={param}
                name={name} value={value} setCallback={this.setCallback} />;
        });
    }
    public onClick = () => {
        if (!this.props.enable) {
            return;
        }
        const {scope, properties} = this.props;
        const name = prompt("Add Property");

        if (!name || properties[name]) {
            return;
        }
        if (PROPERTY_TYPES[getFullname(scope, name)] === "group") {
            properties[name] = {};
        } else {
            properties[name] = "";
        }
        this.forceUpdate();
    }
    public setCallback = (name: string, value: any) => {
        this.props.setCallback(getFullname(this.props.scope, name), value);
    }
}
