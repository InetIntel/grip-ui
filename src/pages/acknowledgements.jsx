import React, { useEffect, useState } from 'react';
import { NotionAPI } from 'notion-client';
import { NotionRenderer } from 'react-notion-x';

export default function NotionWithTOC({ pageId }) {
    const [recordMap, setRecordMap] = useState(null);
    const [headings, setHeadings] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const notion = new NotionAPI();
            const data = await notion.getPage(pageId);
            setRecordMap(data);
            setHeadings(extractHeadings(data));
        };

        fetchData();
    }, [pageId]);

    const extractHeadings = (recordMap) => {
        const blocks = recordMap.block;
        const result = [];

        for (const id in blocks) {
            const block = blocks[id].value;
            if (block.type?.startsWith('heading_')) {
                const text = block.properties?.title?.[0]?.[0];
                result.push({ id, text, level: block.type });
            }
        }

        return result;
    };

    if (!recordMap) return <div>Loading...</div>;

    return (
        <div style={{ display: 'flex' }}>
            <aside style={{ width: '200px', padding: '1rem' }}>
                <h3>Headings</h3>
                <ul>
                    {headings.map(h => (
                        <li key={h.id}>
                            <a href={`#${h.id}`}>{h.text}</a>
                        </li>
                    ))}
                </ul>
            </aside>
            <main style={{ flex: 1 }}>
                <NotionRenderer recordMap={recordMap} fullPage />
            </main>
        </div>
    );
}