import * as React from "react";
import { prefix } from "../utils";
import Menu from "./Menu";

export default class Menus extends React.Component<{
}> {
    public render() {
        return (
            <div className={prefix("menus")}>
                <Menu/>
            </div>);
    }
}
