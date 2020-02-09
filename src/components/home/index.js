import React from 'react';


export default props => {
    return (
        <div className="row">
            <div className="welcome col-12">
                <h1>Welcome to VineSecret!</h1>
                <main className="cta col-4 ">
                    <button className="button">
                        Click here<br>
                        </br>for our wine selection!
                    </button>  
                </main>  
            </div>
            <div className="col-12 newsletter">
                <button className='btn-warning'>
                    Great deals online in our Newsletter!
                </button>
            </div>
        </div>
    );
}