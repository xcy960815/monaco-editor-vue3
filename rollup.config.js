import path from 'path'
import sourceMaps from 'rollup-plugin-sourcemaps'
// import json from '@rollup/plugin-json'
import json from "rollup-plugin-json"
import postcss from 'rollup-plugin-postcss'
// import vue from '@vitejs/plugin-vue'
import vue from "rollup-plugin-vue"
import {
    terser
} from 'rollup-plugin-terser'
import {
    nodeResolve
} from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import typescript2 from 'rollup-plugin-typescript2'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import {
    DEFAULT_EXTENSIONS
} from '@babel/core'
import replace from '@rollup/plugin-replace'
import livereload from 'rollup-plugin-livereload'
import del from "rollup-plugin-delete"

// 判断是不是 生产环境
const isDev = process.env.NODE_ENV !== 'production'

// packages 文件夹路径
const packagesPath = path.resolve(__dirname, './package.json')

// 初始化配置
const initConfig = () => {
    return {
        input: 'src/monaco-editor/index.ts',
        output: [{
            file: 'dist/monaco-editor.umd.js',
            format: 'umd',
            name: "MonacoEditor",
            globals: {
                "vue": 'vue',
                'monaco-editor': 'monaco-editor'
            },
        }, {
            file: 'dist/monaco-editor.esm.js',
            format: 'esm',
            name: "MonacoEditor",
            globals: {
                "vue": 'vue',
                'monaco-editor': 'monaco-editor'
            },
        }],
        plugins: [
            del({
                targets: ['dist']
            }),
            vue(),
            // typescript({
            //     tsconfig: './tsconfig.json'
            // }),
            typescript2({
                // compilerOptions: {
                //     declaration: true
                // },
                // include: ["src/monaco-editor"],
                rollupCommonJSResolveHack: false,
                tsconfig: "./tsconfig.json"
            }),
            nodeResolve({
                mainField: ['jsnext:main', 'browser', 'module', 'main'],
                browser: true
            }),
            commonjs(),
            json(),
            postcss({
                plugins: [require('autoprefixer')],
                // 把 css 插入到 style 中
                inject: true,
                // 把 css 放到和js同一目录
                // extract: true
                // Minimize CSS, boolean or options for cssnano.
                minimize: !isDev,
                // Enable sourceMap.
                sourceMap: isDev,
                // This plugin will process files ending with these extensions and the extensions supported by custom loaders.
                extensions: ['.sass', '.less', '.scss', '.css']
            }),
            babel({
                skipPreflightCheck: true,
                exclude: 'node_modules/**',
                babelHelpers: 'runtime',
                // babel 默认不支持 ts 需要手动添加
                extensions: [...DEFAULT_EXTENSIONS, '.ts', '.tsx', '.vue']
            }),
            // getBabelOutputPlugin({
            //     configFile: path.resolve(__dirname, 'babel.config.js')
            // }),
            // 如果不是开发环境，开启压缩
            !isDev && terser({
                toplevel: true
            }),
            // 热更新
            isDev && livereload(),
            // 处理 process.env.NODE_ENV 的变量
            replace({
                preventAssignment: true,
                delimiters: ['', ''],
                'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),

            }),
            isDev && sourceMaps()
        ],
        // 屏蔽一些不需要的警告
        onwarn: function (warning) {
            if (warning.code === 'THIS_IS_UNDEFINED' || warning.code === 'CIRCULAR_DEPENDENCY') {
                return
            }
            console.error(`(!) ${warning.message}`)
        },
        // external: {
        //     ...Object.keys(require(packagesPath).peerDependencies || {}),
        //     // ...Object.keys(require(packagesPath).dependencies || {})
        // }
        external: Object.keys(require(packagesPath).peerDependencies || {}),
    }
}


export default initConfig()