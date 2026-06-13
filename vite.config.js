import { defineConfig, transformWithEsbuild } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const nodeModulesPath = resolve(__dirname, 'node_modules');
const require = createRequire(import.meta.url);

/**
 * Less plugin: resolves webpack-style ~pkg imports from node_modules.
 * Used both in css.preprocessorOptions.less and in the esbuild Less compiler.
 */
function createTildePlugin() {
    return {
        install(less, pluginManager) {
            pluginManager.addFileManager(
                new (class extends less.AbstractFileManager {
                    supports(f) { return f.startsWith('~'); }
                    supportsSync(f) { return f.startsWith('~'); }
                    load(filename) {
                        const full = resolve(nodeModulesPath, filename.slice(1));
                        try {
                            return Promise.resolve({ filename: full, contents: readFileSync(full, 'utf-8') });
                        } catch {
                            return Promise.reject(new Error(`Less tilde: '${filename}' not found`));
                        }
                    }
                    loadSync(filename) {
                        const full = resolve(nodeModulesPath, filename.slice(1));
                        return { filename: full, contents: readFileSync(full, 'utf-8') };
                    }
                })()
            );
        },
    };
}

/**
 * esbuild plugin: compiles .less files during dependency pre-bundling.
 * This lets esbuild bundle pro-layout/pro-table CSS once and cache it,
 * instead of Vite dev-serving hundreds of individual Less files on each reload.
 */
function createEsbuildLessPlugin() {
    const less = require('less');
    return {
        name: 'less-to-css',
        setup(build) {
            build.onLoad({ filter: /\.less$/ }, async (args) => {
                try {
                    const result = await less.render(readFileSync(args.path, 'utf-8'), {
                        filename: args.path,
                        paths: [nodeModulesPath, dirname(args.path)],
                        javascriptEnabled: true,
                        plugins: [createTildePlugin()],
                    });
                    return { contents: result.css, loader: 'css' };
                } catch {
                    return { contents: '', loader: 'css' };
                }
            });
        },
    };
}

export default defineConfig({
    plugins: [
        // Parse JSX in .js files (project doesn't use .jsx extension)
        {
            name: 'treat-js-as-jsx',
            enforce: 'pre',
            async transform(code, id) {
                if (!id.match(/resources\/js\/.+\.js$/)) return null;
                return transformWithEsbuild(code, id, { loader: 'jsx' });
            },
        },
        laravel({
            input: [
                'resources/js/client/admin/roots/app.js',
                'resources/js/client/frontend/roots/projects.js',
                'resources/js/client/frontend/roots/error.js',
            ],
            refresh: true,
        }),
        react({ include: '**/*.{js,jsx}' }),
    ],
    resolve: {
        alias: {
            // ESM builds of these packages are missing named exports — use CJS builds
            '@antv/l7-core': join(__dirname, 'node_modules/@antv/l7-core/lib/index.js'),
            '@antv/l7-utils': join(__dirname, 'node_modules/@antv/l7-utils/lib/index.js'),
        },
    },
    optimizeDeps: {
        // Force pre-bundling of pro packages so their Less is compiled once by esbuild
        include: [
            '@ant-design/pro-layout',
            '@ant-design/pro-table',
            '@ant-design/pro-utils',
        ],
        esbuildOptions: {
            loader: { '.js': 'jsx' },
            plugins: [createEsbuildLessPlugin()],
        },
    },
    css: {
        preprocessorOptions: {
            less: {
                javascriptEnabled: true,
                plugins: [createTildePlugin()],
            },
        },
    },
    define: {
        'window.__DEV__': JSON.stringify(process.env.NODE_ENV !== 'production'),
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    },
});
