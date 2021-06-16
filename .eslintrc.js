module.exports = {
    env: { node: true },
    parserOptions: { ecmaVersion: 2021 },
    extends: 'eslint:recommended',
    rules: {
        semi: ['error', 'always'],
        indent: ['error', 4],
    },
};
