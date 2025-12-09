import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { applyMiddleware, createStore } from 'redux';
import rootReducer from './reducers';
import App from './components/app';
import 'bootstrap/dist/css/bootstrap.min.css';
import thunk from './middleware/thunk';

const store = createStore(rootReducer, applyMiddleware(thunk));

const rootElement = document.getElementById('root');

// Support both legacy ReactDOM.render (for older installs) and the React 18
// createRoot API when available.
if (typeof ReactDOM.createRoot === 'function') {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
        <Provider store={store}>
            <Router>
                <App />
            </Router>
        </Provider>,
    );
} else {
    ReactDOM.render(
        <Provider store={store}>
            <Router>
                <App />
            </Router>
        </Provider>,
        rootElement,
    );
}
