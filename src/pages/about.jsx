

import React from 'react';
import LinkA from "../utils/linka";
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
        </div>
    )
}



export default AboutPage;
