import React from 'react';
import { Link } from 'react-router-dom';
import './home.css';

export default props => {
    return (
        <div className="row">
            <div className="welcome col-12">
                <main className="cta col-sm-12 ">
                    <Link to="/products">
                        <button className="button">
                        View our new<br></br>Spring Red Wines!
                        </button> 
                    </Link>  
                </main>  
            </div>
            <div className="middle col-12">
            </div>
            <div className="col-12 newsletter">
                <Link to="/contact">
                    <button className='button'>
                        Sign up for our<br></br>Newsletter!
                    </button>
                </Link>
            </div>
        </div>
    );
}
