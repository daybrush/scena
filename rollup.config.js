
import builder from "@daybrush/builder";

export default builder([
    {
        name: "Editor",
        input: "src/index.umd.ts",
        output: "./dist/editor.js",
    },
    {
        name: "Editor",
        input: "src/index.umd.ts",
        output: "./dist/editor.min.js",
        uglify: true,

    },
    {
        name: "Editor",
        input: "src/index.umd.ts",
        output: "./dist/editor.pkgd.js",
        resolve: true,
    },
    {
        name: "Editor",
        input: "src/index.umd.ts",
        output: "./dist/editor.pkgd.min.js",
        resolve: true,
        uglify: true,
    },
    {
        input: "src/index.ts",
        output: "./dist/editor.esm.js",
        exports: "named",
        format: "es",
    },
    {
        input: "src/index.ts",
        output: "./dist/editor.cjs.js",
        exports: "named",
        format: "cjs",
    },
]);
