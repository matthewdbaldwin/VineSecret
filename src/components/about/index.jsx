import React from 'react';
import grapevines from '../../assets/images/Grapevines.webp';
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
                    Our roots are in Orange County, where marine layers push in from the Pacific and cool the vines through the long back half of summer.
                    That swing between warm days and cold nights is what keeps our whites taut and gives our reds something to say.
                    We didn't end up here by accident. The land earned it.
                </p>
                <p>
                    In the cellar, we work with native yeasts, amphora, and neutral oak because we'd rather coax than correct.
                    If a ferment runs slow, we watch it. If a barrel needs more time, it gets it.
                    We're not trying to iron out the interesting parts.
                </p>
                <p>
                    Before any blending decision gets made, every lot goes in blind. We taste, argue, taste again.
                    It's loud and it takes all day and we wouldn't have it any other way.
                    The best wine in the room wins, no matter whose barrel it came from.
                </p>
                <p>
                    Come visit and you'll walk the actual block, see the actual tank, drink the actual wine.
                    No scripts, no theater. Just the people who grew it and the story behind the glass.
                </p>
                <p>
                    We're not chasing volume. We're after the bottle you remember years later and can't quite explain why.
                    The one that fit the night perfectly. That's the one we're always trying to make.
                </p>
            </div>
            <div className="about-image">
                <img src={grapevines} alt="Grapevines on the estate" />
                <blockquote className="about-image__caption">
                    "We're after the bottle you remember years later and can't quite explain why. The one that fit the night perfectly."
                </blockquote>
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
                <div className="value-card">
                    <h4>Sustainability</h4>
                    <p>Solar-powered cellars, recycled glass, and water reclamation keep our footprint as light as our pours.</p>
                </div>
            </div>
        </div>
    </section>
);

export default About;
