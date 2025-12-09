export const products = [
    {
        id: "sonoma-coast-chardonnay-2021",
        name: "2021 Sonoma Coast Chardonnay",
        caption: "Meyer lemon, sea spray, and almond blossom from fog-laden slopes.",
        description:
            "Whole-cluster pressed and fermented in neutral French oak for nine months. Bright orchard fruit rides a saline backbone with crushed stone, chamomile tea, and a hint of lemon curd on the finish.",
        cost: 5200,
        thumbnail: {
            url: "https://images.unsplash.com/photo-1611079878371-9470701aa77b?auto=format&fit=crop&w=900&q=80",
        },
        image: {
            url: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=1200&q=80",
        },
    },
    {
        id: "russian-river-pinot-2020",
        name: "2020 Russian River Pinot Noir",
        caption: "Silken red fruit layered with rose petals and baking spice.",
        description:
            "Destemmed berries cold soaked for 48 hours before a slow native ferment. Raspberry coulis, pomegranate, cedar shavings, and clove build across a supple palate with fine-grained tannins.",
        cost: 6800,
        thumbnail: {
            url: "https://images.unsplash.com/photo-1547516508-4c1f00681a3b?auto=format&fit=crop&w=900&q=80",
        },
        image: {
            url: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=1200&q=80",
        },
    },
    {
        id: "napa-cabernet-2019",
        name: "2019 Napa Valley Cabernet Sauvignon",
        caption: "Blackberry, graphite, and tobacco from rocky benchland blocks.",
        description:
            "Aged 20 months in neutral barrique. Dense cassis and plum meet violets, pencil lead, and cocoa nib with a long finish framed by gravelly tannins and vibrant acidity.",
        cost: 9200,
        thumbnail: {
            url: "https://images.unsplash.com/photo-1510626176961-4b37d0b4e904?auto=format&fit=crop&w=900&q=80",
        },
        image: {
            url: "https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=1200&q=80",
        },
    },
    {
        id: "mendocino-sauvignon-2022",
        name: "2022 Mendocino Sauvignon Blanc",
        caption: "White peach, lime leaf, and wet slate with electric lift.",
        description:
            "Pressed to stainless and held on fine lees for four months. Notes of yuzu, jasmine, and passion fruit orbit a nervy mineral core—perfect for chilled evenings on the coast.",
        cost: 3800,
        thumbnail: {
            url: "https://images.unsplash.com/photo-1616690710400-a16d146927c3?auto=format&fit=crop&w=900&q=80",
        },
        image: {
            url: "https://images.unsplash.com/photo-1611079489358-0a2fd06d7a18?auto=format&fit=crop&w=1200&q=80",
        },
    },
    {
        id: "paso-robles-gsm-2021",
        name: "2021 Paso Robles GSM",
        caption: "Crushed berries, lavender, and cracked pepper in a sun-warmed blend.",
        description:
            "Grenache leads with juicy red fruit while Syrah and Mourvèdre add spice, olive tapenade, and savory herbs. Fermented in concrete and raised in large-format casks for lift.",
        cost: 5600,
        thumbnail: {
            url: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=900&q=80",
        },
        image: {
            url: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&w=1200&q=80",
        },
    },
    {
        id: "santa-cruz-syrah-2021",
        name: "2021 Santa Cruz Mountains Syrah",
        caption: "Blueberry, black olive, and white pepper from windswept ridgelines.",
        description:
            "Co-fermented with a whisper of Viognier for lifted florals. Smoked meat, cracked pepper, and blue fruit ride a savory mid-palate with a fresh, coastal finish.",
        cost: 6100,
        thumbnail: {
            url: "https://images.unsplash.com/photo-1516594915697-87eb3b1c6b99?auto=format&fit=crop&w=900&q=80",
        },
        image: {
            url: "https://images.unsplash.com/photo-1516594915697-87eb3b1c6b99?auto=format&fit=crop&w=1200&q=80",
        },
    },
    {
        id: "anderson-valley-rose-2022",
        name: "2022 Anderson Valley Rosé",
        caption: "Wild strawberry, rhubarb, and sea breeze in a pale salmon hue.",
        description:
            "Direct-press Pinot Noir fermented cool in stainless. Crisp acidity frames watermelon rind, citrus zest, and alpine herbs—built for picnics and porch sipping.",
        cost: 3200,
        thumbnail: {
            url: "https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?auto=format&fit=crop&w=900&q=80",
        },
        image: {
            url: "https://images.unsplash.com/photo-1506377295352-e3154d43ea9e?auto=format&fit=crop&w=1200&q=80",
        },
    },
    {
        id: "sierra-foothills-viognier-2022",
        name: "2022 Sierra Foothills Viognier",
        caption: "Apricot, honeysuckle, and ginger with a lifted mineral finish.",
        description:
            "Hand-picked at dawn and fermented with partial skin contact. Apricot preserve, lemon blossom, and candied ginger glide across a textured palate balanced by mountain acidity.",
        cost: 4500,
        thumbnail: {
            url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
        },
        image: {
            url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
        },
    },
];

export const findProductById = (productId) => products.find((product) => String(product.id) === String(productId));
