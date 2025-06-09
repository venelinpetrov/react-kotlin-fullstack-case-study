import js from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettier from 'eslint-config-prettier'
import prettierPlugin from 'eslint-plugin-prettier'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'

export default tseslint.config(
	{
		ignores: ['dist/**', 'node_modules/**', '*.d.ts']
	},
	js.configs.recommended,
	...tseslint.configs.recommended,
	prettier,
	{
		files: ['**/*.ts', '**/*.tsx'],
		plugins: {
			prettier: prettierPlugin,
			react,
			'react-hooks': reactHooks,
		},
		rules: {
			'@typescript-eslint/no-unused-vars': 'error',
			'prettier/prettier': 'error',
			// React rules
			'react/react-in-jsx-scope': 'off', // Not needed in React 17+
			'react/prop-types': 'off', // Using TypeScript instead
			// React Hooks rules
			'react-hooks/rules-of-hooks': 'error',
			'react-hooks/exhaustive-deps': 'warn',
		},
		settings: {
			react: {
				version: 'detect',
			},
		},
	}
)