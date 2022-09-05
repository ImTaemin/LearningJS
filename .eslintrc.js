module.exports = {
    "env": {
        "browser": true,
        "es2020": true,
    },
    "extends": "eslint:recommended",
    "overrides": [
    ],
    "parserOptions": {
        "ecmaVersion": 2020,
        "sourceType": "module",
    },
    "rules": {
        "comma-dangle": [
            2,
            "always-multiline",
        ],
        "indent": [
            2,
            4,
        ],
    },
}
