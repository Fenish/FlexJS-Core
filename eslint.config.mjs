// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	...tseslint.configs.stylistic,
	{
		ignores: ['**/node_modules/**', '**/dist/**', '**/test/**'],
	},
	{
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
		},
	}
);
