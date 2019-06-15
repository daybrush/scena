
const commonjs = require("rollup-plugin-commonjs");

module.exports = commonjs({
    namedExports: {
        "node_modules/react-is/umd/react-is.producution.min.js": ["isElement", "isValidElementType", "ForwardRef"],
        "node_modules/shallowequal/index.js": undefined,
    },
});
