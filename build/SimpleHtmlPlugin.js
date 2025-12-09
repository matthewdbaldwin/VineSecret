const fs = require('fs');
const path = require('path');

class SimpleHtmlPlugin {
    constructor(options = {}) {
        this.options = options;
    }

    apply(compiler) {
        compiler.hooks.emit.tapAsync('SimpleHtmlPlugin', (compilation, callback) => {
            const templatePath = this.options.template;
            let html = '<!doctype html><html><head><meta charset="UTF-8"><title>App</title></head><body><div id="root"></div></body></html>';

            if (templatePath) {
                const resolvedTemplate = path.isAbsolute(templatePath)
                    ? templatePath
                    : path.resolve(compiler.options.context || process.cwd(), templatePath);
                html = fs.readFileSync(resolvedTemplate, 'utf8');
            }

            const publicPath = (compilation.outputOptions.publicPath || '/').replace(/\/?$/, '/');
            const assetsByChunkName = compilation.getStats().toJson({ assets: true }).assetsByChunkName || {};
            const scriptAssets = Object.values(assetsByChunkName)
                .flat()
                .filter(Boolean)
                .filter((assetName) => assetName.endsWith('.js'));

            const scriptTags = scriptAssets
                .map((assetName) => `<script src="${publicPath}${assetName}"></script>`)
                .join('');

            const closingBody = '</body>';
            const outputHtml = html.includes(closingBody)
                ? html.replace(closingBody, `${scriptTags}${closingBody}`)
                : `${html}${scriptTags}`;

            const filename = this.options.filename || 'index.html';
            compilation.assets[filename] = {
                source: () => outputHtml,
                size: () => Buffer.byteLength(outputHtml, 'utf8'),
            };

            callback();
        });
    }
}

module.exports = SimpleHtmlPlugin;
