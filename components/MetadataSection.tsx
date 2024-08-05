import React from 'react';

interface MetadataSectionProps {
    publishedDate: string;
    description: string;
    links: Record<string, string>;
}

const MetadataSection: React.FC<MetadataSectionProps> = ({ publishedDate, description, links }) => {
    return (
        <div className="bg-white p-4 mb-4 shadow-lg rounded-lg">
            <h2 className="text-2xl font-bold mb-2">Package Metadata</h2>
            <p>Published: {publishedDate}</p>
            <p>Description: {description}</p>
            <div>
                <h3 className="text-xl font-semibold">Links</h3>
                <ul className="list-disc ml-6">
                    {Object.entries(links).map(([label, url], index) => (
                        <li key={index}><a href={url}>{label}</a></li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MetadataSection;
