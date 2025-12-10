import sonomaChardonnay from "../assets/images/bottles/Sonoma_Coast_Chardonnay.svg";
import russianRiverPinot from "../assets/images/bottles/Russian_River_Pinot_Noir.svg";
import atlasCabernet from "../assets/images/bottles/Atlas_Peak_Cabernet_Sauvignon.svg";
import mendocinoSauvBlanc from "../assets/images/bottles/Mendocino_Sauvignon_Blanc.svg";
import pasoGsm from "../assets/images/bottles/Paso_Robles_GSM.svg";
import santaCruzSyrah from "../assets/images/bottles/Santa_Cruz_Mountains_Syrah.svg";
import andersonRose from "../assets/images/bottles/Anderson_Valley_Rose.svg";
import sierraViognier from "../assets/images/bottles/Sierra_Foothills_Viognier.svg";

export const products = [
    {
        id: "sonoma-coast-chardonnay-2021",
        name: "Sonoma Coast Chardonnay",
        type: "Chardonnay",
        caption: "Meyer lemon, sea spray, and almond blossom from fog-laden slopes.",
        description:
            "Wine type: Chardonnay. Whole-cluster pressed and fermented in neutral French oak for nine months. Bright orchard fruit rides a saline backbone with chamomile and a lemon curd finish.",
        cost: 5200,
        thumbnail: { url: sonomaChardonnay },
        image: { url: sonomaChardonnay },
    },
    {
        id: "russian-river-pinot-2020",
        name: "Russian River Pinot Noir",
        type: "Pinot Noir",
        caption: "Silken red fruit layered with rose petals and baking spice.",
        description:
            "Wine type: Pinot Noir. Destemmed berries cold soaked for 48 hours before a slow native ferment. Raspberry coulis, pomegranate, cedar shavings, and clove build across a supple palate with fine-grained tannins.",
        cost: 6800,
        thumbnail: { url: russianRiverPinot },
        image: { url: russianRiverPinot },
    },
    {
        id: "atlas-peak-cabernet-2019",
        name: "Atlas Peak Cabernet Sauvignon",
        type: "Cabernet Sauvignon",
        caption: "Blackberry, graphite, and tobacco from rocky benchland blocks.",
        description:
            "Wine type: Cabernet Sauvignon. Aged 20 months in neutral barrique. Dense cassis and plum meet violets, pencil lead, and cocoa nib with a long finish framed by gravelly tannins.",
        cost: 9200,
        thumbnail: { url: atlasCabernet },
        image: { url: atlasCabernet },
    },
    {
        id: "mendocino-sauvignon-2022",
        name: "Mendocino Sauvignon Blanc",
        type: "Sauvignon Blanc",
        caption: "White peach, lime leaf, and wet slate with electric lift.",
        description:
            "Wine type: Sauvignon Blanc. Pressed to stainless and held on fine lees for four months. Notes of yuzu, jasmine, and passion fruit orbit a nervy mineral core—perfect for chilled evenings on the coast.",
        cost: 3800,
        thumbnail: { url: mendocinoSauvBlanc },
        image: { url: mendocinoSauvBlanc },
    },
    {
        id: "paso-robles-gsm-2021",
        name: "Paso Robles GSM",
        type: "GSM Blend",
        caption: "Crushed berries, lavender, and cracked pepper in a sun-warmed blend.",
        description:
            "Wine type: GSM blend. Grenache leads with juicy red fruit while Syrah and Mourvèdre add spice, olive tapenade, and savory herbs. Fermented in concrete and raised in large-format casks for lift.",
        cost: 5600,
        thumbnail: { url: pasoGsm },
        image: { url: pasoGsm },
    },
    {
        id: "santa-cruz-syrah-2021",
        name: "Santa Cruz Mountains Syrah",
        type: "Syrah",
        caption: "Blueberry, black olive, and white pepper from windswept ridgelines.",
        description:
            "Wine type: Syrah. Co-fermented with a whisper of Viognier for lifted florals. Smoked meat, cracked pepper, and blue fruit ride a savory mid-palate with a fresh, coastal finish.",
        cost: 6100,
        thumbnail: { url: santaCruzSyrah },
        image: { url: santaCruzSyrah },
    },
    {
        id: "anderson-valley-rose-2022",
        name: "Anderson Valley Rosé",
        type: "Rosé",
        caption: "Wild strawberry, rhubarb, and sea breeze in a pale salmon hue.",
        description:
            "Wine type: Rosé. Direct-press Pinot Noir fermented cool in stainless. Crisp acidity frames watermelon rind, citrus zest, and alpine herbs—built for picnics and porch sipping.",
        cost: 3200,
        thumbnail: { url: andersonRose },
        image: { url: andersonRose },
    },
    {
        id: "sierra-foothills-viognier-2022",
        name: "Sierra Foothills Viognier",
        type: "Viognier",
        caption: "Apricot, honeysuckle, and ginger with a lifted mineral finish.",
        description:
            "Wine type: Viognier. Hand-picked at dawn and fermented with partial skin contact. Apricot preserve, lemon blossom, and candied ginger glide across a textured palate balanced by mountain acidity.",
        cost: 4500,
        thumbnail: { url: sierraViognier },
        image: { url: sierraViognier },
    },
];

export const findProductById = (productId) => products.find((product) => String(product.id) === String(productId));
