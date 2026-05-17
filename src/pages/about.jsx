

import React from 'react';
import { Link } from 'react-router-dom';
import CodeRepos from './repos';
import Methodology from './method';
import grip_concept from '../images/diagrams/grip_conceptual_pipeline.png';
import data_flow from '../images/diagrams/data_flow.png';

const AboutPage = ()=>{

    return(
        <div className="about-page-container">
            <div className="image-container">
                <div className="image-wrapper">
                    <img src={grip_concept} alt="Grip Conceptual Pipeline" className="responsive-image" />
                    <p className="image-label">GRIP Conceptual Pipeline</p>
                </div>
                <div className="image-wrapper">
                    <img src={data_flow} alt="Data Flow Diagram" className="responsive-image" />
                    <p className="image-label">Data Flow Diagram</p>
                </div>
            </div>
            <Methodology />
            <CodeRepos />
            <div id='hijacks' className='container-fluid subpage' style={{ paddingBottom: '40px' }}>
                <div className="api-aup-section">
                    <h2 className="section-header">
                        API Acceptable Use Policy
                    </h2>
                    <div className="repos__description">
                        To support academic research and educational projects, we provide access to data via our public API. Use of this API is subject to rate-limiting, data usage, and scraping terms. Please read our complete <Link to="/aup" style={{ textDecoration: 'underline', fontWeight: 'bold' }}>Acceptable Use Policy (AUP)</Link> to learn more about our permitted use and guidelines.
                    </div>
                </div>
            </div>
        </div>
    )
}



export default AboutPage;
