import React from 'react';
import './home.scss';

export default props => {
    return (
        <div className="row">
            <div className="welcome col-12">
                <main className="cta col-sm-12 ">
                    <button className="button">
                        View our new<br></br>Spring Red Wines!
                    </button>  
                </main>  
            </div>
            <div className="col-12 newsletter">
                <button className='button'>
                    Sign up for our<br></br>Newsletter!
                </button>
            </div>
        </div>
    );
}