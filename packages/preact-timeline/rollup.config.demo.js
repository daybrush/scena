import builder from "@daybrush/builder";
import css from "rollup-plugin-css-bundle";
const resolve = require("./config/resolve");
const commonjs = require("./config/commonjs");
const noenv = require("./config/noenv");




export default builder({
    input: "./src/demo/index.tsx",
    tsconfig: "./tsconfig.build.json",
    sourcemap: false,
    format: "umd",
    output: "./demo/dist/index.js",
    name: "app",
    exports: "named",
    plugins: [
        resolve,
        css({ output: "./demo/dist/index.css" }),
        commonjs,
    ],
});
