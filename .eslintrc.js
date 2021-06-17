module.exports = {
    env: { node: true },
    parserOptions: { ecmaVersion: 'es-next' },
    extends: 'eslint:recommended',
    rules: {
        semi: ['error', 'always'],
        indent: ['error', 4],
    },
};
