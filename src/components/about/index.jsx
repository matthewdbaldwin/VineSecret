import React from 'react';
import './about.css';

const About = () => (
    <section className="about">
        <div className="about-grid">
            <div className="story">
                <p className="eyebrow">Our story</p>
                <h2>Orange County roots. Coastal influence. Cellar patience.</h2>
                <p>
                    VineSecret was founded by growers who believed the best bottles start with healthy soils and a relentless respect for place.
                    We farm five estate vineyards by hand, ferment in small lots, and taste every barrel until the blend sings.
                </p>
                <p>
                    Our cellar team experiments with native yeasts, amphora, and neutral oak to let each vintage speak for itself.
                    When you visit, you'll meet the people pruning, picking, and pouring.
                </p>
            </div>
            <div className="values">
                <div className="value-card">
                    <h4>Regenerative farming</h4>
                    <p>Cover crops, minimal till, and owl boxes keep the vineyards in balance without shortcuts.</p>
                </div>
                <div className="value-card">
                    <h4>Hands-on winemaking</h4>
                    <p>We foot tread select lots, taste daily, and never rush a ferment. Craft over convenience.</p>
                </div>
                <div className="value-card">
                    <h4>Shared table hospitality</h4>
                    <p>From club shipments to intimate dinners, every interaction is designed to feel like family.</p>
                </div>
            </div>
        </div>
    </section>
);

export default About;
