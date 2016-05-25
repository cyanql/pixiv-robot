module.exports = {
    "env": {
        "node": true,
        "mocha": true,
        "es6": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "experimentalObjectRestSpread": true
        },
        "sourceType": "module"
    },
    "rules": {
        "quotes": ["error", "single"],
        "semi": ["error", "always"],
        "no-console": 0, 
        "no-unused-vars": 1,
        "consistent-return": 0
    }
};