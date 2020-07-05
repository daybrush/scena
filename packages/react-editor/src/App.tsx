import * as React from "react";
import { Editor } from "./Editor/Editor";


class App extends React.Component {
    public editor = React.createRef<Editor>();
    public render() {
        return <Editor  ref={this.editor} />;
    }
    public componentDidMount() {
        (window as any).a = this.editor.current!;
        this.editor.current!.appendJSX(
            <div className="moveable" contentEditable="true">Moveable</div>,
            "(Logo)",
            {
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "250px",
                height: "200px",
                "font-size": "40px",
                "transform": "translate(-125px, -100px)",
                display: "flex",
                "justify-content": "center",
                "flex-direction": "column",
                "text-align": "center",
                "font-weight": 100,
            },
        );
    }
}

export default App;
