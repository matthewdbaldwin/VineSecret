import React from 'react';
import Schedule from '../general/schedule/index.js'
import './contact.scss';
import ContactForm from './contact_form.js';
import updots from '../../assets/images/up-dots.png'
import downdots from '../../assets/images/down-dots.png'

export default props => {
    return (
        
        <div className="container">
            <div className="row contactdiv1">
                <div className ="col">      
                    <h2 >
                        Contact us today!
                    </h2>
                    <p>
                    Talk wine to us! At VineSecret we love hearing from our customers. Send your questions, comments and flavor suggestions to:
                    </p>
                    <p>
                        <a href="mailto:office@vinesecret.com">office@vinesecret.com</a>
                    </p>
                    <p>
                    Our expert vintners are waiting to share our wines with you. Our sommelier team is currently blending up a wonderful newsletter for you with our beloved wines. 
                    </p>
                    <img src={updots} align="right"></img>    
                </div>
                <div className ="col formdiv">  
                   <ContactForm/>
                </div>
            </div>
            <div className="row contactdiv2">
                <div className="col">
                    <h5>For phone orders,our work schedule is:</h5>
                    <Schedule/>
                </div>
                <div className="col contactdiv3">
                    <img src={downdots} align="center"></img>
                </div>
            </div>
        </div>
    );
}
