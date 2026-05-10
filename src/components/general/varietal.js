/**
 * Map a product's `type` field (e.g. "Pinot Noir", "GSM Blend") to a
 * varietal slug used as `data-varietal="..."` for palette switching.
 */
export const varietalSlug = (type) => {
    if (!type) return null;
    return type
        .toLowerCase()
        .replace(/é/g, 'e')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
};

/**
 * View transition name for a product's bottle image — paired between the
 * product card and the product detail page so the browser morphs the
 * shared element across the route change.
 */
export const bottleTransitionName = (productId) => `bottle-${productId}`;
