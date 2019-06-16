import builder from "@daybrush/builder";
const resolve = require("./config/resolve");
const commonjs = require("./config/commonjs");
const noenv = require("./config/noenv");



const defaultOptions = {
    tsconfig: "tsconfig.build.json",
    external: {
        "@daybrush/utils": "utils",
        "@daybrush/drag": "utils",
        "@egjs/axes": "eg.Axes",
        "keycon": "KeyController",
        "preact": "Preact",
    },
    plugins: [
        resolve,
        commonjs,
    ],
};

export default builder([
    {
        ...defaultOptions,
        input: "src/preact-timeline/index.ts",
        output: "./dist/timeline.esm.js",
        format: "es",
    },
    {
        ...defaultOptions,
        input: "src/preact-timeline/index.ts",
        output: "./dist/timeline.cjs.js",
        format: "cjs",
    },
]);
