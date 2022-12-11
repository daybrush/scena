import * as React from "react";
import { FileProps } from "./types";

export default class File<T = {}, U = {}> extends React.PureComponent<FileProps<T, U>> {
}
