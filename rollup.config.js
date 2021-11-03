import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import pkg from './package.json';
import size from 'rollup-plugin-bundle-size';

export default {
    input: './src/index.js',
    output: {
      file: pkg.main,
      format: 'cjs',
      name: 'sveltefire'
    },
    external: [
      'svelte',
      'svelte/store',
      'firebase',
      'firebase/app',
      'firebase/auth',
      'firebase/database',
      'firebase/firestore',
      'firebase/storage',
      'firebase/analytics',
      'firebase/performance',
    ],
    plugins: [
      svelte(),
      resolve(),
      size()
    ]
};
