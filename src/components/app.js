import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import '../assets/css/app.css';
import Header from './header';
import Footer from './footer';
import About from './about';
import Contact from './contact';
import Home from './home';
import Products from './products';

const App = () => (
    <div className="app">
        <Header />
        <main className="page-shell">
            <Switch>
                <Route path="/" exact component={Home} />
                <Route path="/products" exact component={Products} />
                <Route path="/about" component={About} />
                <Route path="/contact" component={Contact} />
                <Redirect to="/" />
            </Switch>
        </main>
        <Footer />
    </div>
);

export default App;
