/**
 * Wine-tasting glossary — terms found in product descriptions get a native
 * popover tooltip with a short definition. Terms are matched case-insensitive
 * against the prose; only the first occurrence of each term per page is
 * wrapped to keep the surface calm.
 */
export const GLOSSARY = {
    tannin: 'Astringent compounds drawn from grape skins, seeds, and stems — the structural backbone of red wine.',
    tannins: 'Astringent compounds drawn from grape skins, seeds, and stems — the structural backbone of red wine.',
    élevage: 'French for "raising" — the aging period between fermentation and bottling, when wine settles, integrates, and finds its voice.',
    lees: 'The yeast cells and grape solids that fall to the bottom of the barrel after fermentation. Wines aged "on lees" gain texture and savory depth.',
    barrique: 'A 225-litre French oak barrel, the standard format for élevage in fine wine.',
    puncheon: 'A larger oak vessel — typically 500 litres — that lets a wine breathe with less direct oak influence than a barrique.',
    puncheons: 'Larger oak vessels — typically 500 litres — that let wine breathe with less direct oak influence than barriques.',
    foudre: 'A very large, old oak vat used for long, gentle aging without imparting fresh oak character.',
    'whole-cluster': 'Pressing or fermenting with whole, intact grape bunches — stems and all — for added structure and aromatic lift.',
    'cold soak': 'Holding crushed red grapes at cellar temperature for one to four days before fermentation begins, to extract color and aromatics gently.',
    'cold soaked': 'Held at cellar temperature for one to four days before fermentation, extracting color and aromatics gently.',
    'native ferment': 'Fermentation driven by the wild yeasts already present on the grapes and in the cellar, rather than commercial strains.',
    'native fermentations': 'Fermentations driven by wild yeasts already present on the grapes and in the cellar.',
    destemmed: 'Mechanically separated from the stems before fermentation, for a softer, fruit-forward profile.',
    racking: 'Moving wine from one vessel to another, leaving the lees behind. A clarifying step done multiple times during élevage.',
    terroir: 'The total expression of a place — soil, climate, slope, microorganisms — captured in the wine.',
    'mid-palate': 'The middle phase of a wine on the tongue, between first impression and finish — where weight and texture register.',
    finish: 'The taste a wine leaves after swallowing. A long finish is the hallmark of a great bottle.',
    cuvée: 'A specific blend or batch of wine, often a winemaker\'s signature lot.',
    coulis: 'A smooth fruit purée — used here as a tasting-note metaphor for concentrated, glossy fruit character.',
};

/**
 * Build a list of children that wraps the first case-insensitive occurrence
 * of each glossary term in a <button popovertarget=...>. Subsequent
 * occurrences are emitted as plain text. The matching popover <div> elements
 * are returned alongside so the caller can render them in the DOM.
 */
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const proseWithGlossary = (text) => {
    if (!text) return { nodes: [], popovers: [] };

    const terms = Object.keys(GLOSSARY).sort((a, b) => b.length - a.length);
    const re = new RegExp(`\\b(${terms.map(escapeRegex).join('|')})\\b`, 'i');

    const seen = new Map(); // term -> popoverId
    const popovers = [];
    const nodes = [];

    let remaining = text;
    let nodeKey = 0;

    while (remaining.length) {
        const m = remaining.match(re);
        if (!m) {
            nodes.push(remaining);
            break;
        }

        const idx = m.index;
        const matched = m[0];
        const lookupKey = matched.toLowerCase();

        if (idx > 0) nodes.push(remaining.slice(0, idx));

        if (seen.has(lookupKey)) {
            // already wrapped earlier — emit as plain text
            nodes.push(matched);
        } else {
            const popoverId = `g-${lookupKey.replace(/[^a-z0-9]/g, '-')}`;
            const anchorName = `--anchor-${popoverId}`;
            seen.set(lookupKey, popoverId);

            nodes.push({
                type: 'glossary',
                key: nodeKey++,
                term: matched,
                popoverId,
                anchorName,
            });

            popovers.push({
                popoverId,
                anchorName,
                term: matched,
                definition: GLOSSARY[lookupKey],
            });
        }

        remaining = remaining.slice(idx + matched.length);
    }

    return { nodes, popovers };
};
