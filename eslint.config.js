import js from '@eslint/js';
import { defineConfig, globalIgnores } from 'eslint/config';
import prettier from 'eslint-config-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig(
  globalIgnores(['dist/', 'coverage/']),
  js.configs.recommended,
  tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: { allowDefaultProject: ['eslint.config.js'] },
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.js'],
    extends: [tseslint.configs.disableTypeChecked],
  },
  {
    // CLAUDE.md: named exports only.
    files: ['src/**/*.ts'],
    rules: {
      'no-restricted-syntax': [
        'error',
        { selector: 'ExportDefaultDeclaration', message: 'Use named exports only.' },
        { selector: 'ExportSpecifier[exported.name="default"]', message: 'Use named exports only.' },
      ],
    },
  },
  {
    // CLAUDE.md: src/core is pure TypeScript with no engine dependency.
    files: ['src/core/**/*.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { name: 'phaser', message: 'src/core must stay engine-free. Move Phaser code to entities/ or scenes/.' },
          ],
          patterns: [
            {
              group: ['**/scenes/**', '**/entities/**', '**/systems/**', '**/debug/**'],
              message: 'src/core must not depend on the Phaser layer.',
            },
          ],
        },
      ],
    },
  },
  prettier,
);
