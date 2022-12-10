/* eslint-disable max-len */
import * as React from "react";
import "./App.css";
import { ScenaProps } from "../Editor/types";
import Editor, { makeScenaFunctionComponent } from "../Editor";

const Badge = makeScenaFunctionComponent("Badge", function Badge(props: ScenaProps) {
    return <p className="badges" data-scena-element-id={props.scenaElementId}>
        <a href="https://www.npmjs.com/package/moveable" target="_blank" rel="noreferrer">
            <img src="https://img.shields.io/npm/v/moveable.svg?style=flat-square&amp;color=007acc&amp;label=version" alt="npm version" /></a>
        <a href="https://github.com/daybrush/moveable" target="_blank" rel="noreferrer">
            <img src="https://img.shields.io/github/stars/daybrush/moveable.svg?color=42b883&amp;style=flat-square" /></a>
        <a href="https://github.com/daybrush/moveable" target="_blank" rel="noreferrer">
            <img src="https://img.shields.io/badge/language-typescript-blue.svg?style=flat-square" />
        </a>
        <br />
        <a href="https://github.com/daybrush/moveable/tree/master/packages/react-moveable" target="_blank" rel="noreferrer"><img alt="React" src="https://img.shields.io/static/v1.svg?label=&amp;message=React&amp;style=flat-square&amp;color=61daeb" /></a>
        <a href="https://github.com/daybrush/moveable/tree/master/packages/preact-moveable" target="_blank" rel="noreferrer"><img alt="Preact" src="https://img.shields.io/static/v1.svg?label=&amp;message=Preact&amp;style=flat-square&amp;color=673ab8" /></a>
        <a href="https://github.com/daybrush/moveable/tree/master/packages/ngx-moveable" target="_blank" rel="noreferrer"><img alt="Angular" src="https://img.shields.io/static/v1.svg?label=&amp;message=Angular&amp;style=flat-square&amp;color=C82B38" /></a>
        <a href="https://github.com/probil/vue-moveable" target="_blank" rel="noreferrer"><img alt="Vue" src="https://img.shields.io/static/v1.svg?label=&amp;message=Vue&amp;style=flat-square&amp;color=3fb984" /></a>
        <a href="https://github.com/daybrush/moveable/tree/master/packages/svelte-moveable" target="_blank" rel="noreferrer"><img alt="Svelte" src="https://img.shields.io/static/v1.svg?label=&amp;message=Svelte&amp;style=flat-square&amp;color=C82B38" /></a>
    </p>;
});

class App extends React.Component {
    // public editor = React.createRef<Editor>();
    public render() {
        return <div className="app">
            <Editor
                // ref={this.editor}
                // debug={false}
            />
            <div className="bottom">
                <a href="https://github.com/daybrush/moveable" target="_blank" rel="noreferrer">Download</a>
                <a href="https://daybrush.com/moveable/release/latest/doc" target="_blank" rel="noreferrer">API</a>
                <a href="https://daybrush.com/moveable/storybook" target="_blank" rel="noreferrer">Storybook</a>
            </div>
        </div>;
    }
    public componentDidMount() {
        // (window as any).a = this;
        // this.editor.current!.appendJSXs([
        //     {
        //         jsx: <div className="moveable" contentEditable="true" suppressContentEditableWarning={true}>Moveable</div>,
        //         name: "(Logo)",
        //         frame: {
        //             position: "absolute",
        //             left: "50%",
        //             top: "30%",
        //             width: "250px",
        //             height: "200px",
        //             "font-size": "40px",
        //             "transform": "translate(-125px, -100px)",
        //             display: "flex",
        //             "justify-content": "center",
        //             "flex-direction": "column",
        //             "text-align": "center",
        //             "font-weight": 100,
        //         },
        //     },
        //     {
        //         jsx: <Badge />,
        //         name: "(Badges)",
        //         frame: {
        //             position: "absolute",
        //             left: "0%",
        //             top: "50%",
        //             width: "100%",
        //             "text-align": "center",
        //         },
        //     },
        //     {
        //         jsx: <div className="moveable" contentEditable="true" suppressContentEditableWarning={true}>Moveable is Draggable! Resizable! Scalable! Rotatable! Warpable! Pinchable</div>,
        //         name: "(Description)",
        //         frame: {
        //             position: "absolute",
        //             left: "0%",
        //             top: "65%",
        //             width: "100%",
        //             "font-size": "14px",
        //             "text-align": "center",
        //             "font-weight": "normal",
        //         },
        //     },
        // ], true).then(targets => {
        //     this.editor.current!.setSelectedTargets([targets[0]], true);
        // });
    }
}

export default App;
