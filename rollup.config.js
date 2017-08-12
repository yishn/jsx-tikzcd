import babel from 'rollup-plugin-babel'

export default {
    entry: './src/index.js',
    format: 'cjs',
    plugins: [babel({plugins: ['external-helpers']})],
    dest: './dist/react-tikzcd.js',
    sourceMap: true
}
