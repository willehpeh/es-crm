import nx from '@nx/eslint-plugin';

export default [
  ...nx.configs['flat/base'],
  ...nx.configs['flat/typescript'],
  ...nx.configs['flat/javascript'],
  {
    ignores: [
      '**/dist',
      '**/vite.config.*.timestamp*',
      '**/vitest.config.*.timestamp*',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: ['^.*/eslint(\\.base)?\\.config\\.[cm]?[jt]s$'],
          depConstraints: [
            {
              sourceTag: 'scope:domain',
              onlyDependOnLibsWithTags: [
                'scope:domain'
              ],
            },
            {
              sourceTag: 'scope:application',
              onlyDependOnLibsWithTags: [
                'scope:application',
                'scope:domain',
              ],
            },
            {
              sourceTag: 'scope:infrastructure',
              onlyDependOnLibsWithTags: [
                'scope:infrastructure',
                'scope:application',
                'scope:domain',
              ],
            },
            {
              sourceTag: 'scope:testing',
              onlyDependOnLibsWithTags: [
                'scope:testing',
                'scope:application',
                'scope:domain',
                'scope:infrastructure',
              ]
            },
            {
              sourceTag: 'scope:api',
              onlyDependOnLibsWithTags: [
                'scope:api',
                'scope:application',
                'scope:infrastructure',
                'scope:domain',
              ]
            },
            {
              sourceTag: 'scope:frontend',
              onlyDependOnLibsWithTags: [
                'scope:frontend',
              ]
            }
          ],
        },
      ],
    },
  },
  {
    files: [
      '**/*.ts',
      '**/*.tsx',
      '**/*.cts',
      '**/*.mts',
      '**/*.js',
      '**/*.jsx',
      '**/*.cjs',
      '**/*.mjs',
    ],
    // Override or add rules here
    rules: {},
  },
];
