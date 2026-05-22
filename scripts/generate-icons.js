/* Generate the two PWA icons referenced by public/manifest.json from the
   master VineSecretLogo.svg. Run once; commit the output PNGs.
   Sharp is installed via `npm install --no-save sharp` and never persisted. */

const sharp = require('sharp');
const fs = require('node:fs');
const path = require('node:path');

const SRC = path.join(__dirname, '..', 'src', 'assets', 'images', 'VineSecretLogo.svg');
const OUT_DIR = path.join(__dirname, '..', 'public', 'icons');

const sizes = [
    { name: 'icon-192.png', size: 192 },
    { name: 'icon-512.png', size: 512 },
];

async function main() {
    if (!fs.existsSync(SRC)) {
        throw new Error(`Source SVG not found at ${SRC}`);
    }

    const svgBuffer = fs.readFileSync(SRC);

    for (const { name, size } of sizes) {
        const dest = path.join(OUT_DIR, name);
        await sharp(svgBuffer, { density: 384 })
            .resize(size, size, {
                fit: 'contain',
                background: { r: 9, g: 4, b: 13, alpha: 1 },
            })
            .png({ compressionLevel: 9 })
            .toFile(dest);
        const bytes = fs.statSync(dest).size;
        console.log(`  wrote ${name} (${size}x${size}, ${bytes} bytes)`);
    }
}

main().catch((err) => {
    console.error(err);
    process.exit(1);
});
