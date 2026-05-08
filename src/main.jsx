import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import App from './components/app';
import ErrorBoundary from './components/ErrorBoundary';

const store = configureStore({ reducer: rootReducer });

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
    <ErrorBoundary>
        <Provider store={store}>
            <Router>
                <App />
            </Router>
        </Provider>
    </ErrorBoundary>,
);
