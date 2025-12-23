import React, { useEffect } from 'react';
import { Redirect, Route, Switch, useLocation } from 'react-router-dom';
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
import { initAnalytics, trackPageView } from '../analytics/tracking';

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
        <AnalyticsListener />
        <Header />
        <main className="page-shell">
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/products/:product_id" component={ProductDetails} />
                <Route path="/products" exact component={Products} />
                <Route path="/checkout" component={Checkout} />
                <Route path="/cart" component={Cart} />
                <Route path="/about" component={About} />
                <Route path="/contact" component={Contact} />
                <Redirect to="/" />
            </Switch>
        </main>
        <Footer />
    </div>
);

export default App;
