import React, { useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import '../assets/css/app.css';
import Header from './header';
import Footer from './footer';
import About from './about';
import Contact from './contact';
import Home from './home';
import Products from './products';
import ProductDetails from './products/product_details';
import Cart from './cart';
import Checkout from './checkout';
import Legal from './legal';
import WineClub from './club';
import NotFound from './notfound';
import { initAnalytics, trackPageView } from '../analytics/tracking';
import BottomNav from './nav/BottomNav';
import AgeGate from './agegate/AgeGate';

const AnalyticsListener = () => {
    const location = useLocation();

    useEffect(() => {
        initAnalytics();
    }, []);

    useEffect(() => {
        trackPageView(location.pathname + location.search);
    }, [location]);

    return null;
};

const App = () => (
    <div className="app">
        <a href="#main-content" className="skip-link">Skip to main content</a>
        <AnalyticsListener />
        <Header />
        <main id="main-content" className="page-shell">
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products/:product_id" element={<ProductDetails />} />
                <Route path="/products" element={<Products />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/legal/:page" element={<Legal />} />
                <Route path="/club" element={<WineClub />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </main>
        <Footer />
        <BottomNav />
        <AgeGate />
    </div>
);

export default App;
