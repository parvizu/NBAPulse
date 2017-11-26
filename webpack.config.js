var path = require('path');
var ROOT_PATH = path.resolve(__dirname);

module.exports = {
	entry: [ROOT_PATH +'/src/index.js'],

	output: {
		filename: "bundle.js",
		path: ROOT_PATH + '/lib/'
	},

	module: {
		loaders: [
			{
				test: /\.js$|\.jsx$/,
				include: __dirname + '/src/',
				loader: "babel-loader",
				exclude: /node_modules/
			},
			{
		        test: /\.scss$|\.css$/,
		        loaders: ["style-loader", "css-loader"]
		    },
		    {
	          test: /\.woff2?$|\.ttf$|\.eot$|\.otf$|\.jpg$|\.png$|\.svg$/,
	          loader: 'file-loader?name=[name].[ext]'
	        },
	        {
				test: /\.json$/,
				loader: "json-loader",
				exclude: /(\/samples)/,
	        },
		]
	},
	resolve: {
		extensions: ['.js', '.jsx'],
  	},

	// https://webpack.github.io/docs/configuration.html#devtool
    devtool: 'eval-source-map'
    // devtool: 'inline-source-map'
}
