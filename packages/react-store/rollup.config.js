const builder = require("@daybrush/builder");

const defaultOptions = {
    tsconfig: "tsconfig.build.json",
};

module.exports = builder([{
        ...defaultOptions,
        input: "src/index.tsx",
        output: "./dist/store.esm.js",
        format: "es",
        exports: "named",
    },
    {
        ...defaultOptions,
        input: "src/index.tsx",
        output: "./dist/store.cjs.js",
        format: "cjs",
        exports: "named",
    },
]);
