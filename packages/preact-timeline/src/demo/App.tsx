
import { h, Component } from "preact";
import Timeline from "../preact-timeline";
import Scene from "scenejs";
import { zoomIn } from "@scenejs/effects";
import { poly } from "shape-svg";
import "./App.css";

export default class App extends Component<{}> {
    private scene: Scene = new Scene();
    private timeline!: Timeline;
    public render() {
        return (
            <div>
                <div className="clapper">
                    <div className="clapper-container">
                        <div className="clapper-body">
                            <div className="top">
                                <div className="stick stick1">
                                    <div className="rect"></div>
                                    <div className="rect"></div>
                                    <div className="rect"></div>
                                    <div className="rect"></div>
                                    <div className="rect"></div>
                                    <div className="rect"></div>
                                </div>
                                <div className="stick stick2">
                                    <div className="rect"></div>
                                    <div className="rect"></div>
                                    <div className="rect"></div>
                                    <div className="rect"></div>
                                    <div className="rect"></div>
                                    <div className="rect"></div>
                                </div>
                            </div>
                            <div className="bottom"></div>
                        </div>
                        <div className="circle"></div>
                        <div className="play"></div>
                    </div>
                </div>
                <Timeline
                    ref={e => {this.timeline = e as any}}
                    scene={this.scene}
                    style={{ maxHeight: "350px", position: "fixed", left: 0, right: 0, bottom:0 }}
                />
            </div>);
    }
    public componentDidMount() {
        (window as any).app = this;

        document.querySelector(".play")!.appendChild(poly({
            strokeWidth: 10,
            left: 5,
            top: 5,
            right: 5, bottom: 5, width: 50, rotate: 90, fill: "#333", stroke: "#333",
        }));
        this.scene.load({
            ".clapper": {
                2: "transform: translate(-50%, -50%) rotate(0deg)",
                2.5: {
                    transform: "rotate(-15deg)",
                },
                3: {
                    transform: "rotate(0deg)",
                },
                3.5: {
                    transform: "rotate(-10deg)",
                },
            },
            ".clapper-container": {
                0: zoomIn({ duration: 1 }),
            },
            ".circle": {
                0.3: zoomIn({ duration: 1 }),
            },
            ".play": {
                0: {
                    transform: "translate(-50%, -50%)",
                },
                0.6: zoomIn({ duration: 1 }),
            },
            ".top .stick1": {
                2: {
                    transform: {
                        rotate: "0deg",
                    },
                },
                2.5: {
                    transform: {
                        rotate: "-20deg",
                    },
                },
                3: {
                    transform: {
                        rotate: "0deg",
                    },
                },
                3.5: {
                    transform: {
                        rotate: "-10deg",
                    },
                },
            },
            ".stick1 .rect": i => ({
                0: {
                    transform: {
                        scale: 0,
                        skew: "15deg",
                    },
                },
                0.7: {
                    transform: {
                        scale: 1,
                    },
                },
                options: {
                    delay: 0.6 + i * 0.1,
                },
            }),
            ".stick2 .rect": i => ({
                0: {
                    transform: {
                        scale: 0,
                        skew: "-15deg",
                    },
                },
                0.7: {
                    transform: {
                        scale: 1,
                    },
                },
                options: {
                    delay: 0.8 + i * 0.1,
                },
            }),
        }, {
                easing: "ease-in-out",
                iterationCount: "infinite",
                selector: true,
            });
        this.timeline.update(true);
    }
}
