import * as React from "react";
import { prefix } from "../../utils";
import { IObject, camelize } from "@daybrush/utils";
import EventBus from "../EventBus";


export interface Maker {
    tag: string,
    props: IObject<any>,
    style: IObject<any>,
}
export default abstract class Icon extends React.PureComponent<{
    selected?: boolean,
    onSelect?: (id: string) => any;
}> {
    public static id: string;
    public static maker?: () => Maker;
    public abstract renderIcon(): any;
    private subContainer = React.createRef<HTMLDivElement>();
    public render() {
        return (
            <div className={prefix("icon", this.props.selected ? "selected" : "")}
                onClick={this.onClick}>
                {this.renderIcon()}
                {this.renderSubContainer()}
            </div>
        );
    }
    public renderSubContainer() {
        const subIcons = this.renderSubIcons();

        if (!subIcons.length) {
            return;
        }
        return [
            <div key={"extends-icon"} className={prefix("extends-icon")}></div>,
            this.props.selected && <div key={"extends-container"}
                className={prefix("extends-container")} ref={this.subContainer}
                onClick={this.onSubClick}
                >
                {subIcons}
            </div>,
        ];
    }
    public renderSubIcons(): any[] {
        return [];
    }
    public renderSubIcon(IconClass: typeof Icon, id: string, isSelect: boolean) {
        return <div key={id} className={prefix("icon", "sub-icon", isSelect ? "selected" : "")} onClick={() => {
            this.onSubSelect!(id);
        }}>
            <IconClass selected={false} />
            <div className={prefix("sub-icon-label")}>
                {camelize(` ${id}`)}
            </div>
        </div>;
    }
    public onClick = () => {
        if (this.props.selected) {
            this.focusSub();
        }
        const onSelect = this.props.onSelect;

        if (onSelect) {
            onSelect((this.constructor as any).id);
        }
    }
    public onSubClick = (e: any) => {
        e.stopPropagation();
    }
    public focusSub() {
        const subContainer = this.subContainer.current;
        if (!subContainer) {
            return;
        }

        if (subContainer.style.display === "block") {
            subContainer.style.display = "none";
        } else {
            subContainer.style.display = "block";
        }

    }
    public blur = () => {
        const subContainer = this.subContainer.current;
        if (!subContainer) {
            return;
        }

        subContainer.style.display = "none";
    }
    public onSubSelect(id: string) {}
    public componentDidMount() {
        EventBus.on("blur", this.blur);
    }
    public componentWillUnmount() {
        EventBus.off("blur", this.blur);
    }
}
