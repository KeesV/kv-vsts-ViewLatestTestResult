var path = require("path");
var webpack = require("webpack");
var CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = {
    target: "web",
    mode: "production",
    entry: {
        app: "./src/app.tsx"
    },
    output: {
        filename: "src/[name].js",
        libraryTarget: "amd"
    },
    externals: [
        /^VSS\/.*/, /^TFS\/.*/, /^q$/
    ],
    resolve: {
        extensions: [
            ".webpack.js",
            ".web.js",
            ".ts",
            ".tsx",
            ".js"]
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /(node_modules)/                
            },
            {
                test: /\.s?css$/,
                loaders: ["style-loader", "css-loader", "sass-loader"],
                exclude: /(node_modules)/
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: "./src/*.html", to: "./" },
            { from: "./libs", to: "libs" },
            { from: "./marketplace", to: "marketplace" },
            { from: "./vss-extension.json", to: "vss-extension.json" },
            { from: "./doc", to: "doc" }
        ])
    ]
}