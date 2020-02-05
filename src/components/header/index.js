import React from 'react';
import './header.scss';
import Nav from '../nav';

export default props => {
    return (
        <header className="row">
                <div className="col-2 main-icon"></div>
                <div className="col-8"><Nav/></div>
                <h2>The Vines Are Our Secret!</h2>
        </header>
    )
}