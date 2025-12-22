import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import rootReducer from './reducers';
import App from './components/app';
import 'bootstrap/dist/css/bootstrap.min.css';
import thunk from './middleware/thunk';

const store = createStore(rootReducer, applyMiddleware(thunk));

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    <Provider store={store}>
        <Router>
            <App />
        </Router>
    </Provider>,
);
