import * as React from "react";
import { Editor } from "./Editor/Editor";
import "./App.css";

class App extends React.Component {
    public editor = React.createRef<Editor>();
    public render() {
        return <div className="app">
            <Editor ref={this.editor} />
            <div className="bottom">
                <a href="https://github.com/daybrush/moveable" target="_blank">Download</a>
                <a href="./release/latest/doc" target="_blank">API</a>
                <a href="https://daybrush.com/daybrush/storybook" target="_blank">Storybook</a>
            </div>
        </div>;
    }
    public componentDidMount() {
        (window as any).a = this.editor.current!;
        this.editor.current!.appendJSX(
            <div className="moveable" contentEditable="true">Moveable is Draggable! Resizable! Scalable! Rotatable! Warpable! Pinchable</div>,
            "(Description)",
            {
                position: "absolute",
                left: "0%",
                top: "50%",
                width: "400px",
                "font-size": "14px",
                "text-align": "center",
                "font-weight": "400",
            },
        ).then(() => {
            this.editor.current!.appendJSX(
                <div className="moveable" contentEditable="true">Moveable</div>,
                "(Logo)",
                {
                    position: "absolute",
                    left: "50%",
                    top: "30%",
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
        })
    }
}

export default App;
