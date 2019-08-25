import * as React from "react";
import { prefix } from "../../utils";
import Moveable from "../../../react-moveable/Moveable";

export default class MenuControl extends React.Component<{
    selected?: boolean,
}> {
    public render() {
        const { selected } = this.props;
        return (
            <Moveable />);
    }
}
