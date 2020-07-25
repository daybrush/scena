import * as React from "react";
import { prefix } from "../../utils/utils";
import { IObject, isObject, isArray } from "@daybrush/utils";
import "./Folder.css";
import File from "./File";
import KeyController from "keycon";

export default class Folder extends React.PureComponent<{
    scope: string[],
    name: string,
    properties: IObject<any>,
    selected: string[] | null,
    multiselect?: boolean,
    onSelect: (e: string[]) => any,
    FileComponent: ((props: File["props"]) => any) | typeof File,
    getId?: (value: any, id: any) => any,
    getFullId?: (id: string, scope: string[]) => string,
    getName?: (value: any, id: any) => any,
    getChildren?: (value: any, id: any) => any,
}> {
    public static defaultProps = {
        getFullId: (id: string, scope: string[]) => [...scope, id].join("///"),
        getId: (_: any, id: any, scope: string[]) => id,
        getName: (_: any, id: any) => id,
        getChildren: (value: any) => value,
    }
    public state = {
        fold: false,
    };
    isSelected(key: string) {
        const selected = this.props.selected;

        return selected && selected.indexOf(key) > -1;
    }
    render() {
        const {
            scope,
            name,
            getFullId,
        } = this.props;

        const fullName = scope.length ? getFullId!(scope[scope.length - 1], scope.slice(-1)) : "";
        return <div className={prefix("folder")}>
            {name && <div className={prefix("tab-input", "full", "file",  this.isSelected(fullName) ? "selected" : "")}
                data-file-key={fullName} onClick={this.onClick}>
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
        const key = currentTarget.getAttribute("data-file-key")!;
        const {
            multiselect,
            onSelect,
            selected,
        } = this.props;
        if (multiselect) {
            let nextSelected = (selected || []).slice();
            const index = nextSelected.indexOf(key);

            if (KeyController.global.shiftKey) {
                if (index > -1) {
                    nextSelected.splice(index, 1);
                } else {
                    nextSelected.push(key);
                }
            } else {
                nextSelected = [key];
            }
            onSelect(nextSelected);
        } else {
            onSelect([key]);
        }
    }
    public renderProperties() {
        const {
            scope,
            properties,
            selected,
            multiselect,
            onSelect,
            getFullId,
            FileComponent,
            getId,
            getName,
            getChildren,
        } = this.props;

        if (this.state.fold) {
            return;
        }
        const keys = Object.keys(properties);

        return keys.map(key => {

            const value = properties[key];
            const name = getName!(value, key);
            const nextScope = scope.slice();
            const id = getId!(value, key);
            const fullName = getFullId!(id, nextScope);
            nextScope.push(id);

            const children = getChildren!(value, key);

            if (children && (isArray(children) ? children.length : isObject(children))) {
                return <Folder key={fullName}
                    name={name} scope={nextScope} properties={children}
                    multiselect={multiselect}
                    getId={getId}
                    getName={getName}
                    getFullId={getFullId}
                    getChildren={getChildren}
                    selected={selected} onSelect={onSelect} FileComponent={FileComponent} />;
            }
            return <div key={fullName} className={prefix("file", this.isSelected(fullName) ? "selected" : "")}
                data-file-key={fullName} onClick={this.onClick}>
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
