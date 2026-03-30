import React, { useEffect } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';
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
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/products/:product_id" component={ProductDetails} />
                <Route path="/products" exact component={Products} />
                <Route path="/checkout" component={Checkout} />
                <Route path="/cart" component={Cart} />
                <Route path="/about" component={About} />
                <Route path="/contact" component={Contact} />
                <Route path="/legal/:page" component={Legal} />
                <Route path="/club" component={WineClub} />
                <Route component={NotFound} />
            </Switch>
        </main>
        <Footer />
        <BottomNav />
        <AgeGate />
    </div>
);

export default App;
