import { defineConfig } from 'vite-plus'

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
  fmt: {
    arrowParens: 'always',
    bracketSpacing: true,
    embeddedLanguageFormatting: 'auto',
    htmlWhitespaceSensitivity: 'css',
    insertPragma: false,
    jsxSingleQuote: true,
    bracketSameLine: true,
    printWidth: 120,
    proseWrap: 'preserve',
    quoteProps: 'as-needed',
    requirePragma: false,
    semi: false,
    singleQuote: true,
    tabWidth: 2,
    trailingComma: 'all',
    useTabs: false,
    vueIndentScriptAndStyle: false,
    sortPackageJson: false,
    ignorePatterns: ['build/*', 'dist/*', 'public/*', '.next/*', 'node_modules/*', 'package.json', '*.log'],
  },
})
