import React from 'react';
import './header.scss';
import Nav from '../nav';

export default props => {
    return (
        <div className="row">
            <header >
                <div className="row">
                    <div className="col-4 main-icon"></div>
                    <div className="col-8 main-nav"><Nav/></div>
                </div>
                <div className="row">
                    <div className="col-12">
                    <h2>The Vines Are Our Secret!</h2> </div>
                </div>
            </header>
        </div>
    )
}