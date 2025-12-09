const fs = require('fs');
const path = require('path');

class SimpleHtmlPlugin {
    constructor(options = {}) {
        this.template = options.template;
        this.filename = options.filename || 'index.html';
    }

    apply(compiler) {
        compiler.hooks.emit.tapAsync('SimpleHtmlPlugin', (compilation, callback) => {
            try {
                const templatePath = this.template && path.resolve(compiler.context, this.template);
                const templateContent = templatePath ? fs.readFileSync(templatePath, 'utf8') : '<!doctype html><html><head></head><body><div id="root"></div></body></html>';

                const publicPath = compilation.outputOptions.publicPath || '';
                const scriptTags = [];

                compilation.chunks.forEach((chunk) => {
                    chunk.files.forEach((fileName) => {
                        if (fileName.endsWith('.js')) {
                            scriptTags.push(`<script src="${publicPath}${fileName}"></script>`);
                        }
                    });
                });

                const scriptsMarkup = scriptTags.join('');
                const closingBodyIndex = templateContent.lastIndexOf('</body>');
                const htmlWithScripts = closingBodyIndex !== -1
                    ? `${templateContent.slice(0, closingBodyIndex)}${scriptsMarkup}${templateContent.slice(closingBodyIndex)}`
                    : `${templateContent}${scriptsMarkup}`;

                compilation.assets[this.filename] = {
                    source: () => htmlWithScripts,
                    size: () => Buffer.byteLength(htmlWithScripts, 'utf8'),
                };

                callback();
            } catch (err) {
                callback(err);
            }
        });
    }
}

module.exports = SimpleHtmlPlugin;
