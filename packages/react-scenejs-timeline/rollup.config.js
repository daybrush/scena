import builder from "@daybrush/builder";

const defaultOptions = {
    external: {
        "@daybrush/utils": "utils",
        "@daybrush/drag": "utils",
        "@egjs/axes": "eg.Axes",
        "react": "React",
        "keycon": "KeyController",
        "react-dom": "ReactDOM",
    },
};

export default builder([
    {
        ...defaultOptions,
        input: "src/react-scenejs-timeline/index.ts",
        output: "./dist/timeline.esm.js",
        format: "es",
    },
    {
        ...defaultOptions,
        input: "src/react-scenejs-timeline/index.ts",
        output: "./dist/timeline.cjs.js",
        format: "cjs",
    },
]);
