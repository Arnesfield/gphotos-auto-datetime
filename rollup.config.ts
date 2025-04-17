import _eslint from '@rollup/plugin-eslint';
import _typescript from '@rollup/plugin-typescript';
import { PluginImpl, RollupOptions } from 'rollup';
import cleanup from 'rollup-plugin-cleanup';
import _esbuild, {
  Options as RollupPluginEsbuildOptions
} from 'rollup-plugin-esbuild';
import outputSize from 'rollup-plugin-output-size';
import pkg from './package.json' with { type: 'json' };
import { NAME } from './src/constants.js';

// NOTE: remove once import errors are fixed for their respective packages
const esbuild = _esbuild as unknown as PluginImpl<RollupPluginEsbuildOptions>;
const eslint = _eslint as unknown as typeof _eslint.default;
const typescript = _typescript as unknown as typeof _typescript.default;

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

function defineConfig(options: (false | RollupOptions)[]) {
  return options.filter((options): options is RollupOptions => !!options);
}

export default defineConfig([
  {
    input,
    output: { file: pkg.module, name: NAME, format: 'iife' },
    plugins: [build(), clean(), outputSize()]
  },
  {
    input,
    output: { file: pkg.unpkg, name: NAME, format: 'iife' },
    plugins: [build({ minify: true }), clean(), outputSize()]
  },
  WATCH && {
    input,
    watch: { skipWrite: true },
    plugins: [eslint(), typescript()]
  }
]);
