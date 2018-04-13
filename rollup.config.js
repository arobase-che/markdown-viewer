import uglify from 'rollup-plugin-uglify'
import builtins from 'rollup-plugin-node-builtins'
import json from 'rollup-plugin-json'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import globals from 'rollup-plugin-node-globals'



export default {
  input: 'tohtml.js',
  output: {
    file: 'public/js/hmd.min.js',
    format: 'iife',
    sourcemap: 'inline',
    name: 'hmd'
  },
  plugins: [
    resolve({
      jsnext: true,
      browser: true,
      main: true,
    }),
    commonjs(),
    builtins(),
    json({
      preferConst: true,
    }),
    globals(),
    uglify(),
  ]
};

