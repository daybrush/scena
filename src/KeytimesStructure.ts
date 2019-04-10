export function getKeytimesStructure(maxTime) {
    const keytimes = [];

    for (let time = 0; time <= maxTime; ++time) {
        keytimes.push({
            dataset: {
                time,
            },
            selector: ".keytime",
            style: {
                width: `${100 / maxTime}%`,
            },
            children: [
                {
                    selector: "span",
                    html: `${time}s`,
                },
                {selector: ".graduation.start"},
                {selector: ".graduation.quarter"},
                {selector: ".graduation.half"},
                {selector: ".graduation.quarter3"},
            ],
        });
    }
    return keytimes;
}
export function getLinesStructure(maxTime: number) {
    const lines = [];

    for (let time = 0; time <= maxTime; ++time) {
        lines.push({
            selector: ".division_line",
            style: {
                left: `${100 / maxTime * time}%`,
            },
        });
    }
    return lines;
}