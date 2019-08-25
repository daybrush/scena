import builder from "@daybrush/builder";

const defaultOptions = {
    tsconfig: "tsconfig.build.json",
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
        input: "src/react-scenejs-editor/index.ts",
        output: "./dist/editor.esm.js",
        format: "es",
    },
    {
        ...defaultOptions,
        input: "src/react-scenejs-editor/index.ts",
        output: "./dist/editor.cjs.js",
        format: "cjs",
    },
]);
