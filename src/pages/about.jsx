
import 'react-notion-x/src/styles.css';

import React from 'react';
import { useState, useEffect } from 'react';
import { NotionRenderer } from 'react-notion-x';
import { ABOUT_NOTION_URL } from '../utils/endpoints';
import axios from "axios";

//! DEBUG

function NotionStyleOverrides() {
    return (
        <style>
            {`
        .notion-h3 {
          color: red !important;
        }
      `}
        </style>
    );
}

//! END DEBUG



function AboutPage() {
    const [recordMap, setRecordMap] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotionPage = async () => {
            try {
                const response = await axios.get(ABOUT_NOTION_URL);
                const data = response.data;
                if (data && typeof data === 'object') {
                    setRecordMap({ block: data });
                } else {
                    setError("Invalid Notion data format received.");
                }
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

    // Then in your return:
    return (
        <>
            <NotionStyleOverrides />
            <NotionRenderer
                recordMap={recordMap}
                fullPage={false}
            />
            <iframe src="https://inetintel.notion.site/ebd//1cafd138961080fd9bcad7ffe3dd5a85" width="100%" style="overflow: hidden; border: none;" frameborder="0" allowfullscreen />
        </>
    );
}

export default AboutPage;
