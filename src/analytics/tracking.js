const fallbackId = 'G-DXQG8V0F15';
const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID || fallbackId;

let initialized = false;

const hasWindow = () => typeof window !== 'undefined';

export const initAnalytics = () => {
    if (!hasWindow() || initialized || !measurementId) return;

    window.dataLayer = window.dataLayer || [];
    window.gtag =
        window.gtag ||
        function gtag() {
            window.dataLayer.push(arguments);
        };

    const scriptId = `ga-gtag-${measurementId}`;
    const existingScript = document.getElementById(scriptId);

    if (!existingScript) {
        const script = document.createElement('script');
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`;
        script.id = scriptId;
        document.head.appendChild(script);
    }

    window.gtag('js', new Date());
    window.gtag('config', measurementId, { send_page_view: false });
    initialized = true;
};

const ensureAnalytics = () => {
    if (!measurementId || !hasWindow()) return false;
    if (!initialized) initAnalytics();
    return typeof window.gtag === 'function';
};

const formatItems = (items = []) =>
    items.map((item) => ({
        item_id: item.id ?? item.item_id ?? item.sku,
        item_name: item.name ?? item.item_name,
        item_category: item.category ?? item.collection,
        price: item.cost ?? item.price ?? item.lineTotal,
        quantity: item.quantity ?? 1,
    }));

const sendEvent = (name, params = {}) => {
    if (!ensureAnalytics()) return;
    window.gtag('event', name, { ...params, send_to: measurementId });
};

export const trackPageView = (path) => {
    if (!hasWindow()) return;
    sendEvent('page_view', {
        page_path: path,
        page_location: window.location.href,
        page_title: document.title,
    });
};

export const trackEngagement = (label, context = '') =>
    sendEvent('engagement', {
        event_label: label,
        content_type: context,
    });

export const trackEmailClick = (label, email) =>
    sendEvent('select_content', {
        event_label: label,
        content_type: 'email',
        destination: email,
    });

export const trackProductView = (product) =>
    sendEvent('view_item', {
        items: formatItems([product]),
    });

export const trackAddToCart = (product, quantity = 1) =>
    sendEvent('add_to_cart', {
        items: formatItems([{ ...product, quantity }]),
        currency: 'USD',
        value: (product?.cost || 0) * quantity,
    });

export const trackCartUpdate = (item, quantity, action = 'update') =>
    sendEvent('cart_update', {
        action,
        items: formatItems([{ ...item, quantity }]),
        value: (item?.cost || 0) * quantity,
        currency: 'USD',
    });

export const trackCartView = (cart) =>
    sendEvent('view_cart', {
        currency: 'USD',
        value: cart?.total?.grandTotal,
        items: formatItems(cart?.items),
    });

export const trackBeginCheckout = (cart, stage = 'cart_cta') =>
    sendEvent('begin_checkout', {
        currency: 'USD',
        value: cart?.total?.grandTotal,
        items: formatItems(cart?.items),
        checkout_step: stage,
    });

export const trackCheckoutStep = (stepName, cart) =>
    sendEvent('checkout_progress', {
        checkout_step: stepName,
        currency: 'USD',
        value: cart?.total?.grandTotal,
        items: formatItems(cart?.items),
    });

export const trackPurchase = (order) =>
    sendEvent('purchase', {
        transaction_id: order?.orderId,
        currency: 'USD',
        value: order?.cart?.total?.grandTotal,
        items: formatItems(order?.cart?.items),
        affiliation: 'Guest checkout',
    });

export const trackContactMessage = (details) =>
    sendEvent('generate_lead', {
        form_name: 'contact',
        event_label: details?.subject || 'Contact form',
        engagement_time_msec: 1000,
    });
