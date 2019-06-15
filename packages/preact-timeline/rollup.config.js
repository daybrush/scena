import builder from "@daybrush/builder";
import css from "rollup-plugin-css-bundle";
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
        noenv,
    ],
};

export default builder([
    {
        ...defaultOptions,
        input: "src/preact-timeline/index.ts",
        output: "./dist/timeline.esm.js",
        format: "es",
        // resolve: true,
    },
    {
        ...defaultOptions,
        input: "src/preact-timeline/index.ts",
        output: "./dist/timeline.cjs.js",
        format: "cjs",
        // resolve: true,
    },
]);
