import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import App from './components/app';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(
    <Provider>
        <Router>
            <App />
        </Router>
    </Provider>,
        document.getElementById('root')
);
