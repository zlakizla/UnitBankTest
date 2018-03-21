'use strict'
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
var config = {
    module: {},
};

var libContent = Object.assign({}, config, {
    entry: {
        'index': "./Frontend/index",
    },
    output: {
        path: __dirname + "/Production",
        filename: "[name].js"
    },
    module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2017', 'react']
                }
            }
        ]
    },
    watch: true,
    devtool:"source-map",
     /*plugins: [
        new UglifyJSPlugin({
            compress: {
                warnings: false,
            },
            drop_console: true,
            unsafe: true,
            unused: false
        })
    ]*/
});

var LibReact = Object.assign({}, config, {
    entry: {
        'react': "./Script/react",
    },
    output: {
        path: __dirname + "/Production/Script",
        filename: "[name]-min.js"
    } /*, module: {
        loaders: [
            {
                test: /.jsx?$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['react']
                }
            }
        ]
    }
   , plugins: [
        new UglifyJSPlugin({
            compress: true,
            warnings: false,
            drop_console: true,
            unsafe: true
        })
    ]*/

})

module.exports = [
    libContent//,LibReact
];