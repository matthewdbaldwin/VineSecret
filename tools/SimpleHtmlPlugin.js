const fs = require('fs');
const path = require('path');

class SimpleHtmlPlugin {
    constructor(options = {}) {
        this.template = options.template;
        this.filename = options.filename || 'index.html';
    }

    apply(compiler) {
        compiler.hooks.emit.tap('SimpleHtmlPlugin', (compilation) => {
            const templatePath = path.resolve(compiler.options.context || process.cwd(), this.template);
            const templateContent = fs.readFileSync(templatePath, 'utf-8');

            const outputPublicPath = (compiler.options.output && compiler.options.output.publicPath) || '';
            const basePath = typeof outputPublicPath === 'string' && outputPublicPath.length > 0
                ? (outputPublicPath.endsWith('/') ? outputPublicPath : `${outputPublicPath}/`)
                : '';

            const scriptTags = [];
            compilation.chunks.forEach((chunk) => {
                chunk.files.forEach((file) => {
                    if (file.endsWith('.js')) {
                        scriptTags.push(`<script src="${basePath}${file}"></script>`);
                    }
                });
            });

            const uniqueScripts = [...new Set(scriptTags)].join('\n    ');
            const injected = templateContent.replace('</body>', `    ${uniqueScripts}\n</body>`);

            compilation.assets[this.filename] = {
                source: () => injected,
                size: () => Buffer.byteLength(injected, 'utf8'),
            };
        });
    }
}

module.exports = SimpleHtmlPlugin;
