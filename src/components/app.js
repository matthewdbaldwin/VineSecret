import React from 'react';
import { Route } from 'react-router-dom';
import '../assets/css/app.scss';
import Header from './header';
import Footer from './footer';
import About from './about';
import Contact from './contact';
import Home from './home';
import Products from './products';

const App = () => (
    <div className="app">
        <div className="container">
            <div className="row">
                <div className="col">
                    <Header />
                    <Route path="/" exact component={Home} />
                    <Route path="/products" exact component={Products} />
                    <Route path="/about" component={About} />
                    <Route path="/contact" component={Contact} />
                    <Footer />
                </div>
            </div>
        </div>
    </div>
);

export default App;
