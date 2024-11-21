module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    //"parser":  'vue-eslint-parser',
    "extends": [
        "eslint:recommended",
        "plugin:vue/essential"
    ],
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        parser: "babel-eslint",
        "ecmaVersion": 6,
        // specifying a module sourcetype prevent eslint from marking import statements as errors
        sourceType: "module"
    },
    "plugins": [
        "vue"
    ],
    "rules": {
    }
};