

import React from 'react';
import LinkA from "../utils/linka";
import CodeRepos from './repos';
import Methodology from './method';
import grip_concept from '../images/diagrams/grip_conceptual_pipeline.png';
import data_flow from '../images/diagrams/data_flow.png';

import { useState, useEffect } from 'react';
import { NotionRenderer } from 'react-notion-x';
import { ABOUT_NOTION_URL } from '../utils/endpoints';
import axios from "axios";

// const AboutPage = ()=>{

//     return(
//         <div className="about-page-container">
//             <div className="image-container">
//                 <div className="image-wrapper">
//                     <img src={grip_concept} alt="Grip Conceptual Pipeline" className="responsive-image" />
//                     <p className="image-label">GRIP Conceptual Pipeline</p>
//                 </div>
//                 <div className="image-wrapper">
//                     <img src={data_flow} alt="Data Flow Diagram" className="responsive-image" />
//                     <p className="image-label">Data Flow Diagram</p>
//                 </div>
//             </div>
//             <Methodology />
//             <CodeRepos />
//         </div>
//     )

function AboutPage() {
    const [recordMap, setRecordMap] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotionPage = async () => {
            try {
                const response = await axios.get(ABOUT_NOTION_URL);
                const data = response.data;
                setRecordMap(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotionPage();
    }, []);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!recordMap) return <div>No data</div>;

    return (
        <div className="about-page">
            <NotionRenderer
                recordMap={recordMap}
                fullPage={true}
            />
        </div>
    );
}

export default AboutPage;
