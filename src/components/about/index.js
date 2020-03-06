import React from 'react';
import './about.scss';

export default props => {
    return (
        <div className="row"> 
            <div className="col-12 div1">
                <main>
                    <div className="row">
                        <div className="col-6 textbox">
                            <h2>About Us</h2>
                            <p>
                                We are adventurous vintners in the foothills of Orange County. Using a wide variety of vines from the California coast, we have perfected our wines inland.
                            </p>
                            <p>
                                Please feel free to visit us in Orange County.
                            </p>
                        </div>
                        <div className="col-4"></div>
                    </div>
                </main>
            </div>
        </div>
    );
}