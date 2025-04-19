import eslint from '@rollup/plugin-eslint';
import json from '@rollup/plugin-json';
import typescript from '@rollup/plugin-typescript';
import { RollupOptions } from 'rollup';
import cleanup from 'rollup-plugin-cleanup';
import esbuild, {
  Options as RollupPluginEsbuildOptions
} from 'rollup-plugin-esbuild';
import outputSize from 'rollup-plugin-output-size';
import pkg from './package.json' with { type: 'json' };
import { NAME } from './src/constants';

// const PROD = process.env.NODE_ENV !== 'development';
const WATCH = process.env.ROLLUP_WATCH === 'true';
const input = 'src/index.ts';

function build(options: RollupPluginEsbuildOptions = {}) {
  return esbuild({ target: 'esnext', ...options });
}

function clean() {
  return cleanup({
    comments: ['some', 'sources', /__PURE__/],
    extensions: ['js', 'ts']
  });
}

function size() {
  return outputSize({ bytes: true });
}

function defineConfig(options: (false | RollupOptions)[]) {
  return options.filter((options): options is RollupOptions => !!options);
}

export default defineConfig([
  {
    input,
    output: { file: pkg.module, name: NAME, format: 'iife' },
    plugins: [build(), json(), clean(), size()]
  },
  {
    input,
    output: { file: pkg.unpkg, name: NAME, format: 'iife' },
    plugins: [build({ minify: true }), json(), clean(), size()]
  },
  WATCH && {
    input,
    watch: { skipWrite: true },
    plugins: [eslint(), typescript(), json()]
  }
]);
