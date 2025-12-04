import React from 'react';
import './footer.css';

export default props => {
    const year = new Date().getFullYear();
    return (
        <div className="row">
            <footer>
                <div className="col-sm-12">
                    <div className="row">
                        <div className="col-sm-4 email">order@vinesecret.com</div> 
                        <div className="col-sm-4 date">Copyright &copy; {year} VineSecret.</div>
                        <div className="col-sm-4 phone"><i className="fa fa-phone"></i>&nbsp;&nbsp;800-264-2099</div> 
                    </div>
                </div>
            </footer>
        </div>
    );
}
