import * as React from "react";
import "./Folder.css";

export default class File<T = {}> extends React.PureComponent<{
    name: string,
    scope: string[],
    fullName: string,
    value: any,
} & T> {
}
