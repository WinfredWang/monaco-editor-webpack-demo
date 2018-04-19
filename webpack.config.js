const path = require('path');
const webpack = require('webpack');

module.exports = {
    // mode:"development",
	entry: {
		"app": './index.ts',
		"editor.worker": 'monaco-editor/esm/vs/editor/editor.worker.js',
		"json.worker": 'monaco-editor/esm/vs/language/json/json.worker',
		"css.worker": 'monaco-editor/esm/vs/language/css/css.worker',
		"html.worker": 'monaco-editor/esm/vs/language/html/html.worker',
		"ts.worker": 'monaco-editor/esm/vs/language/typescript/ts.worker',
	},
	output: {
		globalObject: 'self',
		filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: "DS"
	},
	module: {
		rules: [{
			test: /\.css$/,
			use: [ 'style-loader', 'css-loader' ]
		},{
			test: /\.ts$/,
			use: [ 'ts-loader' ]
		}]
	},
	plugins: [
		new webpack.IgnorePlugin(/^((fs)|(path)|(os)|(crypto)|(source-map-support))$/, /vs(\/|\\)language(\/|\\)typescript(\/|\\)lib/)
    ],
    resolve: {
        extensions: [".ts",".js"]
    },
};