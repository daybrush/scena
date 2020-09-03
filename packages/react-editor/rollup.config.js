import builder from "@daybrush/builder";

const defaultOptions = {
    tsconfig: "tsconfig.build.json",
};

export default builder([{
        ...defaultOptions,
        input: "src/Editor/index.ts",
        output: "./dist/editor.esm.js",
        format: "es",
        exports: "named",
    },
    {
        ...defaultOptions,
        input: "src/Editor/index.umd.ts",
        output: "./dist/editor.cjs.js",
        format: "cjs",
    },
]);
