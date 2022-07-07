import progress from 'rollup-plugin-progress';
import json from "rollup-plugin-json"
import postcss from 'rollup-plugin-postcss'
import vue from '@vitejs/plugin-vue'
import {
    terser
} from 'rollup-plugin-terser'
import {
    nodeResolve
} from '@rollup/plugin-node-resolve'
import typescript2 from 'rollup-plugin-typescript2'
import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import {
    DEFAULT_EXTENSIONS
} from '@babel/core'
import livereload from 'rollup-plugin-livereload'
import del from "rollup-plugin-delete"

// 判断是不是 生产环境
const isDev = process.env.NODE_ENV !== 'production'


// 初始化配置
const initConfig = () => {


    return {
        input: 'src/monaco-editor/index.ts',
        output: [{
                file: 'dist/monaco-editor.umd.js',
                format: 'umd',
                exports: 'named', // 关闭   Mixing named and default exports  警告
                name: "MonacoEditor",
                globals: {
                    "vue": 'vue',
                    'monaco-editor': 'monaco-editor'
                },
            },
            {
                file: 'dist/monaco-editor.esm.js',
                format: 'esm',
                name: "MonacoEditor",
                globals: {
                    "vue": 'vue',
                    'monaco-editor': 'monaco-editor'
                },
            }
        ],
        plugins: [
            del({
                targets: ['dist', "lib"]
            }),

            nodeResolve({
                mainField: ['jsnext:main', 'browser', 'module', 'main'],
                browser: true,
                // dedupe: ['vue']
            }),

            vue(),

            typescript2({
                // 将根目录的tsconfig.json作为配置文件
                useTsconfigDeclarationDir: true,

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

            // 如果不是开发环境，开启压缩
            !isDev && terser({
                toplevel: true
            }),

            // 热更新
            isDev && livereload(),


            progress({
                clearLine: false // default: true
            })
        ],

        context: "window", //屏蔽 'THIS_IS_UNDEFINED' 警告


        // 屏蔽一些不需要的警告
        // onwarn: function (warning) {
        //     if (warning.code === 'THIS_IS_UNDEFINED' || warning.code === 'CIRCULAR_DEPENDENCY') {
        //         return
        //     }
        //     console.error(`(!) ${warning.message}`)
        // },

        // external: Object.keys(require(path.resolve(__dirname, './package.json')).peerDependencies || {}),
        external: ["monaco-editor", "vue"]
    }
}


export default initConfig()