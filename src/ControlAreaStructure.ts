import { Ids, ElementStructure } from "./types";

export function getControlAreaStructure(ids: Ids): ElementStructure {
    return {
        selector: ".header_area.control_area",
        children: [
            {
                selector: ".properties_area",
                ref: (e: ElementStructure) => {
                    ids.unselectedArea = e;
                },
                children: {
                    selector: ".property",
                },
            },
            {
                selector: ".values_area",
                children: {
                    selector: ".value",
                },
            },
            {
                selector: ".keyframes_area",
                children: {
                    selector: ".keyframes",
                    children: [
                        {
                            selector: "input.time_area",
                            ref: (e: ElementStructure) => {
                                ids.timeArea = e;
                            },
                            html: "???",
                            // html: "0",
                        },
                        {
                            selector: ".play_control_area",
                            children: [
                                {
                                    ref: (e: ElementStructure) => {
                                        ids.prevBtn = e;
                                    },
                                    selector: ".control.prev",
                                },
                                {
                                    ref: (e: ElementStructure) => {
                                        ids.playBtn = e;
                                    },
                                    selector: ".control.play",
                                },
                                {
                                    ref: (e: ElementStructure) => {
                                        ids.nextBtn = e;
                                    },
                                    selector: ".control.next",
                                },
                            ],
                        },
                    ],
                },
            },
        ],
    };
}
