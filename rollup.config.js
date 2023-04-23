import resolve from '@rollup/plugin-node-resolve';
import commonJs from '@rollup/plugin-commonjs';
import postCss from 'rollup-plugin-postcss';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import dts from 'rollup-plugin-dts';

import pkg from './package.json' assert { type: 'json' };
const { name, homepage, version, dependencies, peerDependencies } = pkg;

const umdConf = {
  format: 'umd',
  name: 'HilbertChart',
  strict: false, // heatmap.js not strict
  banner: `// Version ${version} ${name} - ${homepage}`
};

export default [
  {
    input: 'src/index.js',
    output: [
      { // umd
        ...umdConf,
        file: `docs/dist/${name}.js`,
        sourcemap: true,
      },
      { // minify
        ...umdConf,
        file: `docs/dist/${name}.min.js`,
        plugins: [terser({
          output: { comments: '/Version/' }
        })]
      }
    ],
    plugins: [
      postCss(),
      babel({ exclude: 'node_modules/**' }),
      resolve(),
      commonJs()
    ]
  },
  { // ES module
    input: 'src/index.js',
    output: [
      {
        format: 'es',
        strict: false,
        file: `docs/dist/${name}.mjs`
      }
    ],
    external: [...Object.keys(dependencies || {}), ...Object.keys(peerDependencies || {})],
    plugins: [
      postCss(),
      babel()
    ]
  },
  { // expose TS declarations
    input: 'src/index.d.ts',
    output: [{
      file: `docs/dist/${name}.d.ts`,
      format: 'es'
    }],
    plugins: [dts()]
  },
  {
    input: 'src/d3-hilbert.js',
    output: [
      {
        format: 'es',
        name: 'D3Hilbert',
        strict: false,
        sourcemap: true,
        file: `docs/dist/d3-hilbert.js`
      }
    ],
    plugins: [
      postCss(),
      babel({ exclude: 'node_modules/**' }),
      resolve(),
      commonJs()
    ]
  }
];
