module.exports = {
env: { es2022: true, node: true, browser: true },
parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
extends: [
'eslint:recommended',
// Disables rules that conflict with Prettier formatting
'prettier'
],
rules: {
'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }]
}
}
