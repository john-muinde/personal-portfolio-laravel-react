const mix = require("laravel-mix");
const ESLintPlugin = require("eslint-webpack-plugin");
const webpack = require("webpack");

mix.disableNotifications();

mix.webpackConfig({
    module: {
        rules: [
            {
                test: /\.less$/,
                loader: "less-loader",
                options: {
                    lessOptions: {
                        javascriptEnabled: true,
                    },
                },
            },
        ],
    },
    plugins: [
        new ESLintPlugin({
            extensions: [`js`, `jsx`],
            exclude: ["node_modules"],
        }),
        // Add the DefinePlugin configuration here
        new webpack.DefinePlugin({
            "window.__DEV__": !mix.inProduction(),
            // Also define process.env.NODE_ENV for broader compatibility
            "process.env.NODE_ENV": JSON.stringify(
                mix.inProduction() ? "production" : "development"
            ),
        }),
    ],
});

mix.js("resources/js/client/admin/roots/app.js", "public/js/client/admin/roots")
    .js(
        "resources/js/client/frontend/roots/projects.js",
        "public/js/client/frontend/roots/projects.js"
    )
    .js(
        "resources/js/client/frontend/roots/error.js",
        "public/js/client/frontend/roots/error.js"
    )
    .react();

if (mix.inProduction()) {
    mix.version();
}
