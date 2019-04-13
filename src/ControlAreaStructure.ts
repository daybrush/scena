export function getControlAreaStructure() {
    return {
        selector: ".header_area.control_area",
        children: [
            {
                selector: ".properties_area",
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
                            selector: ".time_area",
                            id: "timeArea",
                            html: "0",
                        },
                        {
                            selector: ".play_control_area",
                            id: "playControlArea",
                            children: [
                                {
                                    id: "prevBtn",
                                    selector: ".control.prev",
                                    html: "prev",
                                },
                                {
                                    id: "playBtn",
                                    selector: ".control.play",
                                    html: "play",
                                },
                                {
                                    id: "nextBtn",
                                    selector: ".control.next",
                                    html: "next",
                                },
                            ],
                        },
                    ],
                },
            },
        ],
    };
}
