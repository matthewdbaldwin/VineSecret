import React from 'react';
import { Link } from 'react-router-dom';
import './nav.scss';

export default props => {
    return (
        <nav className="navbar justify-content-right">
            <ul className="main-nav">
                <li className="nav-item nav-link active">
                    <Link className={`menuList link`} to="/">HOME</Link>
                </li>
                <li className="nav-item nav-link">
                    <Link className={`menuList link`} to="/products">PRODUCTS</Link>
                </li>
                <li className="nav-item nav-link">
                    <Link className={`menuList link`} to="/contact">CONTACT</Link>
                </li>
                <li className="nav-item nav-link">
                    <Link className={`menuList link`} to="/about">ABOUT US</Link>
                </li>
                <li><a href="javascript:void(0);" class="icon" onclick="myFunction()">
                    <i class="fa fa-bars"></i></a>
                </li>
            </ul>
        </nav>
    );
}