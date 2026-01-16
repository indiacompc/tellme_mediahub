import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import unusedImports from 'eslint-plugin-unused-imports';

export default [
	{
		ignores: ['.next/**', 'node_modules/**', 'public/**', '.yarn/**', 'src/client/**']
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	{
		files: ['**/*.{js,jsx,ts,tsx}'],
		languageOptions: {
			ecmaVersion: 'latest',
			sourceType: 'module',
			parserOptions: {
				ecmaFeatures: {
					jsx: true
				}
			}
		},
		plugins: {
			'unused-imports': unusedImports
		},
		rules: {
			'unused-imports/no-unused-imports': 'warn',
			'@typescript-eslint/no-unused-vars': ['warn'],
			'react/react-in-jsx-scope': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
			'no-unused-vars': 'off',
			'sort-imports': [
				'error',
				{
					ignoreCase: true,
					ignoreDeclarationSort: true,
					ignoreMemberSort: false,
					memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
					allowSeparatedGroups: false
				}
			]
		}
	}
];
