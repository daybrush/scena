
const commonjs = require("rollup-plugin-commonjs");

module.exports = commonjs({
    namedExports: {
        "node_modules/shallowequal/index.js": undefined,
    },
});
