import React from 'react';
import './home.scss';

export default props => {
    return (
        <div className="row">
            <div className="welcome col-12">
                <h1>Welcome to VineSecret!</h1>
                <main className="cta col-12 ">
                    <button className="button">
                        <h3>View our new Spring Red Wines!</h3>
                    </button>  
                </main>  
            </div>
            <div className="col-12 newsletter">
                <button className='btn-warning'>
                    <h3>Sign up for our Newsletter!</h3>
                </button>
            </div>
        </div>
    );
}