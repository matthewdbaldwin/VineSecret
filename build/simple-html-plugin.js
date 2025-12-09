const { readFileSync } = require('fs');
const { dirname, resolve } = require('path');

class SimpleHtmlPlugin {
    constructor(options = {}) {
        this.template = options.template;
        this.filename = options.filename || 'index.html';
    }

    apply(compiler) {
        compiler.hooks.emit.tapAsync('SimpleHtmlPlugin', (compilation, callback) => {
            try {
                const templatePath = resolve(compiler.options.context || dirname(this.template), this.template);
                const templateContent = readFileSync(templatePath, 'utf8');

                const { scripts, styles } = this.collectAssets(compilation);
                const html = this.injectAssets(templateContent, scripts, styles);

                compilation.assets[this.filename] = {
                    source: () => html,
                    size: () => html.length,
                };
            } catch (err) {
                compilation.errors.push(err);
            }
            callback();
        });
    }

    collectAssets(compilation) {
        const scripts = [];
        const styles = [];

        compilation.entrypoints.forEach((entrypoint) => {
            entrypoint.chunks.forEach((chunk) => {
                chunk.files.forEach((file) => {
                    if (file.endsWith('.js')) {
                        scripts.push(file);
                    }
                    if (file.endsWith('.css')) {
                        styles.push(file);
                    }
                });
            });
        });

        return { scripts, styles };
    }

    injectAssets(template, scripts, styles) {
        const styleTags = styles.map((href) => `<link rel="stylesheet" href="/${href}">`).join('\n');
        const scriptTags = scripts.map((src) => `<script src="/${src}"></script>`).join('\n');

        const withStyles = template.replace('</head>', `${styleTags}\n</head>`);
        return withStyles.replace('</body>', `${scriptTags}\n</body>`);
    }
}

module.exports = SimpleHtmlPlugin;
